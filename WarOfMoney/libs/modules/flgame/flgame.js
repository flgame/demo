
var fl;
(function (fl) {
    var GlobalEvent = (function (_super) {
        __extends(GlobalEvent, _super);
        function GlobalEvent(type, data, bubbles, cancelable) {
            if (data === void 0) { data = null; }
            if (bubbles === void 0) { bubbles = false; }
            if (cancelable === void 0) { cancelable = false; }
            _super.call(this, type, bubbles, cancelable);
            this.data = data;
        }
        var d = __define,c=GlobalEvent;p=c.prototype;
        p.clone = function () {
            var tmpEvent = new fl.GlobalEvent(this.type, this.data, this.bubbles, this.cancelable);
            return tmpEvent;
        };
        return GlobalEvent;
    })(egret.Event);
    fl.GlobalEvent = GlobalEvent;
    egret.registerClass(GlobalEvent,"fl.GlobalEvent");
})(fl || (fl = {}));

var fl;
(function (fl) {
    var EventManager = (function (_super) {
        __extends(EventManager, _super);
        function EventManager() {
            _super.apply(this, arguments);
            this.eventListeners_ = new fl.Dictionary();
        }
        var d = __define,c=EventManager;p=c.prototype;
        EventManager.getInstance = function () {
            fl.EventManager.instance_ = fl.EventManager.instance_ || new fl.EventManager();
            return fl.EventManager.instance_;
        };
        p.dispatchEvent = function (event) {
            var _self__ = this;
            if (_self__.hasEventListener(event.type) || event.bubbles) {
                return _super.prototype.dispatchEvent.call(this, event);
            }
            return true;
        };
        p.addEventListener = function (type, listener, thisObject, useCapture, priority) {
            if (useCapture === void 0) { useCapture = false; }
            if (priority === void 0) { priority = 0; }
            var tmpType = type + "_" + useCapture;
            var listeners = this.eventListeners_.getItem(tmpType);
            if (listeners == null) {
                listeners = new Array();
                this.eventListeners_.setItem(tmpType, listeners);
            }
            var i = listeners.indexOf(listener);
            if (i == -1) {
                _super.prototype.addEventListener.call(this, type, listener, null, useCapture, priority);
                listeners.push(listener);
            }
        };
        p.removeEventListener = function (type, listener, thisObject, useCapture) {
            if (useCapture === void 0) { useCapture = false; }
            var tmpType = type + "_" + useCapture;
            var listeners = this.eventListeners_.getItem(tmpType);
            var i = listeners ? listeners.indexOf(listener) : -1;
            if (i != -1) {
                _super.prototype.removeEventListener.call(this, type, listener, null, useCapture);
                listeners.splice(i, 1);
            }
        };
        p.removeListeners = function (type, useCapture) {
            if (type === void 0) { type = null; }
            if (useCapture === void 0) { useCapture = false; }
            var tmpType;
            if (type) {
                tmpType = type + "_" + useCapture;
                var listeners = this.eventListeners_.getItem(tmpType);
                for (var listener_key_a in listeners) {
                    var listener = listeners[listener_key_a];
                    this.removeEventListener(type, listener, null, useCapture);
                }
                this.eventListeners_.delItem(tmpType);
            }
            else {
                for (var forinvar__ in this.eventListeners_.map) {
                    tmpType = this.eventListeners_.map[forinvar__][0];
                    if (tmpType) {
                        this.removeListeners(tmpType, useCapture);
                    }
                }
            }
        };
        p.removeAllListeners = function () {
            this.removeListeners(null, false);
            this.removeListeners(null, true);
        };
        return EventManager;
    })(egret.EventDispatcher);
    fl.EventManager = EventManager;
    egret.registerClass(EventManager,"fl.EventManager");
    fl.eventMgr = fl.EventManager.getInstance();
})(fl || (fl = {}));

