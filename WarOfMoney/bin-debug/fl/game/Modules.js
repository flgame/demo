var game;
(function (game) {
    var Modules = (function (_super) {
        __extends(Modules, _super);
        function Modules() {
            _super.apply(this, arguments);
        }
        var d = __define,c=Modules,p=c.prototype;
        Modules.init = function (startupFuns) {
            if (startupFuns === void 0) { startupFuns = null; }
            if (Modules.inited)
                return startupFuns;
            Modules.inited = true;
            startupFuns = startupFuns || [];
            startupFuns.push(Modules.registerViews);
            //var register:fl.CompManager = fl.compMgr;
            var f;
            f = function () {
                //register static views
                //register.registerStaticComp(null,TopView,TopViewMediator);
            };
            startupFuns.push(f);
            return startupFuns;
        };
        Modules.registerViews = function () {
            //register dynamical views
            var register = game.compMgr;
            register.registerView(game.LoginView, null, game.LoginMediator);
            register.registerView(game.SceneView, null, game.SceneMediator);
        };
        Modules.inited = false;
        return Modules;
    }(egret.HashObject));
    game.Modules = Modules;
    egret.registerClass(Modules,'game.Modules');
})(game || (game = {}));
