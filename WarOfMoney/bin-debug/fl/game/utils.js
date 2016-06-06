var game;
(function (game) {
    function showUI(arr, showFlag, data) {
        if (showFlag === void 0) { showFlag = "toggle"; }
        if (!arr || arr.length == 0)
            return;
        var info = new game.ToggleInfo(arr[0], showFlag);
        info.data = arr.slice(1);
        game.compMgr.toggleView(info);
    }
    game.showUI = showUI;
})(game || (game = {}));
