/* global appVars */
/**
 * Created by feir on 2015/11/27.
 */
var fl = require("../../lib/flgame_nodejs");
var Protocol = require("../protocol");
var Action;
module.exports = Action = function() {
    fl.BaseAction.call(this);
};
Action.protocols = [Protocol.LOGIN_REQ];
Action.prototype.__proto__ = fl.BaseAction.prototype;

Action.prototype.process = function (bytes, protocol) {
    var pack = new fl.BasePack(protocol);
    switch(protocol) {
        case Protocol.LOGIN_REQ:
            pack.protoModel = appVars.Protos.defaultPB.MLoginReq;
            pack.setBytes(bytes);
            this.loginReq = pack.protoValue;
            this.checkLogin(this.loginReq);
            break;
        default:
            appVars.logger.error("[LoginAction.process] unknown protocol " + protocol);
            break;
    }
};
Action.prototype.checkLogin = function (loginReq) {
    var __self__ = this;
    var userM = appVars.sequelize.models.user;
    var userP = new appVars.Protos.defaultPB.MLoginRet();
    userP.username = loginReq.username;
    userP.userid = 0;
    userM.findOrCreate({where: {username: loginReq.username}, defaults: {password: loginReq.password}}).then(function(result) {
        if(result) {
            var ins = result[0];
            var isCreate = result[1];
            if(isCreate || ins.password == loginReq.password) {
                userP.userid = ins.id;
                userP.hashcode = "0";
            } else {
                userP.hashcode = "-1";
            }
        } else {
            userP.hashcode = "-2";
        }
        __self__.login(userP); 
    }).error(function(result) {
        userP.hashcode = "-2";
        __self__.login(userP); 
    });
};
Action.prototype.login = function (user) {
    var pack = new fl.BasePack(Protocol.LOGIN_RET);
    pack.protoValue = user;
    this.sendPack(pack);
}