'use strict';

const express = require('express');
const app = express();

var steem = require('steem');
var bitcoin = require('bitcoinjs-lib');

var golos = require("./golos-js/lib/index");

//golos.api.setOptions({ url: 'wss://ws.golos.io' }); // assuming websocket is work at ws.golos.io
//golos.config.set('address_prefix','GLS');
//golos.config.set('chain_id','782a3039b478c839e4cb0c941ff4eaeb7df40bdd68bd441afd444b9da763de12');

app.get('/', function (req, res) {
  res.send('Hello World!')
});

app.get('/getAccount', function (req, res) {
  var output = {};

  if (req.query.name) {
    golos.api.getAccounts([req.query.name], function(err, result) {
      if (!err) {
        res.json({data: result[0].balance.match(/\d*\.\d*/)[0]});
      } else {
        res.json({error: err});
      }
    });
  } else {
    res.json({error: "Empty name"});
  }
});

app.get('/makeTransaction', function (req, res) {
  var output = {};

  if (req.query.address_from && req.query.address_to && req.query.private && req.query.value_return && req.query.value_send) {
    var bitcore = require("bitcore-lib");
    var fs = require("fs");
    var request = require('request');
    var Async = require("async");

    /** END EXAMPLE INPUT, YOU SHOULD MODIFY TO YOUR CASE **/
// Your address
    var from_public = req.query.address_from;
// Your private key
    var private_key = req.query.private;

// Define which addresses you wan to send, just 1 item or more, below are 2 example addresses
    var send_addresses = [
      //adress and amount in satoshies
      { address: req.query.address_to, amount: parseInt(req.query.value_send) },
      { address: req.query.address_from, amount: parseInt(req.query.value_return) }
    ];


    /** END EXAMPLE INPUT, YOU SHOULD MODIFY TO YOUR CASE **/


    const push_bitcoin_url = "https://blockchain.info/pushtx";
    const check_address_url = "https://api.blockcypher.com/v1/btc/main/addrs/{address}?unspentOnly=1";
      //According https://api.blockcypher.com/v1/btc/main
    const fee_per_kb = 3500;
    const min_transaction_amount = 300;

    Async.waterfall([


      function (callback) {

        var check_url = check_address_url.replace('{address}', from_public);
        console.log("check_url", check_url);

        request(check_url, function (error, response, body) {

          console.log(error, body);

          if (!error && response.statusCode == 200) {
            //console.log(body);
            var json = JSON.parse(body);

            var unspend_transactions = [];

            if (json.unconfirmed_txrefs) {
              for (var i = 0; i < json.unconfirmed_txrefs.length; i++) {
                var item = json.unconfirmed_txrefs[i];

                if (!item.double_spend) {
                  //if there is unconfirmation transaction but there is my public address here
                  if (item.address == from_public) {
                    unspend_transactions.push(item);
                  }
                }
                else {
                  console.log("detected double spend on unconfirmation transactions");
                }
              }
            }

            if (json.txrefs) {
              for (var i = 0; i < json.txrefs.length; i++) {
                var item = json.txrefs[i];

                if (!item.double_spend) {
                  unspend_transactions.push(item);

                } else {
                  console.log("detected double spend on confirmed transactions");
                }
              }
            }

            callback(null, unspend_transactions);

          } else {
            callback("can not get input address information");
          }
        })

      },
      function (input_transactions, callback) {


        //console.log("input_transactions",input_transactions);


        var script = new bitcore.Script(new bitcore.Address(from_public)).toHex();

        var privateKey = new bitcore.PrivateKey(private_key);

        var total_value = 0;

        var transaction = new bitcore.Transaction();

        for (var i = 0; i < input_transactions.length; i++) {
          var item = input_transactions[i];
          var utxo = {
            "txId": item.tx_hash,
            "outputIndex": item.tx_output_n,
            "address": from_public,
            "script": script,
            "satoshis": item.value
          };

          total_value += item.value;

          transaction.from(utxo)

        }

        //Total output amount by satoshies

        var total_output = 0;
        for (var i = 0; i < send_addresses.length; i++) {
          var address_item = send_addresses[i];
          transaction.to(address_item.address, address_item.amount)
          total_output += address_item.amount;
        }

        //  estimate size of transaction and calculate fee
        var fee = Math.floor(fee_per_kb * transaction._estimateSize() / 1024);

        console.log("total_output", total_output);
        console.log("total_value", total_value);
        console.log("fee", fee);

        if (total_value < total_output + fee) {
          return callback("Not enough for create transaction");
        }

        var change_amount = total_value - total_output - fee;

        console.log("change_amount", change_amount);

        if (change_amount > 0 && change_amount < min_transaction_amount) {
          return callback("The change amount is too small");
        }

        transaction.fee(fee);
        if (change_amount > 0) {
          transaction.change(from_public)
        }

        transaction.enableRBF()
          .sign(privateKey);

        var tx_hex = transaction.serialize();

        console.log("tx_hex", tx_hex);

        /*console.log( JSON.stringify(transaction.toObject()), "end");*/



        var post_params = {
          url: push_bitcoin_url, form: { tx: tx_hex }
        };

        request.post(post_params, function (error, response, body) {

          if (!error && response.statusCode == 200) {
            console.log("body", body); // Show the HTML for the Google homepage.
          } else {
            console.log("body", body); // Show the HTML for the Google homepage.
            console.log("statusCode", response.statusCode);
          }

          callback(null);

        });

      }
    ], function (err, result) {
      console.log('info', "END TASK", result);

      if (err) {
        console.log('info', err);
        res.json({result: "error", error: err});
      } else {
        res.json({result: "ok"});
      }
    });
  } else {
    res.json({error: "Empty query"});
  }
});

app.get('/sendGolos', function (req, res) {
  var output = {};

  console.log("QUERY", req.query);

  if (req.query.from && req.query.to && req.query.password && req.query.amount && req.query.text) {
    var t = golos.auth.getPrivateKeys(req.query.from, req.query.password);
    console.log(t);

    golos.broadcast.transfer(t.owner, req.query.from, req.query.to, req.query.amount + " GOLOS", "apps-crunch", function(err, result) {
      console.log(err, result);

      if (err) {
        res.json({result: "error", error: err});
      } else {
        res.json({result: "ok"});
      }
    });
  } else {
    res.json({error: "Empty query"});
  }
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});