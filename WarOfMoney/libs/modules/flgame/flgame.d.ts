declare module fl {
}
declare module fl {
    class GlobalEvent extends egret.Event {
        data: any;
        constructor(type: string, data?: any, bubbles?: boolean, cancelable?: boolean);
        clone(): egret.Event;
    }
}
declare module fl {
    class EventManager extends egret.EventDispatcher {
        static instance_: fl.EventManager;
        static getInstance(): fl.EventManager;
        dispatchEvent(event: egret.Event): boolean;
        private eventListeners_;
        addEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number): void;
        removeEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean): void;
        removeListeners(type?: string, useCapture?: boolean): void;
        removeAllListeners(): void;
    }
    var eventMgr: EventManager;
}
declare module fl {
    class BaseAction extends fl.Actor {
        protected mapProtocols: Array<any>;
        protocols: Array<any>;
        eventDispatcher: egret.IEventDispatcher;
        process(data: dcodeIO.ByteBuffer, protocol?: number): void;
        sendPack(pack: fl.BasePack, netId?: string): void;
        sendBytes(bytes: dcodeIO.ByteBuffer, netId?: string): void;
        dispatchEvent(e: egret.Event): void;
    }
}
declare module fl {
    class ActionManager extends egret.HashObject {
        private actionCache_;
        static instance_: fl.ActionManager;
        static getInstance(): fl.ActionManager;
        private injector_;
        initActions(injector: fl.IInjector): void;
        private actionClazz_;
        injectAction(actionClass: any): void;
        uninjectAction(actionClass: any): void;
        mapAction(action: fl.BaseAction): void;
        unmapAction(action: fl.BaseAction): void;
        getActionByClass(actionClass: any): fl.BaseAction;
        getAction(id: any): fl.BaseAction;
        setAction(action: fl.BaseAction, id: any): fl.BaseAction;
        removeAction(id: any): fl.BaseAction;
    }
    var actionMgr: fl.ActionManager;
}
declare module fl {
    class Actions extends egret.HashObject {
        static inited: boolean;
        static init(): void;
        static injectAction(actionClass: any): void;
        static uninjectAction(actionClass: any): void;
    }
}
declare module fl {
    class GameContext extends fl.Context {
        static instances_: fl.Dictionary;
        static getInstance(contextView?: egret.DisplayObjectContainer): fl.GameContext;
        constructor(contextView?: egret.DisplayObjectContainer);
        protected createEventDispatcher(): egret.IEventDispatcher;
        startup(): void;
        mapView(viewClassOrName: any, mediatorClass: any, viewIns?: any, injectViewAs?: any, autoCreate?: boolean, autoRemove?: boolean): void;
        unmapView(viewClassOrName: any): void;
        protected injectAction(actionClass: any): void;
        protected uninjectAction(actionClass: any): void;
    }
}
declare module fl {
    class GameMediator extends fl.Mediator {
        mediatorMap: fl.IMediatorMap;
        protected updateContext(): void;
        onRemove(): void;
        private viewList_;
        protected unmapMediators(): void;
        protected mapMediator(viewClazzOrName: any, mediaClazz: any, viewIns?: any, injectViewAs?: any, autoCreate?: boolean, autoRemove?: boolean): void;
        protected unmapMediator(viewClazzOrName: any): void;
        private actionList_;
        protected unmapActions(): void;
        protected injectAction(actionClass: any): void;
        protected uninjectAction(actionClass: any): void;
    }
}
declare module fl {
    class Modules extends egret.HashObject {
        static inited: boolean;
        static init(startupFuns?: Array<any>): Array<any>;
        private static registerViews();
    }
}
declare module fl {
    class BaseNet extends egret.HashObject {
        static EVENT_NET_ERR: string;
        static EVENT_CLIENT_CLOSE: string;
        ip: string;
        port: number;
        private id;
        private dataCache_;
        protected socket: egret.WebSocket;
        protected _cachCmd: boolean;
        protected _cachQueue: Array<any>;
        private _receBytes;
        constructor(ip: string, port: number, id: string);
        open(): void;
        close(): void;
        forceClose(): void;
        protected onConnect(e: egret.Event): void;
        protected notifyClose(): void;
        protected onClose(e: egret.Event): void;
        protected onError(e: egret.IOErrorEvent): void;
        send(bytes: dcodeIO.ByteBuffer): void;
        protected onReceived(e: egret.ProgressEvent): void;
        private processPacks();
        /**
         * decrypt the data if need
         **/
        protected decryption(bytes: dcodeIO.ByteBuffer): dcodeIO.ByteBuffer;
        cachCmd(b: boolean): void;
        protected noCachCmd(p: number): boolean;
        protected processOrCache(protocol: number, data: dcodeIO.ByteBuffer): void;
        protected processCmd(protocol: number, data: dcodeIO.ByteBuffer): void;
    }
}
declare module fl {
    class BasePack extends egret.HashObject {
        static EVENT_PACK_ERR: string;
        static HEAD_SIZE: number;
        static MAX_PACK_SIZE: number;
        id: number;
        size: number;
        result: number;
        protoModel: any;
        protoValue: any;
        constructor(id: number);
        getBytes(): dcodeIO.ByteBuffer;
        protected toBytes(bytes: dcodeIO.ByteBuffer): void;
        writeBytes(bytes: dcodeIO.ByteBuffer): void;
        setBytes(bytes: dcodeIO.ByteBuffer): void;
        protected fromBytes(bytes: dcodeIO.ByteBuffer): void;
        readBytes(bytes: dcodeIO.ByteBuffer): void;
        resetBytesPos(bytes: dcodeIO.ByteBuffer): void;
        protected dealError(err: number): void;
        static readProtoModel(m: any, bytes: dcodeIO.ByteBuffer, length?: number): any;
        static writeProtoModel(v: any, bytes: dcodeIO.ByteBuffer): dcodeIO.ByteBuffer;
    }
}
declare module fl {
    class GameNet extends fl.BaseNet {
        constructor(ip: string, port: number, id: string);
        protected noCachCmd(p: number): boolean;
    }
}
declare module fl {
    class NetManager extends egret.HashObject {
        static NET_GAME: string;
        static instance_: fl.NetManager;
        static getInstance(): fl.NetManager;
        private netCache_;
        addNet(ip: string, port: number, id?: string, netClass?: any): fl.BaseNet;
        getNet(id?: string): fl.BaseNet;
        setNet(net: fl.BaseNet, id?: string): fl.BaseNet;
        removeNet(id?: string): fl.BaseNet;
        sendPack(pack: fl.BasePack, netId?: string): void;
        sendBytes(bytes: dcodeIO.ByteBuffer, netId?: string): void;
        isLocalNet: boolean;
    }
    var netMgr: fl.NetManager;
}
declare module fl {
    class Protocol extends egret.HashObject {
        static CMD_TYPE_BASE: number;
        static getProtocolType(p: number): number;
        static protocolEvent(v: number): string;
        private static _inited;
        constructor();
    }
}
