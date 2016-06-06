
declare module JSA {
    interface Event {
        type: string;
    }
    class EventTarget {
        addEventListener(type:string, listener:Function):void;
        on(type:string, listener:Function):void;
        dispatchEvent(event:Event):void;
        emit(event:Event):void;
        removeEventListener(type:string, listener:Function):void;
        off(type:string, listener:Function):void;
    }
}
declare module JSA {
    class JSA {
        constructor(jsaObj?:any, zip?:any, textureHandler?:Function);
        pack:JSA.JSAPack;
        zip:any;
        textureHandler:Function;
        
        getPackItem(path:string): JSA.JSAPack;
        getPackItemData(path:string, handler:Function): JSA.JSAData;
    }
    class JSADataType {
        static NORMAL_PNG: number;
        static NORMAL_JPG: number;
        static GRAY_SCALE_JPG: number;
        static ALPHA_PNG: number;
        static INVERSE_ALPHA_PNG: number;
        static GRAY_SCALE_PNG: number;
        static NORMAL_PNG8: number;
        static TEXTURE_PNG: number;
        static TEXTURE_PNG8: number;
        static TEXTURE_JPG: number;
    }
    class JSAInfo {
        type: number;
        fps: number;
        bbox: number[];
    }
    class JSAData extends EventTarget {
        type: number;
        src: string;
        mask: string;
        offset: number[];
        textureOffset: number[];
        
        texture: any;
        pack: JSAPack;
        img: any;
        
        loadImage():any;
    }
    class JSAPack {
        name: string;
        path: string;
        type: number;
        info: JSAInfo;
        items: JSAPack[];
        data: JSAData;
        
        jsa: JSA.JSA;
        fileNum: number;
        itemNum: number;
        
        getData(): JSAData;
    }
}

declare module JSA {
    var textureHandler: Function;
    function isTexture(type:number):boolean;
    function fromJson(jsaObj:any, jsa:JSA.JSA):JSA.JSAPack;
}
declare var requestAnimFrame:Function;
declare module JSA {}
declare module JSA.FPS {
    class TimeInfo {
        constructor(frame:number, time:number, interval:number);
        frame: number;
        time: number;
        pretime: number;
        interval: number;
        
        getIntervalCount(interval:number):number;
        sync(timeInfo:TimeInfo):void;
    }
    class HandlerInfo {
        constructor(handler:Function, interval:number);
        
        handler:Function;
        preframe:number;
        timeInfo:TimeInfo;
    }
}

declare module JSA.FPS {
    var prefps:number;
    var fps:number;
    var requestId:number;
    var timeInfo:TimeInfo;
    var handlers:HandlerInfo[];
    
    function on(fps:number):void;
    function off():void;
    function frameHandler(time:number):boolean;
    function add(handler:Function, interval:number):HandlerInfo;
    function remove(handler:Function):HandlerInfo;
    function get(handler:Function):HandlerInfo;
    
}
declare module JSA {
    class JSAAnimation extends egret.MovieClip {
        constructor(pack:any);
    }
    class JSAContainer extends egret.DisplayObjectContainer {
        addAnimation(animation:JSAAnimation, sync?:boolean):JSAAnimation;
        removeAnimation(animation:JSAAnimation, dataOnly:boolean):JSAAnimation;
        removeAnimations(dataOnly:boolean):void;
    }
}