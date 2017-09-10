import EventEmitter from 'events';
import Promise from 'bluebird';
import cloneDeep from 'lodash/cloneDeep';
import defaults from 'lodash/defaults';
import isNode from 'detect-node';
import newDebug from 'debug';
import config from '../config';
import methods from './methods';
import { camelCase } from '../utils';

const debugEmitters = newDebug('golos:emitters');
const debugProtocol = newDebug('golos:protocol');
const debugSetup = newDebug('golos:setup');
const debugApiIds = newDebug('golos:api_ids');
const debugWs = newDebug('golos:ws');

let WebSocket;
if (isNode) {
  WebSocket = require('ws'); // eslint-disable-line global-require
} else if (typeof window !== 'undefined') {
  WebSocket = window.WebSocket;
} else {
  throw new Error('Couldn\'t decide on a `WebSocket` class');
}

const DEFAULTS = {
  apiIds: {
    database_api: 0,
    login_api: 1,
    follow_api: 2,
    network_broadcast_api: 4,
  },
  id: 0,
};

const expectedResponseMs = process.env.EXPECTED_RESPONSE_MS || 2000;

class Golos extends EventEmitter {
  constructor(options = {}) {
    super(options);
    defaults(options, DEFAULTS);
    this.options = cloneDeep(options);

    this.id = 0;
    this.inFlight = 0;
    this.currentP = Promise.fulfilled();
    this.apiIds = this.options.apiIds;
    this.isOpen = false;
    this.releases = [];
    this.requests = {};

    // A Map of api name to a promise to it's API ID refresh call
    this.apiIdsP = {};
  }

  setWebSocket(url) {
    console.warn("golos.api.setWebSocket(url) is now deprecated instead use golos.config.set('websocket',url)");
    debugSetup('Setting WS', url);
    config.set('websocket', url);
    this.stop();
  }

  start() {
    if (this.startP) {
      return this.startP;
    }

    const startP = new Promise((resolve, reject) => {
      if (startP !== this.startP) return;
      const url = config.get('websocket');
      this.ws = new WebSocket(url);

      const releaseOpen = this.listenTo(this.ws, 'open', () => {
        debugWs('Opened WS connection with', url);
        this.isOpen = true;
        releaseOpen();
        resolve();
      });

      const releaseClose = this.listenTo(this.ws, 'close', () => {
        debugWs('Closed WS connection with', url);
        this.isOpen = false;
        delete this.ws;
        this.stop();

        if (startP.isPending()) {
          reject(new Error(
            'The WS connection was closed before this operation was made'
          ));
        }
      });

      const releaseMessage = this.listenTo(this.ws, 'message', (message) => {
        debugWs('Received message', message.data);
        const data = JSON.parse(message.data);
        const id = data.id;
        const request = this.requests[id];
        if (!request) {
          debugWs('Golos.onMessage error: unknown request ', id);
          return;
        }
        delete this.requests[id];
        this.onMessage(data, request);
      });

      this.releases = this.releases.concat([
        releaseOpen,
        releaseClose,
        releaseMessage,
      ]);
    });

    this.startP = startP;
    this.getApiIds();

    return startP;
  }

  stop() {
    debugSetup('Stopping...');
    if (this.ws) this.ws.close();
    this.apiIdsP = {};
    delete this.startP;
    delete this.ws;
    this.releases.forEach((release) => release());
    this.releases = [];
  }

  listenTo(target, eventName, callback) {
    debugEmitters('Adding listener for', eventName, 'from', target.constructor.name);
    if (target.addEventListener) target.addEventListener(eventName, callback);
    else target.on(eventName, callback);

    return () => {
      debugEmitters('Removing listener for', eventName, 'from', target.constructor.name);
      if (target.removeEventListener) target.removeEventListener(eventName, callback);
      else target.removeListener(eventName, callback);
    };
  }

  /**
   * Refreshes API IDs, populating the `Golos::apiIdsP` map.
   *
   * @param {String} [requestName] If provided, only this API will be refreshed
   * @param {Boolean} [force] If true the API will be forced to refresh, ignoring existing results
   */

  getApiIds(requestName, force) {
    if (!force && requestName && this.apiIdsP[requestName]) {
      return this.apiIdsP[requestName];
    }

    const apiNamesToRefresh = requestName ? [requestName] : Object.keys(this.apiIds);
    apiNamesToRefresh.forEach((name) => {
      debugApiIds('Syncing API ID', name);
      this.apiIdsP[name] = this.getApiByNameAsync(name).then((result) => {
        if (result != null) {
          this.apiIds[name] = result;
        } else {
          debugApiIds('Dropped null API ID for', name, result);
        }
      });
    });

    // If `requestName` was provided, only wait for this API ID
    if (requestName) {
      return this.apiIdsP[requestName];
    }

    // Otherwise wait for all of them
    return Promise.props(this.apiIdsP);
  }


