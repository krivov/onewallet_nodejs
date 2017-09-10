const api = require("./api");
const auth = require("./auth");
const broadcast = require("./broadcast");
const config = require("./config");
const formatter = require("./formatter")(api);
const utils = require("./utils");

const golos = {
  api,
  auth,
  broadcast,
  config,
  formatter,
  utils
};

if (typeof window !== "undefined") {
  window.golos = golos;
}

if (typeof global !== "undefined") {
  global.golos = golos;
}

exports = module.exports = golos;
