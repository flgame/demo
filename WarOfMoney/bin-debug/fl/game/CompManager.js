var game;
(function (game) {
    var ToggleInfo = (function (_super) {
        __extends(ToggleInfo, _super);
        function ToggleInfo(viewType, toggleType) {
            if (toggleType === void 0) { toggleType = "toggle"; }
            _super.call(this);
            this.viewType = "";
            this.toggleType = ToggleInfo.TOGGLE_TYPE_TOGGLE;
            this.updateOtherView = true;
            this.viewType = fl.getClassName(viewType);
            this.toggleType = toggleType;
        }
        var d = __define,c=ToggleInfo;p=c.prototype;
        ToggleInfo.EVENT_TOGGLE_VIEW = "EVENT_TOGGLE_VIEW";
        ToggleInfo.TOGGLE_TYPE_TOGGLE = "toggle";
        ToggleInfo.TOGGLE_TYPE_SHOW = "show";
        ToggleInfo.TOGGLE_TYPE_HIDE = "hide";
        return ToggleInfo;
    })(egret.HashObject);
    game.ToggleInfo = ToggleInfo;
    egret.registerClass(ToggleInfo,"game.ToggleInfo");
    var CompManager = (function (_super) {
        __extends(CompManager, _super);
        function CompManager() {
            _super.apply(this, arguments);
            this.startupFuns = [];
            this.delta = 100;
            this.started = false;
            this._uiInstance = new fl.Dictionary();
            this._uiClazz = new fl.Dictionary();
            this.staticUICache_ = [];
            this.staticPopCache_ = [];
            this.closeExcludes = [];
            this.showExcludes = null;
            this._hideList = new fl.Dictionary(true);
        }
        var d = __define,c=CompManager;p=c.prototype;
        CompManager.getInstance = function () {
            CompManager.instance_ = CompManager.instance_ || new CompManager();
            return CompManager.instance_;
        };
        p.startup = function (context) {
            game.GameTime.traceTime("[CompManager.startup start]");
            this.gameContext = context || new fl.GameContext(this.stage);
            this.resizeHandler();
            fl.actionMgr.initActions(this.gameContext.injector);
            game.Actions.init();
            game.Modules.init(this.startupFuns);
            this.runStartupFuncs();
        };
        p.destory = function () {
        };
        p.runStartupFuncs = function () {
            var tmpT = egret.getTimer();
            var tmpF;
            game.GameTime.traceTime("[CompManager.runStartupFuncs] >>");
            while (this.startupFuns.length > 0 && egret.getTimer() - tmpT < this.delta) {
                tmpF = this.startupFuns.shift();
                if (null != tmpF)
                    tmpF();
            }
            game.GameTime.traceTime("[CompManager.runStartupFuncs] <<");
            if (this.startupFuns.length > 0) {
                egret.callLater(this.runStartupFuncs, this);
            }
            else {
                game.GameTime.traceTime("[CompManager.startup end]");
                this.started = true;
            }
        };
        d(p, "compLayer"
            ,function () {
                return ui.UIGlobal.compLayer;
            }
        );
        d(p, "popupLayer"
            ,function () {
                return ui.UIGlobal.popupLayer;
            }
        );
        d(p, "topLayer"
            ,function () {
                return ui.UIGlobal.topLayer;
            }
        );
        d(p, "stage"
            ,function () {
                return ui.UIGlobal.stage;
            }
        );
        p.resizeHandler = function (env) {
            if (env === void 0) { env = null; }
            var w = this.stage.stageWidth;
            var h = this.stage.stageHeight;
            if (w > 0 && h > 0) {
                var tmpObj;
                var i = 0;
                for (i = this.popupLayer.numChildren; i > 0; i--) {
                    tmpObj = this.popupLayer.getChildAt(i - 1);
                    if (fl.is(tmpObj, ui.IPopUpComp)) {
                        tmpObj.updatePosition();
                    }
                }
                for (i = this.compLayer.numChildren; i > 0; i--) {
                    tmpObj = this.compLayer.getChildAt(i - 1);
                    if (fl.is(tmpObj, ui.IPopUpComp)) {
                        tmpObj.updatePosition();
                    }
                }
                for (i = this.topLayer.numChildren; i > 0; i--) {
                    tmpObj = this.topLayer.getChildAt(i - 1);
                    if (fl.is(tmpObj, ui.IPopUpComp)) {
                        tmpObj.updatePosition();
                    }
                }
            }
        };
        p.registerView = function (viewClass, viewName, mediatorClass, viewIns, injectViewAs, autoCreate, autoRemove) {
            if (viewName === void 0) { viewName = null; }
            if (mediatorClass === void 0) { mediatorClass = null; }
            if (viewIns === void 0) { viewIns = null; }
            if (injectViewAs === void 0) { injectViewAs = null; }
            if (autoCreate === void 0) { autoCreate = true; }
            if (autoRemove === void 0) { autoRemove = true; }
            viewName = viewName || fl.getClassName(viewClass);
            this._uiClazz.setItem(viewName, viewClass);
            if (this.gameContext && mediatorClass) {
                this.gameContext.mapView(viewClass, mediatorClass, viewIns, injectViewAs, autoCreate, autoRemove);
            }
        };
        p.registerStaticComp = function (viewIns, viewClass, mediatorClass, injectViewAs, autoCreate, autoRemove) {
            if (viewIns === void 0) { viewIns = null; }
            if (viewClass === void 0) { viewClass = null; }
            if (mediatorClass === void 0) { mediatorClass = null; }
            if (injectViewAs === void 0) { injectViewAs = null; }
            if (autoCreate === void 0) { autoCreate = true; }
            if (autoRemove === void 0) { autoRemove = true; }
            if (viewIns == null && viewClass) {
                viewIns = new viewClass();
            }
            if (viewIns) {
                this.addComp(viewIns);
            }
            if (this.gameContext && mediatorClass) {
                viewClass = viewClass || viewIns.constructor;
                this.gameContext.mapView(viewClass, mediatorClass, viewIns, injectViewAs, autoCreate, autoRemove);
            }
            return viewIns;
        };
        p.registerPopComp = function (viewIns, viewClass, parent, modal, mediatorClass, injectViewAs, autoCreate, autoRemove) {
            if (viewIns === void 0) { viewIns = null; }
            if (viewClass === void 0) { viewClass = null; }
            if (parent === void 0) { parent = null; }
            if (modal === void 0) { modal = false; }
            if (mediatorClass === void 0) { mediatorClass = null; }
            if (injectViewAs === void 0) { injectViewAs = null; }
            if (autoCreate === void 0) { autoCreate = true; }
            if (autoRemove === void 0) { autoRemove = true; }
            if (viewIns == null && viewClass) {
                viewIns = new viewClass();
            }
            if (viewIns) {
                this.addPop(viewIns, parent, modal);
            }
            if (this.gameContext && mediatorClass) {
                viewClass = viewClass || viewIns.constructor;
                this.gameContext.mapView(viewClass, mediatorClass, viewIns, injectViewAs, autoCreate, autoRemove);
            }
            return viewIns;
        };
        p.addComp = function (comp) {
            if (comp && this.staticUICache_.indexOf(comp) == -1) {
                this.staticUICache_.push(comp);
                if (fl.is(comp, ui.IPopUpComp)) {
                    comp.showComp(this.compLayer);
                }
                else {
                    this.compLayer.addChild(comp);
                }
                return comp;
            }
            return null;
        };
        p.removeComp = function (comp) {
            var tmpI = comp ? this.staticUICache_.indexOf(comp) : -1;
            if (tmpI >= 0) {
                this.staticUICache_.splice(tmpI, 1);
                if (fl.is(comp, ui.IPopUpComp)) {
                    comp.hideComp();
                }
                else {
                    this.compLayer.removeChild(comp);
                }
                return comp;
            }
            return null;
        };
        p.hasComp = function (comp) {
            return comp && this.staticUICache_.indexOf(comp) >= 0;
        };
        p.getCompByClass = function (clz) {
            var tmpC;
            var tmpC_key_a;
            for (tmpC_key_a in this.staticUICache_) {
                tmpC = this.staticUICache_[tmpC_key_a];
                if (fl.is(tmpC, clz)) {
                    return tmpC;
                }
            }
            return null;
        };
        p.addPop = function (comp, p, m) {
            if (p === void 0) { p = null; }
            if (m === void 0) { m = false; }
            if (comp && this.staticPopCache_.indexOf(comp) == -1) {
                this.staticPopCache_.push(comp);
                if (fl.is(comp, ui.IPopUpComp)) {
                    comp.showComp(this.popupLayer);
                }
                else {
                    ui.UIGlobal.popup.createPopUp(comp, false, m);
                }
                return comp;
            }
            return null;
        };
        p.removePop = function (comp) {
            var tmpI = comp ? this.staticPopCache_.indexOf(comp) : -1;
            if (tmpI >= 0) {
                this.staticPopCache_.splice(tmpI, 1);
                if (fl.is(comp, ui.IPopUpComp)) {
                    comp.hideComp();
                }
                else {
                    ui.UIGlobal.popup.removePopUp(comp);
                }
                return comp;
            }
            return null;
        };
        p.hasPop = function (comp) {
            return comp && this.staticPopCache_.indexOf(comp) >= 0;
        };
        p.getPopByClass = function (clz) {
            var tmpC;
            var tmpC_key_a;
            for (tmpC_key_a in this.staticPopCache_) {
                tmpC = this.staticPopCache_[tmpC_key_a];
                if (fl.is(tmpC, clz)) {
                    return tmpC;
                }
            }
            return null;
        };
        p.setCompsVisibleByClass = function (clzs, v) {
            var tmpComp;
            for (var tmpClz_key_a in clzs) {
                var tmpClz = clzs[tmpClz_key_a];
                tmpComp = this.getPopByClass(tmpClz);
                tmpComp = tmpComp || this.getCompByClass(tmpClz);
                if (tmpComp) {
                    tmpComp.visible = v;
                }
            }
        };
        p.toggleView = function (viewInfo) {
            var uiView = this.getUIView(viewInfo.viewType, viewInfo.toggleType != ToggleInfo.TOGGLE_TYPE_HIDE);
            if (null == uiView)
                return;
            uiView.creatorPoint = this.getCreatorPoint(viewInfo);
            if (viewInfo.targetPoint)
                uiView.targetPoint = viewInfo.targetPoint;
            if (viewInfo.offsetPoint)
                uiView.offsetPoint = viewInfo.offsetPoint;
            uiView.viewData = viewInfo.data;
            this.toggleUIView(uiView, viewInfo.toggleType);
            if (viewInfo.updateOtherView) {
                this.updateOtherView(viewInfo.viewType);
            }
        };
        p.getCreatorPoint = function (viewInfo) {
            var tmpP = viewInfo.creatorPoint;
            return tmpP;
        };
        p.updateOtherView = function (viewType) {
        };
        p.updateViewsByType = function (curView, showList, closeList) {
            if (curView === void 0) { curView = null; }
            if (showList === void 0) { showList = null; }
            if (closeList === void 0) { closeList = null; }
            var tmpInfo;
            var tmpType;
            var tmpShowList = [];
            var tmpShowTypes = [];
            var tmpType_key_a;
            for (tmpType_key_a in showList) {
                tmpType = showList[tmpType_key_a];
                if (fl.is(tmpType, game.ToggleInfo)) {
                    tmpInfo = tmpType;
                    tmpInfo.toggleType = ToggleInfo.TOGGLE_TYPE_SHOW;
                }
                else {
                    tmpInfo = new ToggleInfo(tmpType, ToggleInfo.TOGGLE_TYPE_SHOW);
                }
                tmpInfo.updateOtherView = false;
                tmpShowList.push(tmpInfo);
                tmpShowTypes.push(tmpInfo.viewType);
            }
            if (closeList == null) {
                closeList = [];
                for (var forinvar__ in this._uiInstance.map) {
                    tmpType = this._uiInstance.map[forinvar__][0];
                    if (this._uiInstance.getItem(tmpType) && this._uiInstance.getItem(tmpType).closeAble) {
                        closeList.push(tmpType);
                    }
                }
            }
            var tmpCloseList = [];
            var tmpType_key_a;
            for (tmpType_key_a in closeList) {
                tmpType = closeList[tmpType_key_a];
                if (fl.is(tmpType, game.ToggleInfo)) {
                    tmpInfo = tmpType;
                    tmpInfo.toggleType = ToggleInfo.TOGGLE_TYPE_HIDE;
                }
                else {
                    tmpInfo = new ToggleInfo(tmpType, ToggleInfo.TOGGLE_TYPE_HIDE);
                }
                tmpInfo.updateOtherView = false;
                if (curView != tmpInfo.viewType && this.closeExcludes.indexOf(tmpInfo.viewType) == -1 && tmpShowTypes.indexOf(tmpInfo.viewType) == -1 && this.isViewShow(tmpInfo.viewType)) {
                    tmpCloseList.push(tmpInfo);
                }
            }
            this.updateViewsByInfo(tmpCloseList.concat(tmpShowList));
        };
        p.updateViewsByInfo = function (viewList) {
            var tmpInfo;
            var tmpInfo_key_a;
            for (tmpInfo_key_a in viewList) {
                tmpInfo = viewList[tmpInfo_key_a];
                this.toggleView(tmpInfo);
            }
        };
        p.isViewShow = function (viewType) {
            viewType = fl.getClassName(viewType);
            var tmpComp = this._uiInstance.getItem(viewType);
            return tmpComp && tmpComp.isShow;
        };
        p.getUIView = function (viewType, toCreate) {
            if (toCreate === void 0) { toCreate = true; }
            viewType = fl.getClassName(viewType);
            var tmpComp = this._uiInstance.getItem(viewType);
            if (tmpComp == null && toCreate) {
                var tmpClazz = this._uiClazz.getItem(viewType);
                if (tmpClazz) {
                    this._uiInstance.setItem(viewType, tmpComp = new tmpClazz());
                    tmpComp.viewType = viewType;
                }
                else {
                    egret.error("[getUIView] unknow ui type: " + viewType);
                }
            }
            return tmpComp;
        };
        p.toggleUIView = function (uiView, toggleType) {
            if (toggleType === void 0) { toggleType = "toggle"; }
            var _self__ = this;
            var isShow = false;
            if (toggleType == ToggleInfo.TOGGLE_TYPE_HIDE) {
                uiView.hideComp();
                if (uiView.isLoading) {
                    this._hideList.setItem(uiView, true);
                }
            }
            else if (toggleType == ToggleInfo.TOGGLE_TYPE_SHOW) {
                if (uiView.isPopUp) {
                    if (this.getTopMostView() != uiView)
                        uiView.bringToFront();
                }
                else {
                    isShow = true;
                }
            }
            else {
                if (uiView.isPopUp) {
                    uiView.hideComp();
                    if (uiView.isLoading) {
                        this._hideList.setItem(uiView, true);
                    }
                }
                else {
                    isShow = true;
                }
            }
            if (isShow) {
                if (this.closeExcludes.indexOf(uiView.viewType) != -1) { }
                else if (this.showExcludes && this.showExcludes.indexOf(uiView.viewType) == -1) {
                    return;
                }
                uiView.showComp();
            }
        };
        p.getTopMostView = function (closeAble) {
            if (closeAble === void 0) { closeAble = true; }
            var topComp;
            var tmpComp;
            var tmpObj;
            var i = 0;
            for (i = this.popupLayer.numChildren; i > 0; i--) {
                tmpObj = this.popupLayer.getChildAt(i - 1);
                tmpComp = fl.is(tmpObj, ui.IPopUpComp) ? tmpObj : null;
                if (tmpComp && (!closeAble || tmpComp.closeAble) && tmpObj.visible) {
                    topComp = tmpComp;
                    break;
                }
            }
            if (!topComp) {
                for (i = this.compLayer.numChildren; i > 0; i--) {
                    tmpObj = this.compLayer.getChildAt(i - 1);
                    tmpComp = fl.is(tmpObj, ui.IPopUpComp) ? tmpObj : null;
                    if (tmpComp && (!closeAble || tmpComp.closeAble) && tmpObj.visible) {
                        topComp = tmpComp;
                        break;
                    }
                }
            }
            return topComp;
        };
        return CompManager;
    })(egret.HashObject);
    game.CompManager = CompManager;
    egret.registerClass(CompManager,"game.CompManager");
    game.compMgr = CompManager.getInstance();
})(game || (game = {}));
