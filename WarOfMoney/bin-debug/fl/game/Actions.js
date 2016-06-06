var game;
(function (game) {
    var Actions = (function (_super) {
        __extends(Actions, _super);
        function Actions() {
            _super.apply(this, arguments);
        }
        var d = __define,c=Actions,p=c.prototype;
        Actions.init = function () {
            if (Actions.inited)
                return;
            Actions.inited = true;
            //inject actions
            Actions.injectAction(game.LoginAction);
            Actions.injectAction(game.SceneAction);
        };
        Actions.injectAction = function (actionClass) {
            fl.actionMgr.injectAction(actionClass);
        };
        Actions.uninjectAction = function (actionClass) {
            fl.actionMgr.uninjectAction(actionClass);
        };
        Actions.inited = false;
        return Actions;
    }(egret.HashObject));
    game.Actions = Actions;
    egret.registerClass(Actions,'game.Actions');
})(game || (game = {}));
