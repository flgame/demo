/* global global */
// Setup basic express server
var appVars = global.appVars = {};

var log4js = require('log4js');
appVars.logger = log4js.getLogger("wom");

var gamenet = require("./game/net");
var flgame = require("./lib/flgame_nodejs");

var sequelize = require('./lib/models')();
appVars.sequelize = sequelize;
var Protos  = require('./lib/protos')();
appVars.Protos  = Protos;

var actions = require("./game/actions");
actions.init();

var port = process.env.PORT || 3008;
var ws = require('ws');
var wss = new ws.Server({port: port}, function() {
    console.info('Server listening on port %d', port);
});
appVars.wss = wss;
wss.on('connection', function(s) {
    flgame.netMgr.addNet(s, gamenet.GameNet);
});
