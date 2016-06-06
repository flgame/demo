var ui;
(function (ui) {
    ui.IPopUpComp = "ui.IPopUpComp";
    var BaseStaticComp = (function (_super) {
        __extends(BaseStaticComp, _super);
        function BaseStaticComp() {
            _super.call(this);
            this.isLoading_ = false;
            this.title_ = "";
        }
        var d = __define,c=BaseStaticComp,p=c.prototype;
        p.showComp = function (parent, modal) {
            if (parent === void 0) { parent = null; }
            if (modal === void 0) { modal = false; }
            this.popupParent = parent || ui.UIGlobal.stage;
            ui.addToParent(this, this.popupParent);
            this.doShow();
        };
        d(p, "inited"
            ,function () {
                return fl.isComponentInited(this);
            }
        );
        p.doShow = function () {
            if (!this.inited) {
                this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this.onCreationComplete, this);
            }
            else {
                this.showHandler();
            }
        };
        p.onCreationComplete = function (env) {
            this.removeEventListener(eui.UIEvent.CREATION_COMPLETE, this.onCreationComplete, this);
            if (this.isPopUp) {
                this.showHandler();
            }
        };
        p.showHandler = function () {
            this.updatePosition();
            this.resetPosition();
        };
        p.hideComp = function () {
            ui.removeFromParent(this);
        };
        p.close = function () {
        };
        p.move = function (x, y) {
            this.x = x;
            this.y = y;
        };
        p.bringToFront = function () {
        };
        p.updateData = function (obj) {
            if (obj === void 0) { obj = null; }
        };
        p.updatePosition = function (obj) {
            if (obj === void 0) { obj = null; }
        };
        p.updateIndex = function (obj) {
            if (obj === void 0) { obj = null; }
        };
        d(p, "isPopUp"
            ,function () {
                return this.parent != null;
            }
        );
        d(p, "viewType"
            ,function () {
                return this.viewType_;
            }
            ,function (value) {
                this.viewType_ = value;
            }
        );
        d(p, "viewData"
            ,function () {
                return this.viewData_;
            }
            ,function (value) {
                this.viewData_ = value;
            }
        );
        d(p, "leftPartner"
            ,function () {
                return this.leftPartner_;
            }
            ,function (p) {
                this.leftPartner_ = p;
            }
        );
        d(p, "rightPartner"
            ,function () {
                return this.rightPartner_;
            }
            ,function (p) {
                this.rightPartner_ = p;
            }
        );
        d(p, "creatorPoint"
            ,function () {
                return this.creatorPoint_;
            }
            ,function (p) {
                this.creatorPoint_ = p;
            }
        );
        d(p, "targetPoint"
            ,function () {
                if (this.targetPoint_ == null) {
                    this.updatePosition();
                }
                return this.targetPoint_;
            }
            ,function (p) {
                this.targetPoint_ = p;
                if (this.isPopUp && this.inited && !this.isPlaying) {
                    this.resetPosition();
                }
            }
        );
        d(p, "offsetPoint"
            ,function () {
                return this.offsetPoint_;
            }
            ,function (p) {
                this.offsetPoint_ = p;
                if (this.isPopUp && this.inited && !this.isPlaying) {
                    this.resetPosition();
                }
            }
        );
        p.resetPosition = function () {
            var tmpX = this.x;
            var tmpY = this.y;
            if (this.targetPoint) {
                tmpX = this.targetPoint.x;
                tmpY = this.targetPoint.y;
            }
            else if (this.popupParent) {
                var p = new egret.Point();
                p.x = this.popupParent.width;
                p.y = this.popupParent.height;
                tmpX = (p.x - this.width) / 2;
                if (tmpX < 0)
                    tmpX = 0;
                tmpY = (p.y - this.height) / 2;
                if (tmpY < 0)
                    tmpY = 0;
                var tmpP = this.popupParent.localToGlobal(tmpX, tmpY);
                tmpX = tmpP.x;
                tmpY = tmpP.y;
            }
            if (this.offsetPoint) {
                tmpX += this.offsetPoint.x;
                tmpY += this.offsetPoint.y;
            }
            this.move(tmpX, tmpY);
        };
        d(p, "moveEnable"
            ,function () {
                return false;
            }
            ,function (value) {
            }
        );
        d(p, "isPlaying"
            ,function () {
                return false;
            }
        );
        d(p, "isShow"
            ,function () {
                return this.parent && this.visible;
            }
        );
        d(p, "isHide"
            ,function () {
                return !this.parent || !this.visible;
            }
        );
        d(p, "closeAble"
            ,function () {
                return false;
            }
        );
        d(p, "closeBtn"
            ,function () {
                return null;
            }
        );
        d(p, "isLoading"
            ,function () {
                return this.isLoading_;
            }
            ,function (value) {
                if (this.isLoading_ != value) {
                    this.isLoading_ = value;
                }
            }
        );
        d(p, "title"
            ,function () {
                return this.title_;
            }
            ,function (value) {
                if (this.title_ != value) {
                    this.title_ = value;
                }
            }
        );
        return BaseStaticComp;
    }(eui.Component));
    ui.BaseStaticComp = BaseStaticComp;
    egret.registerClass(BaseStaticComp,'ui.BaseStaticComp',["ui.IPopUpComp"]);
    var BasePopUpComp = (function (_super) {
        __extends(BasePopUpComp, _super);
        function BasePopUpComp() {
            _super.call(this);
        }
        var d = __define,c=BasePopUpComp,p=c.prototype;
        p.showComp = function (parent, modal) {
            if (parent === void 0) { parent = null; }
            if (modal === void 0) { modal = false; }
            this.popupParent = parent || ui.UIGlobal.stage;
            ui.UIGlobal.popup.createPopUp(this, false, modal);
            this.doShow();
        };
        p.hideComp = function () {
            ui.UIGlobal.popup.removePopUp(this);
        };
        d(p, "isPopUp"
            ,function () {
                return ui.UIGlobal.popup.hasPopUp(this);
            }
        );
        p.bringToFront = function () {
            ui.UIGlobal.popup.bringToFront(this);
        };
        return BasePopUpComp;
    }(BaseStaticComp));
    ui.BasePopUpComp = BasePopUpComp;
    egret.registerClass(BasePopUpComp,'ui.BasePopUpComp');
})(ui || (ui = {}));
