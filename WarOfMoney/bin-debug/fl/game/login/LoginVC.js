var game;
(function (game) {
    var LoginMediator = (function (_super) {
        __extends(LoginMediator, _super);
        function LoginMediator() {
            _super.apply(this, arguments);
        }
        var d = __define,c=LoginMediator,p=c.prototype;
        p.onRegister = function () {
            _super.prototype.onRegister.call(this);
            this.addContextListener(game.LoginConstants.EVENT_LOGINOK, this.loginOk, this);
        };
        p.loginOk = function (e) {
            game.sceneMgr.createScenes();
        };
        return LoginMediator;
    }(fl.Mediator));
    game.LoginMediator = LoginMediator;
    egret.registerClass(LoginMediator,'game.LoginMediator');
    var LoginView = (function (_super) {
        __extends(LoginView, _super);
        function LoginView() {
            _super.call(this);
            this.skinName = "skins.LoginSkin";
        }
        var d = __define,c=LoginView,p=c.prototype;
        p.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.loginB.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onLogin, this);
        };
        p.onLogin = function (e) {
            var req = new game.Protos.defaultPB.MLoginReq();
            req.username = this.nameT.text;
            req.password = this.passT.text;
            game.LoginAction.getInstance().login(req);
        };
        return LoginView;
    }(ui.BaseStaticComp));
    game.LoginView = LoginView;
    egret.registerClass(LoginView,'game.LoginView');
})(game || (game = {}));