var fl;
(function (fl) {
    var BaseAction = (function (_super) {
        __extends(BaseAction, _super);
        function BaseAction() {
            _super.apply(this, arguments);
        }
        var d = __define,c=BaseAction;p=c.prototype;
        d(p, "protocols"
            ,function () {
                return this.mapProtocols;
            }
            ,function (value) {
                this.mapProtocols = value;
            }
        );
        d(p, "eventDispatcher"
            ,function () {
                return fl.eventMgr;
            }
        );
        p.process = function (data, protocol) {
            if (protocol === void 0) { protocol = 0; }
        };
        p.sendPack = function (pack, netId) {
            if (netId === void 0) { netId = ""; }
            fl.netMgr.sendPack(pack, netId);
        };
        p.sendBytes = function (bytes, netId) {
            if (netId === void 0) { netId = ""; }
            fl.netMgr.sendBytes(bytes, netId);
        };
        p.dispatchEvent = function (e) {
            this.eventDispatcher.dispatchEvent(e);
        };
        return BaseAction;
    })(fl.Actor);
    fl.BaseAction = BaseAction;
    egret.registerClass(BaseAction,"fl.BaseAction");
})(fl || (fl = {}));

var fl;
(function (fl) {
    var ActionManager = (function (_super) {
        __extends(ActionManager, _super);
        function ActionManager() {
            _super.apply(this, arguments);
            this.actionCache_ = new fl.Dictionary();
            this.actionClazz_ = [];
        }
        var d = __define,c=ActionManager;p=c.prototype;
        ActionManager.getInstance = function () {
            if (null == fl.ActionManager.instance_) {
                fl.ActionManager.instance_ = new fl.ActionManager();
            }
            return fl.ActionManager.instance_;
        };
        p.initActions = function (injector) {
            this.injector_ = injector;
            this.injector_.mapValue(fl.ActionManager, this);
        };
        p.injectAction = function (actionClass) {
            var tmpI = this.actionClazz_.indexOf(actionClass);
            if (this.injector_ && actionClass && tmpI == -1) {
                this.injector_.mapSingleton(actionClass);
                var action = this.injector_.getInstance(actionClass);
                this.mapAction(action);
                this.actionClazz_.push(actionClass);
            }
        };
        p.uninjectAction = function (actionClass) {
            var tmpI = this.actionClazz_.indexOf(actionClass);
            if (this.injector_ && actionClass && tmpI >= 0) {
                var action = this.injector_.getInstance(actionClass);
                this.unmapAction(action);
                this.injector_.unmap(actionClass);
                this.actionClazz_.splice(tmpI, 1);
            }
        };
        p.mapAction = function (action) {
            if (action) {
                for (var protocol_key_a in action.protocols) {
                    var protocol = action.protocols[protocol_key_a];
                    if (protocol != null)
                        this.setAction(action, protocol);
                }
            }
        };
        p.unmapAction = function (action) {
            for (var forinvar__ in this.actionCache_.map) {
                var key = this.actionCache_.map[forinvar__][0];
                if (this.actionCache_.getItem(key) == action) {
                    this.actionCache_.delItem(key);
                }
            }
        };
        p.getActionByClass = function (actionClass) {
            var action;
            var tmpI = this.actionClazz_.indexOf(actionClass);
            if (this.injector_ && actionClass && tmpI != -1) {
                action = this.injector_.getInstance(actionClass);
            }
            return action;
        };
        p.getAction = function (id) {
            var action = this.actionCache_.getItem(id);
            return action;
        };
        p.setAction = function (action, id) {
            if (this.actionCache_.getItem(id)) {
                this.removeAction(id);
            }
            this.actionCache_.setItem(id, action);
            return action;
        };
        p.removeAction = function (id) {
            var action = null;
            if (this.actionCache_.hasOwnProperty(id)) {
                action = this.actionCache_.getItem(id);
                this.actionCache_.delItem(id);
            }
            return action;
        };
        return ActionManager;
    })(egret.HashObject);
    fl.ActionManager = ActionManager;
    egret.registerClass(ActionManager,"fl.ActionManager");
    fl.actionMgr = fl.ActionManager.getInstance();
})(fl || (fl = {}));

