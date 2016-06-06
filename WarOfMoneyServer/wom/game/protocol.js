/**
 * Created by feir on 2015/11/26.
 */
var fl = require("../lib/flgame_nodejs");
var Protocol;
module.exports = Protocol = function() {

};
var BASE = fl.Protocol.CMD_TYPE_BASE = Protocol.BASE = 100000;
var i = 1;
var j = 1;
Protocol.LOGIN_REQ = BASE * i + j;
j++;
Protocol.LOGIN_RET = BASE * i + j;
j++;