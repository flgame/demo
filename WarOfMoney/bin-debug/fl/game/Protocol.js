var game;
(function (game) {
    var Protocol = (function (_super) {
        __extends(Protocol, _super);
        function Protocol() {
            _super.apply(this, arguments);
        }
        var d = __define,c=Protocol,p=c.prototype;
        Protocol.LOGIN_REQ = 100001;
        Protocol.LOGIN_RET = 100002;
        return Protocol;
    }(egret.HashObject));
    game.Protocol = Protocol;
    egret.registerClass(Protocol,'game.Protocol');
})(game || (game = {}));
