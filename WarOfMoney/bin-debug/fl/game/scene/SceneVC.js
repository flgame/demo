var game;
(function (game) {
    var SceneMediator = (function (_super) {
        __extends(SceneMediator, _super);
        function SceneMediator() {
            _super.apply(this, arguments);
        }
        var d = __define,c=SceneMediator,p=c.prototype;
        p.onRegister = function () {
            _super.prototype.onRegister.call(this);
            this.viewComponent.updateData();
        };
        return SceneMediator;
    }(fl.Mediator));
    game.SceneMediator = SceneMediator;
    egret.registerClass(SceneMediator,'game.SceneMediator');
    var SceneView = (function (_super) {
        __extends(SceneView, _super);
        function SceneView() {
            _super.call(this);
            this.skinName = "skins.SceneSkin";
        }
        var d = __define,c=SceneView,p=c.prototype;
        p.updateData = function (obj) {
            _super.prototype.updateData.call(this, obj);
            this.nameL.text = game.LoginAction.getInstance().loginRet.username;
        };
        return SceneView;
    }(ui.BaseStaticComp));
    game.SceneView = SceneView;
    egret.registerClass(SceneView,'game.SceneView');
})(game || (game = {}));
