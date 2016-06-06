var ui;
(function (ui) {
    var UIGlobal = (function (_super) {
        __extends(UIGlobal, _super);
        function UIGlobal() {
            _super.apply(this, arguments);
        }
        var d = __define,c=UIGlobal,p=c.prototype;
        UIGlobal.init = function (s, compL, popupL, topL) {
            if (compL === void 0) { compL = null; }
            if (popupL === void 0) { popupL = null; }
            if (topL === void 0) { topL = null; }
            UIGlobal.stage = s;
            if (null == compL) {
                compL = new eui.UILayer();
                compL.name = "comp";
                UIGlobal.stage.addChild(compL);
            }
            UIGlobal.compLayer = compL;
            if (null == popupL) {
                popupL = new eui.UILayer();
                popupL.name = "popup";
                UIGlobal.stage.addChild(popupL);
            }
            UIGlobal.popupLayer = popupL;
            UIGlobal.popup = new ui.PopUpManager(popupL);
            if (null == topL) {
                topL = new eui.UILayer();
                topL.name = "tooltip";
                UIGlobal.stage.addChild(topL);
            }
            UIGlobal.topLayer = topL;
            UIGlobal.resizeHandler();
            UIGlobal.stage.addEventListener(egret.Event.RESIZE, UIGlobal.resizeHandler, null);
        };
        UIGlobal.resizeHandler = function (env) {
            if (env === void 0) { env = null; }
            var w = UIGlobal.stage.stageWidth;
            var h = UIGlobal.stage.stageHeight;
            if (w > 0 && h > 0) {
                UIGlobal.width = w;
                UIGlobal.height = h;
                UIGlobal.popup.setSize(w, h);
            }
        };
        return UIGlobal;
    }(egret.HashObject));
    ui.UIGlobal = UIGlobal;
    egret.registerClass(UIGlobal,'ui.UIGlobal');
})(ui || (ui = {}));