var fl;
(function (fl) {
    var Actions = (function (_super) {
        __extends(Actions, _super);
        function Actions() {
            _super.apply(this, arguments);
        }
        var d = __define,c=Actions;p=c.prototype;
        Actions.init = function () {
            if (fl.Actions.inited)
                return;
            fl.Actions.inited = true;
            //inject actions
        };
        Actions.injectAction = function (actionClass) {
            fl.actionMgr.injectAction(actionClass);
        };
        Actions.uninjectAction = function (actionClass) {
            fl.actionMgr.uninjectAction(actionClass);
        };
        Actions.inited = false;
        return Actions;
    })(egret.HashObject);
    fl.Actions = Actions;
    egret.registerClass(Actions,"fl.Actions");
})(fl || (fl = {}));

var fl;
(function (fl) {
    var GameContext = (function (_super) {
        __extends(GameContext, _super);
        function GameContext(contextView) {
            if (contextView === void 0) { contextView = null; }
            _super.call(this, contextView, false);
        }
        var d = __define,c=GameContext;p=c.prototype;
        GameContext.getInstance = function (contextView) {
            if (contextView === void 0) { contextView = null; }
            contextView = contextView;
            var tmpIns = fl.GameContext.instances_.getItem(contextView);
            if (!tmpIns) {
                tmpIns = new fl.GameContext(contextView);
                fl.GameContext.instances_.setItem(contextView, tmpIns);
            }
            return tmpIns;
        };
        p.createEventDispatcher = function () {
            return fl.eventMgr;
        };
        p.startup = function () {
            this.injector.mapValue(fl.EventManager, fl.eventMgr);
            fl.actionMgr.initActions(this.injector);
            _super.prototype.startup.call(this);
        };
        p.mapView = function (viewClassOrName, mediatorClass, viewIns, injectViewAs, autoCreate, autoRemove) {
            if (viewIns === void 0) { viewIns = null; }
            if (injectViewAs === void 0) { injectViewAs = null; }
            if (autoCreate === void 0) { autoCreate = true; }
            if (autoRemove === void 0) { autoRemove = true; }
            this.mediatorMap.mapView(viewClassOrName, mediatorClass, injectViewAs, autoCreate, autoRemove);
            viewIns && viewIns["stage"] && this.mediatorMap.createMediator(viewIns);
        };
        p.unmapView = function (viewClassOrName) {
            this.mediatorMap.unmapView(viewClassOrName);
        };
        p.injectAction = function (actionClass) {
            fl.actionMgr.injectAction(actionClass);
        };
        p.uninjectAction = function (actionClass) {
            fl.actionMgr.uninjectAction(actionClass);
        };
        GameContext.instances_ = new fl.Dictionary();
        return GameContext;
    })(fl.Context);
    fl.GameContext = GameContext;
    egret.registerClass(GameContext,"fl.GameContext");
})(fl || (fl = {}));

