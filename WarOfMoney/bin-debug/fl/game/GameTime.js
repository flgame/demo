var game;
(function (game) {
    var GameTime = (function (_super) {
        __extends(GameTime, _super);
        function GameTime() {
            _super.apply(this, arguments);
        }
        var d = __define,c=GameTime;p=c.prototype;
        d(GameTime, "serverTime"
            /** seconds */
            ,function () {
                return GameTime.timeServer / 1000;
            }
        );
        GameTime.update = function (t) {
            var t = egret.getTimer();
            GameTime.lastTime = GameTime.curTime;
            GameTime.curTime = t;
            if (GameTime.lastTime == 0)
                GameTime.lastTime = GameTime.curTime;
            GameTime.frameTime = GameTime.curTime - GameTime.lastTime;
            GameTime.totalFrame++;
            GameTime.lastTickClient = GameTime.curTickClient;
            GameTime.curTickClient = t / 1000 * GameTime.FRAMERATE_CLIENT;
            if (GameTime.lastTickClient == 0)
                GameTime.lastTickClient = GameTime.curTickClient;
            GameTime.timeServer = GameTime.timeServerStart + (t - GameTime.timeServerSync);
            return true;
        };
        GameTime.syncServerTick = function (v) {
            GameTime.timeServer = GameTime.timeServerStart = v;
            GameTime.timeServerSync = egret.getTimer();
            fl.eventMgr.dispatchEvent(new fl.GlobalEvent(GameTime.EVENT_SYNC_SERVER_TIME));
        };
        GameTime.traceTime = function (value) {
            console.log("******[GameTime.traceTime] " + value + "*******", GameTime.totalFrame, GameTime.lastTime, GameTime.curTime, egret.getTimer());
        };
        d(GameTime, "todayOnlineTime"
            /** by seconds */
            ,function () {
                return GameTime._serverOnlineTime + (egret.getTimer() - GameTime._setOnlineTimeTick) / 1000;
            }
            /** by seconds */
            ,function (v) {
                GameTime._serverOnlineTime = v;
                GameTime._setOnlineTimeTick = egret.getTimer();
            }
        );
        GameTime.EVENT_SYNC_SERVER_TIME = "EVENT_SYNC_SERVER_TIME";
        GameTime.FRAMERATE_SERVER = 60;
        GameTime.timeServerStart = 0;
        GameTime.timeServerSync = 0;
        GameTime.timeServer = 0;
        GameTime.FRAMERATE_CLIENT = 60;
        GameTime.lastTickClient = 0;
        GameTime.curTickClient = 0;
        GameTime.lastTime = 0;
        GameTime.curTime = 0;
        GameTime.frameTime = 0;
        GameTime.totalFrame = 0;
        GameTime._serverOnlineTime = 0;
        GameTime._setOnlineTimeTick = 0;
        return GameTime;
    })(egret.HashObject);
    game.GameTime = GameTime;
    egret.registerClass(GameTime,"game.GameTime");
})(game || (game = {}));
