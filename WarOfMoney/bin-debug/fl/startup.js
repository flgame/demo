var fl;
(function (fl) {
    function startup(stage) {
        ui.UIGlobal.init(stage);
        egret.startTick(game.GameTime.update, stage);
        game.Protos.init();
        game.compMgr.startup();
    }
    fl.startup = startup;
})(fl || (fl = {}));