var fl;
(function (fl) {
    var GameMediator = (function (_super) {
        __extends(GameMediator, _super);
        function GameMediator() {
            _super.apply(this, arguments);
            this.viewList_ = new Array();
            this.actionList_ = new Array();
        }
        var d = __define,c=GameMediator;p=c.prototype;
        p.updateContext = function () {
            _super.prototype.updateContext.call(this);
            this.mediatorMap = this.context.mediatorMap;
        };
        p.onRemove = function () {
            this.unmapActions();
            this.unmapMediators();
            _super.prototype.onRemove.call(this);
        };
        p.unmapMediators = function () {
            for (var tmpView_key_a in this.viewList_) {
                var tmpView = this.viewList_[tmpView_key_a];
                this.mediatorMap.unmapView(tmpView);
            }
            this.viewList_.splice(0, this.viewList_.length);
        };
        p.mapMediator = function (viewClazzOrName, mediaClazz, viewIns, injectViewAs, autoCreate, autoRemove) {
            if (viewIns === void 0) { viewIns = null; }
            if (injectViewAs === void 0) { injectViewAs = null; }
            if (autoCreate === void 0) { autoCreate = true; }
            if (autoRemove === void 0) { autoRemove = true; }
            var viewName = fl.getClassName(viewClazzOrName);
            var i = this.viewList_.indexOf(viewName);
            if (i != -1) {
                console.log("[mapMediator] Mediator Class has already been mapped to a View Class in this context - " + viewName);
            }
            else {
                this.mediatorMap.mapView(viewName, mediaClazz, injectViewAs, autoCreate, autoRemove);
                viewIns && viewIns["stage"] && this.mediatorMap.createMediator(viewIns);
                this.viewList_.push(viewName);
            }
        };
        p.unmapMediator = function (viewClazzOrName) {
            var viewName = fl.getClassName(viewClazzOrName);
            var i = this.viewList_.indexOf(viewName);
            if (i != -1) {
                this.mediatorMap.unmapView(viewName);
                this.viewList_.splice(i, 1);
            }
            else {
                console.log("[unmapMediator] Mediator Class has not been mapped to a View Class in this context - " + viewName);
            }
        };
        p.unmapActions = function () {
            for (var tmpAction_key_a in this.actionList_) {
                var tmpAction = this.actionList_[tmpAction_key_a];
                fl.actionMgr.uninjectAction(tmpAction);
            }
            this.actionList_.splice(0, this.actionList_.length);
        };
        p.injectAction = function (actionClass) {
            var i = this.actionList_.indexOf(actionClass);
            if (i != -1) {
                console.log("[injectAction] Action Class has already been injected in this context - " + actionClass);
            }
            else {
                fl.actionMgr.injectAction(actionClass);
                this.actionList_.push(actionClass);
            }
        };
        p.uninjectAction = function (actionClass) {
            var i = this.actionList_.indexOf(actionClass);
            if (i != -1) {
                fl.actionMgr.uninjectAction(actionClass);
                this.actionList_.splice(i, 1);
            }
            else {
                console.log("[uninjectAction] Action Class has not been injected in this context - " + actionClass);
            }
        };
        return GameMediator;
    })(fl.Mediator);
    fl.GameMediator = GameMediator;
    egret.registerClass(GameMediator,"fl.GameMediator");
})(fl || (fl = {}));

var fl;
(function (fl) {
    var Modules = (function (_super) {
        __extends(Modules, _super);
        function Modules() {
            _super.apply(this, arguments);
        }
        var d = __define,c=Modules;p=c.prototype;
        Modules.init = function (startupFuns) {
            if (startupFuns === void 0) { startupFuns = null; }
            if (fl.Modules.inited)
                return startupFuns;
            fl.Modules.inited = true;
            startupFuns = startupFuns || [];
            startupFuns.push(fl.Modules.registerViews);
            //var register:fl.CompManager = fl.compMgr;
            var f;
            f = function () {
                //register static views
                //register.registerStaticComp(null,TopView,TopViewMediator);
            };
            startupFuns.push(f);
            return startupFuns;
        };
        Modules.registerViews = function () {
            //register dynamical views
            //var register:fl.CompManager = fl.compMgr;
            //register.registerView(OptionView,null,OptionMediator);
        };
        Modules.inited = false;
        return Modules;
    })(egret.HashObject);
    fl.Modules = Modules;
    egret.registerClass(Modules,"fl.Modules");
})(fl || (fl = {}));

