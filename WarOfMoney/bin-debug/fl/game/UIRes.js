var game;
(function (game) {
    var UIRes = (function () {
        function UIRes() {
        }
        var d = __define,c=UIRes;p=c.prototype;
        UIRes.getTMX = function (id) {
            return "resource/map/" + id + ".tmx";
        };
        return UIRes;
    })();
    game.UIRes = UIRes;
    egret.registerClass(UIRes,"game.UIRes");
})(game || (game = {}));
