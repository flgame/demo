var game;
(function (game) {
    var LoginConstants = (function () {
        function LoginConstants() {
        }
        var d = __define,c=LoginConstants,p=c.prototype;
        LoginConstants.EVENT_LOGINOK = "EVENT_LOGINOK";
        return LoginConstants;
    }());
    game.LoginConstants = LoginConstants;
    egret.registerClass(LoginConstants,'game.LoginConstants');
    var LoginAction = (function (_super) {
        __extends(LoginAction, _super);
        function LoginAction() {
            _super.call(this);
            this.mapProtocols = [
                game.Protocol.LOGIN_RET
            ];
        }
        var d = __define,c=LoginAction,p=c.prototype;
        LoginAction.getInstance = function () {
            LoginAction._instance = LoginAction._instance || fl.actionMgr.getActionByClass(LoginAction);
            return LoginAction._instance;
        };
        p.process = function (bytes, protocol) {
            if (protocol === void 0) { protocol = 0; }
            var pack = new fl.BasePack(protocol);
            switch (protocol) {
                case game.Protocol.LOGIN_RET:
                    pack.protoModel = game.Protos.defaultPB.MLoginRet;
                    pack.setBytes(bytes);
                    this.loginRet = pack.protoValue;
                    this.checkLogin();
                    break;
            }
        };
        p.checkLogin = function () {
            if (this.loginRet && this.loginRet.hashcode) {
                this.dispatch(new fl.GlobalEvent(LoginConstants.EVENT_LOGINOK));
            }
        };
        p.login = function (user) {
            var pack = new fl.BasePack(game.Protocol.LOGIN_REQ);
            pack.protoValue = user;
            this.sendPack(pack);
        };
        return LoginAction;
    }(fl.BaseAction));
    game.LoginAction = LoginAction;
    egret.registerClass(LoginAction,'game.LoginAction');
})(game || (game = {}));