var fl;
(function (fl) {
    var BaseNet = (function (_super) {
        __extends(BaseNet, _super);
        function BaseNet(ip, port, id) {
            _super.call(this);
            this.dataCache_ = new Array();
            this._cachCmd = false;
            this.id = id;
            this.ip = ip;
            this.port = port;
            this.socket = new egret.WebSocket();
            this.socket.type = egret.WebSocket.TYPE_BINARY;
            this.socket.addEventListener(egret.Event.CONNECT, this.onConnect, this);
            this.socket.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceived, this);
            this.socket.addEventListener(egret.Event.CLOSE, this.onClose, this);
            this.socket.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onError, this);
            this._receBytes = new dcodeIO.ByteBuffer().flip();
            this.open();
        }
        var d = __define,c=BaseNet;p=c.prototype;
        p.open = function () {
            if (!this.socket.connected) {
                this.socket.connect(this.ip, this.port);
            }
        };
        p.close = function () {
            if (this.socket.connected) {
                this.socket.close();
            }
            this.dataCache_ = new Array();
        };
        p.forceClose = function () {
            this.close();
            fl.eventMgr.dispatchEvent(new fl.GlobalEvent(fl.BaseNet.EVENT_CLIENT_CLOSE));
        };
        p.onConnect = function (e) {
            var data = this.dataCache_.shift();
            while (data) {
                this.send(data);
                data = this.dataCache_.shift();
            }
        };
        p.notifyClose = function () {
            fl.eventMgr.dispatchEvent(new fl.GlobalEvent(fl.BaseNet.EVENT_NET_ERR, this.id));
        };
        p.onClose = function (e) {
            egret.log("[BaseNet.onClose] " + e);
            this.notifyClose();
        };
        p.onError = function (e) {
            egret.error("[BaseNet.onError] " + e);
            this.notifyClose();
        };
        p.send = function (bytes) {
            if (this.socket.connected) {
                var eb = new egret.ByteArray(bytes.toArrayBuffer());
                this.socket.writeBytes(eb, 0, eb.length);
                this.socket.flush();
            }
            else {
                this.dataCache_.push(bytes);
            }
        };
        p.onReceived = function (e) {
            var tmpBytes = new egret.ByteArray();
            this.socket.readBytes(tmpBytes);
            if (tmpBytes.length == 0) {
                return;
            }
            this._receBytes.offset = this._receBytes.limit;
            this._receBytes.append(tmpBytes.buffer).flip();
            while (this.processPacks())
                ;
        };
        p.processPacks = function () {
            if (this._receBytes.limit < fl.BasePack.HEAD_SIZE) {
                return false;
            }
            this._receBytes.offset = 0;
            var firstPackageLenght = this._receBytes.readUint16();
            firstPackageLenght = firstPackageLenght + fl.BasePack.HEAD_SIZE;
            if (this._receBytes.limit < firstPackageLenght) {
                return false;
            }
            if (firstPackageLenght > 2 * fl.BasePack.MAX_PACK_SIZE) {
                throw new fl.Error("[BaseSocket.processPacks] unknow package size: " + firstPackageLenght);
            }
            var tmpBytes = this._receBytes.copy(0, fl.BasePack.HEAD_SIZE).flip();
            var bodyBytes = new dcodeIO.ByteBuffer().flip();
            var n = firstPackageLenght - fl.BasePack.HEAD_SIZE;
            if (n > 0) {
                this._receBytes.copyTo(bodyBytes, 0, fl.BasePack.HEAD_SIZE, firstPackageLenght);
                bodyBytes.offset = n;
                bodyBytes.flip();
            }
            tmpBytes.offset = 2;
            var protocolNumber = tmpBytes.readUint32();
            if (protocolNumber >>> 31 == 1) {
                egret.log("compressed protocol: " + protocolNumber);
                protocolNumber = protocolNumber & 0x7FFFFFFF;
                //decryption
                bodyBytes = this.decryption(bodyBytes);
            }
            tmpBytes.offset = fl.BasePack.HEAD_SIZE;
            if (bodyBytes.limit) {
                tmpBytes.mark();
                tmpBytes.append(bodyBytes).flip();
                tmpBytes.reset();
            }
            this.processOrCache(protocolNumber, tmpBytes);
            //reset left bytes
            tmpBytes = new dcodeIO.ByteBuffer().flip();
            n = this._receBytes.limit - firstPackageLenght;
            if (n > 0) {
                this._receBytes.copyTo(tmpBytes, 0, firstPackageLenght, this._receBytes.limit);
                tmpBytes.offset = n;
                tmpBytes.flip();
            }
            this._receBytes.clear().flip();
            if (tmpBytes.limit > 0) {
                this._receBytes.append(tmpBytes).flip();
                return true;
            }
            else {
                return false;
            }
        };
        /**
         * decrypt the data if need
         **/
        p.decryption = function (bytes) {
            return bytes;
        };
        p.cachCmd = function (b) {
            this._cachCmd = b;
            if (b) {
                if (null == this._cachQueue)
                    this._cachQueue = [];
            }
            else {
                if (this._cachQueue != null) {
                    while (this._cachQueue.length > 0) {
                        var cach = this._cachQueue.shift();
                        this.processCmd(cach["protocol"], cach["data"]);
                    }
                }
            }
        };
        p.noCachCmd = function (p) {
            return false;
        };
        p.processOrCache = function (protocol, data) {
            if (false == this._cachCmd || this.noCachCmd(protocol))
                this.processCmd(protocol, data);
            else
                this._cachQueue.push({ protocol: protocol, data: data });
        };
        p.processCmd = function (protocol, data) {
            var tick = egret.getTimer();
            var action = fl.actionMgr.getAction(protocol);
            if (action) {
                action.process(data, protocol);
            }
            else {
                action = fl.actionMgr.getAction(fl.Protocol.getProtocolType(protocol));
                if (action) {
                    action.process(data, protocol);
                }
                else {
                    egret.error("[BaseNet.processCmd] unknow protocol " + protocol);
                }
            }
            var diffTick = egret.getTimer() - tick;
            if (diffTick >= 50) {
                egret.warn("[BaseNet.processCmd] handeltime: id:" + protocol + " time:" + diffTick);
            }
        };
        BaseNet.EVENT_NET_ERR = "NetErrorEvent";
        BaseNet.EVENT_CLIENT_CLOSE = "NetClientCloseEvent";
        return BaseNet;
    })(egret.HashObject);
    fl.BaseNet = BaseNet;
    egret.registerClass(BaseNet,"fl.BaseNet");
})(fl || (fl = {}));

