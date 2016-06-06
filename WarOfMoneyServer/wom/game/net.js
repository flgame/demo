/**
 * Created by feir on 2015/11/26.
 */
var fl = require("../lib/flgame_nodejs");
module.exports = exports = net;

function net() {

}
var GameNet = net.GameNet = function(socket) {
    fl.BaseNet.call(this, socket);
}
GameNet.prototype.__proto__ = fl.BaseNet.prototype;