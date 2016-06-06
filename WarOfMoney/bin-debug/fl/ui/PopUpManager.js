var ui;
(function (ui) {
    var DefaultModalOverlay = (function (_super) {
        __extends(DefaultModalOverlay, _super);
        function DefaultModalOverlay() {
            _super.call(this);
            var g = this.graphics;
            g.clear();
            g.beginFill(0x0, .5);
            g.drawRect(0, 0, 100, 100);
        }
        var d = __define,c=DefaultModalOverlay,p=c.prototype;
        return DefaultModalOverlay;
    }(egret.Sprite));
    ui.DefaultModalOverlay = DefaultModalOverlay;
    egret.registerClass(DefaultModalOverlay,'ui.DefaultModalOverlay');
    var PopUpData = (function (_super) {
        __extends(PopUpData, _super);
        function PopUpData(popUp, overlay) {
            if (overlay === void 0) { overlay = null; }
            _super.call(this);
            this._popUp = popUp;
            this._modalOverlay = overlay;
        }
        var d = __define,c=PopUpData,p=c.prototype;
        d(p, "isModal"
            ,function () {
                return this._modalOverlay != null;
            }
        );
        d(p, "popUp"
            ,function () {
                return this._popUp;
            }
            ,function (value) {
                this._popUp = value;
            }
        );
        d(p, "modalOverlay"
            ,function () {
                return this._modalOverlay;
            }
            ,function (modalOverlay) {
                this._modalOverlay = modalOverlay;
            }
        );
        return PopUpData;
    }(egret.HashObject));
    ui.PopUpData = PopUpData;
    egret.registerClass(PopUpData,'ui.PopUpData');
    var PopUpManager = (function (_super) {
        __extends(PopUpManager, _super);
        function PopUpManager(container) {
            _super.call(this);
            this._width = 0;
            this._height = 0;
            this._numModalPopUps = 0;
            if (!container.stage)
                throw new fl.Error("The container must already be added to the display list.");
            this._container = container;
            this._width = this._container.stage.stageWidth;
            this._height = this._container.stage.stageHeight;
            this._popUps = new fl.Dictionary();
        }
        var d = __define,c=PopUpManager,p=c.prototype;
        p.setSize = function (width, height) {
            this._width = width;
            this._height = height;
            var map = this._popUps.map;
            var popupData;
            for (var i = 0; i < map.length; i++) {
                popupData = map[i][1];
                if (popupData && popupData.modalOverlay) {
                    popupData.modalOverlay.width = width;
                    popupData.modalOverlay.height = height;
                }
            }
        };
        d(p, "modalOverlay"
            ,function () {
                return this._ModalOverlay;
            }
            ,function (modalOverlay) {
                this._ModalOverlay = modalOverlay;
            }
        );
        d(p, "popUpCallback"
            ,function () {
                return this._popUpCallback;
            }
            ,function (popUpCallback) {
                this._popUpCallback = popUpCallback;
            }
        );
        d(p, "modalPopUpCallback"
            ,function () {
                return this._modalPopUpCallback;
            }
            ,function (modalPopUpCallback) {
                this._modalPopUpCallback = modalPopUpCallback;
            }
        );
        p.createPopUp = function (displayObject, centerPopUp, modal) {
            if (centerPopUp === void 0) { centerPopUp = false; }
            if (modal === void 0) { modal = false; }
            if (this._popUps.hasOwnProperty(displayObject))
                return;
            var overlay;
            if (modal) {
                overlay = this.createModalOverlay();
                this._container.addChild(overlay);
                this._numModalPopUps++;
            }
            this._popUps.setItem(displayObject, new PopUpData(displayObject, overlay));
            this._container.addChild(displayObject);
            if (centerPopUp)
                this.center(displayObject);
            if (this._popUpCallback != null)
                this._popUpCallback();
            if (modal && this._modalPopUpCallback != null)
                this._modalPopUpCallback();
        };
        p.hasPopUp = function (displayObject) {
            if (displayObject === void 0) { displayObject = null; }
            if (displayObject)
                return this._popUps.hasOwnProperty(displayObject);
            return this._popUps.map.length > 0;
        };
        p.hasModalPopUp = function (displayObject) {
            if (displayObject === void 0) { displayObject = null; }
            if (displayObject) {
                var popUpData = this._popUps.getItem(displayObject);
                if (!popUpData)
                    return false;
                return popUpData.isModal;
            }
            return this._numModalPopUps > 0;
        };
        d(p, "numPopUps"
            ,function () {
                return this._popUps.map.length;
            }
        );
        d(p, "numModalPopUps"
            ,function () {
                return this._numModalPopUps;
            }
        );
        d(p, "popUpOnTop"
            ,function () {
                if (this._container.numChildren)
                    return this._container.getChildAt(this._container.numChildren - 1);
                return null;
            }
        );
        p.bringToFront = function (displayObject) {
            if (!this._popUps.hasOwnProperty(displayObject))
                return;
            var popUpData = this._popUps.getItem(displayObject);
            if (popUpData.isModal) {
                this._container.setChildIndex(popUpData.modalOverlay, this._container.numChildren - 1);
            }
            this._container.setChildIndex(displayObject, this._container.numChildren - 1);
        };
        p.center = function (displayObject) {
            displayObject.x = Math.round((this._width - displayObject.width) / 2);
            displayObject.y = Math.round((this._height - displayObject.height) / 2);
        };
        p.removePopUp = function (displayObject) {
            if (!this._popUps.hasOwnProperty(displayObject))
                return;
            var popUpData = this._popUps.delItem(displayObject);
            if (popUpData.isModal) {
                this._container.removeChild(popUpData.modalOverlay);
                this._numModalPopUps--;
            }
            this._container.removeChild(displayObject);
            if (this._popUpCallback != null)
                this._popUpCallback();
            if (popUpData.isModal && this._modalPopUpCallback != null)
                this._modalPopUpCallback();
        };
        p.makeModal = function (displayObject) {
            if (!this._popUps.hasOwnProperty(displayObject))
                return;
            var popUpData = this._popUps.getItem(displayObject);
            if (popUpData.isModal)
                return;
            var overlay = this.createModalOverlay();
            this._container.addChildAt(overlay, this._container.getChildIndex(displayObject));
            popUpData.modalOverlay = overlay;
            this._numModalPopUps++;
            if (this._modalPopUpCallback != null)
                this._modalPopUpCallback();
        };
        p.makeModeless = function (displayObject) {
            if (!this._popUps.hasOwnProperty(displayObject))
                return;
            var popUpData = this._popUps.getItem(displayObject);
            if (!popUpData.isModal)
                return;
            this._container.removeChild(popUpData.modalOverlay);
            popUpData.modalOverlay = null;
            this._numModalPopUps--;
            if (this._modalPopUpCallback != null)
                this._modalPopUpCallback();
        };
        p.createModalOverlay = function () {
            var overlay = this._ModalOverlay != null ? new this._ModalOverlay() : new DefaultModalOverlay();
            overlay.width = this._width;
            overlay.height = this._height;
            return overlay;
        };
        return PopUpManager;
    }(egret.HashObject));
    ui.PopUpManager = PopUpManager;
    egret.registerClass(PopUpManager,'ui.PopUpManager');
})(ui || (ui = {}));