var fl;
(function (fl) {
    var BasePack = (function (_super) {
        __extends(BasePack, _super);
        function BasePack(id) {
            _super.call(this);
            this.id = 0;
            this.size = 0;
            this.result = 0;
            this.id = id;
        }
        var d = __define,c=BasePack;p=c.prototype;
        p.getBytes = function () {
            var bytes = new dcodeIO.ByteBuffer().flip();
            bytes.offset = 2;
            bytes.writeUint32(this.id);
            this.toBytes(bytes);
            bytes.flip();
            this.size = bytes.limit - fl.BasePack.HEAD_SIZE;
            bytes.writeUint16(this.size);
            bytes.offset = 0;
            return bytes;
        };
        p.toBytes = function (bytes) {
            if (this.protoValue) {
                BasePack.writeProtoModel(this.protoValue, bytes);
            }
        };
        p.writeBytes = function (bytes) {
            this.toBytes(bytes);
        };
        p.setBytes = function (bytes) {
            bytes.offset = fl.BasePack.HEAD_SIZE;
            this.fromBytes(bytes);
            this.dealError(this.result);
        };
        p.fromBytes = function (bytes) {
            if (this.protoModel) {
                this.protoValue = BasePack.readProtoModel(this.protoModel, bytes);
            }
        };
        p.readBytes = function (bytes) {
            this.fromBytes(bytes);
        };
        p.resetBytesPos = function (bytes) {
            bytes.offset = fl.BasePack.HEAD_SIZE;
        };
        p.dealError = function (err) {
            if (err != 0) {
                fl.eventMgr.dispatchEvent(new fl.GlobalEvent(fl.BasePack.EVENT_PACK_ERR, err));
                egret.error("[BasePack.dealError] " + this.id + ":" + err);
            }
        };
        BasePack.readProtoModel = function (m, bytes, length) {
            if (length === void 0) { length = -1; }
            var v;
            if (length < 0) {
                length = bytes.readUint32();
            }
            else if (length == 0) {
                length = bytes.limit - bytes.offset;
            }
            var n = bytes.offset + length;
            var tmpBytes = bytes.copy(bytes.offset, n).flip();
            bytes.offset = n;
            v = m.decode(tmpBytes.buffer);
            return v;
        };
        BasePack.writeProtoModel = function (v, bytes) {
            var tmpBytes = dcodeIO.ByteBuffer.wrap(v.toArrayBuffer());
            if (bytes) {
                bytes.writeUint32(tmpBytes.limit);
                bytes.append(tmpBytes);
            }
            return tmpBytes;
        };
        BasePack.EVENT_PACK_ERR = "PackErrorEvent";
        BasePack.HEAD_SIZE = 6;
        BasePack.MAX_PACK_SIZE = 65536;
        return BasePack;
    })(egret.HashObject);
    fl.BasePack = BasePack;
    egret.registerClass(BasePack,"fl.BasePack");
})(fl || (fl = {}));

