var game;
(function (game) {
    var SceneAction = (function (_super) {
        __extends(SceneAction, _super);
        function SceneAction() {
            _super.apply(this, arguments);
        }
        var d = __define,c=SceneAction;p=c.prototype;
        return SceneAction;
    })(fl.BaseAction);
    game.SceneAction = SceneAction;
    egret.registerClass(SceneAction,"game.SceneAction");
})(game || (game = {}));