  onMessage(message, request) {
    const {api, data, resolve, reject, start_time} = request;
    debugWs('-- Golos.onMessage -->', message.id);
    const errorCause = message.error;
    if (errorCause) {
      const err = new Error(
        // eslint-disable-next-line prefer-template
        (errorCause.message || 'Failed to complete operation') +
        ' (see err.payload for the full error payload)'
      );
      err.payload = message;
      reject(err);
      return;
    }

    if (api === 'login_api' && data.method === 'login') {
      debugApiIds(
        'network_broadcast_api API ID depends on the WS\' session. ' +
        'Triggering a refresh...'
      );
      this.getApiIds('network_broadcast_api', true);
    }

    debugProtocol('Resolved', api, data, '->', message);
    this.emit('track-performance', data.method, Date.now() - start_time);
    delete this.requests[message.id];
    resolve(message.result);
  }

  send(api, data, callback) {
    debugSetup('Golos::send', api, data);
    const id = data.id || this.id++;
    const startP = this.start();

    const apiIdsP = api === 'login_api' && data.method === 'get_api_by_name'
      ? Promise.fulfilled()
      : this.getApiIds(api);

    if (api === 'login_api' && data.method === 'get_api_by_name') {
      debugApiIds('Sending setup message');
    } else {
      debugApiIds('Going to wait for setup messages to resolve');
    }

    this.currentP = Promise.join(startP, apiIdsP)
      .then(() => new Promise((resolve, reject) => {
        if (!this.ws) {
          reject(new Error(
            'The WS connection was closed while this request was pending'
          ));
          return;
        }

        const payload = JSON.stringify({
          id,
          method: 'call',
          params: [
            this.apiIds[api],
            data.method,
            data.params,
          ],
        });

        debugWs('Sending message', payload);
        this.requests[id] = {
          api,
          data,
          resolve,
          reject,
          start_time: Date.now()
        };

        // this.inFlight += 1;
        this.ws.send(payload);
      }))
      .nodeify(callback);

    return this.currentP;
  }

  streamBlockNumber(mode = 'head', callback, ts = 200) {
    if (typeof mode === 'function') {
      callback = mode;
      mode = 'head';
    }
    let current = '';
    let running = true;

    const update = () => {
      if (!running) return;

      this.getDynamicGlobalPropertiesAsync()
        .then((result) => {
          const blockId = mode === 'irreversible'
            ? result.last_irreversible_block_num
            : result.head_block_number;

          if (blockId !== current) {
            if (current) {
              for (let i = current; i < blockId; i++) {
                if (i !== current) {
                  callback(null, i);
                }
                current = i;
              }
            } else {
              current = blockId;
              callback(null, blockId);
            }
          }

          Promise.delay(ts).then(() => {
            update();
          });
        }, (err) => {
          callback(err);
        });
    };

    update();

    return () => {
      running = false;
    };
  }

  streamBlock(mode = 'head', callback) {
    if (typeof mode === 'function') {
      callback = mode;
      mode = 'head';
    }

    let current = '';
    let last = '';

    const release = this.streamBlockNumber(mode, (err, id) => {
      if (err) {
        release();
        callback(err);
        return;
      }

      current = id;
      if (current !== last) {
        last = current;
        this.getBlock(current, callback);
      }
    });

    return release;
  }

  streamTransactions(mode = 'head', callback) {
    if (typeof mode === 'function') {
      callback = mode;
      mode = 'head';
    }

    const release = this.streamBlock(mode, (err, result) => {
      if (err) {
        release();
        callback(err);
        return;
      }

      if (result && result.transactions) {
        result.transactions.forEach((transaction) => {
          callback(null, transaction);
        });
      }
    });

    return release;
  }

  streamOperations(mode = 'head', callback) {
    if (typeof mode === 'function') {
      callback = mode;
      mode = 'head';
    }

    const release = this.streamTransactions(mode, (err, transaction) => {
      if (err) {
        release();
        callback(err);
        return;
      }

      transaction.operations.forEach((operation) => {
        callback(null, operation);
      });
    });

    return release;
  }
}

// Generate Methods from methods.json
methods.forEach((method) => {
  const methodName = method.method_name || camelCase(method.method);
  const methodParams = method.params || [];

  Golos.prototype[`${methodName}With`] =
    function Golos$$specializedSendWith(options, callback) {
      const params = methodParams.map((param) => options[param]);
      return this.send(method.api, {
        method: method.method,
        params,
      }, callback);
    };

  Golos.prototype[methodName] =
    function Golos$specializedSend(...args) {
      const options = methodParams.reduce((memo, param, i) => {
        memo[param] = args[i]; // eslint-disable-line no-param-reassign
        return memo;
      }, {});
      const callback = args[methodParams.length];

      return this[`${methodName}With`](options, callback);
    };
});

Promise.promisifyAll(Golos.prototype);

// Export singleton instance
const golos = new Golos();
exports = module.exports = golos;
exports.Golos = Golos;
exports.Golos.DEFAULTS = DEFAULTS;