/// <reference path="BaseNet" />
var fl;
(function (fl) {
    var GameNet = (function (_super) {
        __extends(GameNet, _super);
        function GameNet(ip, port, id) {
            _super.call(this, ip, port, id);
            this.cachCmd(true);
        }
        var d = __define,c=GameNet;p=c.prototype;
        p.noCachCmd = function (p) {
            return false;
        };
        return GameNet;
    })(fl.BaseNet);
    fl.GameNet = GameNet;
    egret.registerClass(GameNet,"fl.GameNet");
})(fl || (fl = {}));

var fl;
(function (fl) {
    var NetManager = (function (_super) {
        __extends(NetManager, _super);
        function NetManager() {
            _super.apply(this, arguments);
            this.netCache_ = new fl.Dictionary();
        }
        var d = __define,c=NetManager;p=c.prototype;
        NetManager.getInstance = function () {
            if (null == fl.NetManager.instance_) {
                fl.NetManager.instance_ = new fl.NetManager();
            }
            return fl.NetManager.instance_;
        };
        p.addNet = function (ip, port, id, netClass) {
            if (id === void 0) { id = fl.NetManager.NET_GAME; }
            if (netClass === void 0) { netClass = null; }
            var net = this.netCache_.getItem(id);
            if (net == null) {
                netClass = netClass || fl.BaseNet;
                net = new netClass(ip, port, id);
                this.netCache_.setItem(id, net);
            }
            return net;
        };
        p.getNet = function (id) {
            if (id === void 0) { id = fl.NetManager.NET_GAME; }
            id = id || fl.NetManager.NET_GAME;
            var net = this.netCache_.getItem(id);
            return net;
        };
        p.setNet = function (net, id) {
            if (id === void 0) { id = fl.NetManager.NET_GAME; }
            if (this.netCache_.getItem(id)) {
                this.removeNet(id);
            }
            this.netCache_.setItem(id, net);
            return net;
        };
        p.removeNet = function (id) {
            if (id === void 0) { id = fl.NetManager.NET_GAME; }
            var net = null;
            if (this.netCache_.hasOwnProperty(id)) {
                net = this.netCache_.getItem(id);
                net.close();
                this.netCache_.delItem(id);
            }
            return net;
        };
        p.sendPack = function (pack, netId) {
            if (netId === void 0) { netId = fl.NetManager.NET_GAME; }
            this.sendBytes(pack.getBytes(), netId);
        };
        p.sendBytes = function (bytes, netId) {
            if (netId === void 0) { netId = fl.NetManager.NET_GAME; }
            var net = this.getNet(netId);
            net.send(bytes);
        };
        d(p, "isLocalNet"
            ,function () {
                var net = this.getNet();
                return net && net.ip.substr(0, 8) == "192.168.";
            }
            ,function (value) {
            }
        );
        NetManager.NET_GAME = "GameNet";
        return NetManager;
    })(egret.HashObject);
    fl.NetManager = NetManager;
    egret.registerClass(NetManager,"fl.NetManager");
    fl.netMgr = fl.NetManager.getInstance();
})(fl || (fl = {}));

var fl;
(function (fl) {
    var Protocol = (function (_super) {
        __extends(Protocol, _super);
        function Protocol() {
            _super.call(this);
        }
        var d = __define,c=Protocol;p=c.prototype;
        Protocol.getProtocolType = function (p) {
            p = p / fl.Protocol.CMD_TYPE_BASE;
            return Math.floor(p);
        };
        Protocol.protocolEvent = function (v) {
            return "EVENT_PROTOCOL_" + v;
        };
        Protocol.CMD_TYPE_BASE = 100000;
        Protocol._inited = false;
        return Protocol;
    })(egret.HashObject);
    fl.Protocol = Protocol;
    egret.registerClass(Protocol,"fl.Protocol");
})(fl || (fl = {}));

