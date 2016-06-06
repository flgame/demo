/* global devel: true, console: true */
(function () {
    'use strict';
    if (typeof JSA !== 'undefined') {
        return;
    }

    var root = this,
        JSA = function() {};
        
    JSA.JSA = function (jsaObj, zip, textureHandler) {
        this.pack = JSA.fromJson(jsaObj, this);
        this.zip = zip; //zip file or texture packer
        this.textureHandler = textureHandler;
    };
    
    JSA.JSAType = {};
    JSA.JSAType.PACK = 1;
    JSA.JSAType.FOLDER = 2;
    JSA.JSAType.FILE = 3;
    JSA.JSAType.SEP_PATH = "/";

    JSA.JSADataType = {};
    JSA.JSADataType.NORMAL_PNG = 1;
    JSA.JSADataType.NORMAL_JPG = 2;
    JSA.JSADataType.GRAY_SCALE_JPG = 3;
    JSA.JSADataType.ALPHA_PNG = 4;
    JSA.JSADataType.INVERSE_ALPHA_PNG = 5;
    JSA.JSADataType.GRAY_SCALE_PNG = 6;
    JSA.JSADataType.NORMAL_PNG8 = 7;
    JSA.JSADataType.TEXTURE_PNG = 9;
    JSA.JSADataType.TEXTURE_PNG8 = 10;
    JSA.JSADataType.TEXTURE_JPG = 11;
    
    JSA.textureHandler = function() {};
    JSA.isTexture = function (t) {
        if(t == JSA.JSADataType.TEXTURE_PNG || t == JSA.JSADataType.TEXTURE_PNG8 || t == JSA.JSADataType.TEXTURE_JPG) {
            return true;
        }
        return false;
    };
    
    /**
     * self.name = name
        self.path = path
        self.type = type
        self.info = info
        self.items = items
        self.data = data
     */
    JSA.JSAPack = function () {
        this.init();
    };
    JSA.JSAPack.prototype.init = function () {
        if (this.inited) return;
        this.inited = true;
        
        this.jsa = null;
        this.fileNum = 0;
        this.itemNum = 0;
    };
    JSA.JSAPack.prototype.getData = function () {
        var data = this.data;
        if (data) {
            data.loadImage();
        }
        return data;
    };
    /**
    "type": 10,
    "fps": 12,
    "bbox": [512, 512]
     */
    JSA.JSAInfo = function () {
        this.init();
    };
    JSA.JSAInfo.prototype.init = function () {
        if (this.inited) return;
        this.inited = true;
    };
    
    /**
    self.type = type
    self.src = src
    self.mask = mask
    self.offset = offset
    self.textureOffset = textureOffset
     */
    JSA.JSAData = function () {
        this.init();
    };
    JSA.JSAData.EVENT_LOADED = "JSADataLoaded";
    JSA.JSAData.prototype.init = function () {
        if (this.inited) return;
        this.inited = true;
        
        JSA.EventTarget.call(this);
        
        this.texture = null;
        this.pack = null;
        this.img = null;
        this.imgSrc = null;
        this.imgMask = null;
    };
    JSA.JSAData.prototype.onloadHandler = function (e, force) {
        if (this.imgSrc && (this.imgSrc.complete || force) && this.imgMask && (this.imgMask.complete || force)) {
            this.img.src = JSA.getMaskImg(this.imgSrc, this.imgMask, this.type, this.offset);
            
            this.oncomplet();
        }
    };
    JSA.JSAData.prototype.onerrorHandler = function (e) {
        this.oncomplet();
    };
    JSA.JSAData.prototype.onabortHandler = function (e) {
        this.oncomplet();
    };
    JSA.JSAData.prototype.oncomplet = function () {
        this.resetImgHandler(this.imgSrc);
        this.resetImgHandler(this.imgMask);

        this.imgSrc = null;
        this.imgMask = null;
        this.loading = false;

        this.dispatchEvent({
            type: JSA.JSAData.EVENT_LOADED,
            data: this.img
        });
    };
    JSA.JSAData.prototype.resetImgHandler = function (img) {
        if (img) {
            img.onload = null;
            img.onerror = null;
            img.onabort = null;
        }
    };
    JSA.JSAData.prototype.loadImage = function () {
        var data = this, item = data.pack, jsa = item.jsa,
            type, s, data1, data2, arr, zo, blob;
        if(JSA.isTexture(data.type)) {
            var func = jsa.textureHandler || JSA.textureHandler;
            return func.call(jsa, data);
        } else if (!data.img || !data.img.src) {
            if(!data.img) data.img = new Image();
            data.img.name = item.path;
            arr = item.path.split(JSA.JSAType.SEP_PATH);
            if (data.mask) {
                if (!data.loading) {
                    data.loading = true;

                    arr[arr.length - 1] = data.src;
                    zo = jsa.zip.file(arr.join(JSA.JSAType.SEP_PATH));
                    data1 = zo.asUint8Array();
                    blob = new Blob([data1], {
                        type: "image/jpeg"
                    });
                    data.imgSrc = new Image();
                    data.imgSrc.onload = function () {
                        data.onloadHandler();
                    };
                    data.imgSrc.onerror = function () {
                        data.onerrorHandler();
                    };
                    data.imgSrc.onabort = function () {
                        data.onabortHandler;
                    };
                    data.imgSrc.src = (window.URL || window.webkitURL).createObjectURL(blob);

                    arr[arr.length - 1] = data.mask;
                    zo = jsa.zip.file(arr.join(JSA.JSAType.SEP_PATH));
                    data2 = zo.asUint8Array();
                    type = "image/png";
                    if (data.type == JSA.JSADataType.GRAY_SCALE_JPG) {
                        type = "image/jpeg";
                    }
                    blob = new Blob([data2], {
                        type: type
                    });
                    data.imgMask = new Image();
                    data.imgMask.onload = function () {
                        data.onloadHandler();
                    };
                    data.imgMask.onerror = function () {
                        data.onerrorHandler();
                    };
                    data.imgMask.onabort = function () {
                        data.onabortHandler();
                    };
                    data.imgMask.src = (window.URL || window.webkitURL).createObjectURL(blob);
                    data.onloadHandler();
                }
            } else if(data.src) {
                if(!data.img) data.img = new Image();
                
                arr[arr.length - 1] = data.src;
                zo = jsa.zip.file(arr.join(JSA.JSAType.SEP_PATH));
                data1 = zo.asUint8Array();

                type = "image/jpeg";
                if (data.type == JSA.JSADataType.NORMAL_PNG) {
                    type = "image/png";
                }
                blob = new Blob([data1], {
                    type: type
                });
                data.img.src = (window.URL || window.webkitURL).createObjectURL(blob);
            }
        }
        return data.img;
    };

    JSA.JSA.prototype.getPackItem = function (path) {
        var arr, i, j, pack = this.pack,
            item = pack;
        arr = path.split(JSA.JSAType.SEP_PATH);
        for (i = 0; i < arr.length; i += 1) {
            if (!pack.items || pack.items.length == 0) {
                item = null;
                break;
            }
            for (j = 0; j < pack.items.length; j += 1) {
                item = pack.items[j];
                if (item.name === arr[i]) {
                    break;
                }
            }
            if (j >= pack.items.length) {
                item = null;
                break;
            } else {
                pack = item;
            }
        }
        return item;
    };
    JSA.JSA.prototype.getPackData = function (item) {
        return item.getData();
    };
    JSA.JSA.prototype.getPackItemData = function (path, handler) {
        var data, item = this.getPackItem(path),
            f = function (event) {
                if (typeof (handler) === "function") {
                    handler.call(null, item);
                }
            };
        if (item) {
            data = this.getPackData(item);
            if (data && !data.img.src) {
                data.addEventListener(JSA.JSAData.EVENT_LOADED, f);
            } else {
                f();
            }
        } else {
            f();
        }
        return data;
    };

    JSA.fromJson = function (jsaObj, jsa) {
        var i = 0, j = 0, item;
        if (jsaObj) {
            jsaObj.__proto__ = JSA.JSAPack.prototype;
            jsaObj.init();
            jsaObj.jsa = jsa;
            if (jsaObj.info && !jsaObj.info.inited) {
                jsaObj.info.__proto__ = JSA.JSAInfo.prototype;
                jsaObj.info.init();
            }
            
            if (jsaObj.items) {
                for (i = 0; i < jsaObj.items.length; i += 1) {
                    item = jsaObj.items[i];
                    if(item.type == JSA.JSAType.FILE) {
                        j += 1;
                    }
                    if (item.info && !item.info.inited) {
                        item.info.__proto__ = JSA.JSAInfo.prototype;
                        item.info.init();
                    } else {
                        item.info = jsaObj.info;
                    }
                    JSA.fromJson(item, jsa);
                }
            }
            jsaObj.itemNum = i;
            jsaObj.fileNum = j;
            
            if (jsaObj.data) {
                jsaObj.data.__proto__ = JSA.JSAData.prototype;
                jsaObj.data.init();
                jsaObj.data.pack = jsaObj;
            }
        }
        return jsaObj;
    };

    JSA.getCanvas = function () {
        if (!JSA.canvas) {
            JSA.canvas = document.createElement('canvas');
            JSA.canvas.style.display = 'none';
        }
        return JSA.canvas;
    };
    JSA.getMaskImg = function (src, mask, type, offset) {
        var context, w = offset ? Number(offset[2]) : src.width,
            h = offset ? Number(offset[3]) : src.height,
            canvas = JSA.getCanvas();

        canvas.width = w;
        canvas.height = h;

        context = canvas.getContext('2d');
        context.clearRect(0, 0, w, h);
        context.drawImage(src, 0, 0, w, h);

        context.globalCompositeOperation = 'xor';
        if (type == JSA.JSADataType.GRAY_SCALE_JPG || type == JSA.JSADataType.GRAY_SCALE_PNG) {
            mask = JSA.grayScale2InverseAlphaMask(mask, offset);
        } else if (type == JSA.JSADataType.ALPHA_PNG) {
            context.globalCompositeOperation = 'destination-in';
        }
        context.drawImage(mask, 0, 0, w, h);

        return canvas.toDataURL('image/png');
    };
    JSA.grayScale2InverseAlphaMask = function (gs, offset) {
        var id, data, i, context, w = offset ? Number(offset[2]) : gs.width,
            h = offset ? Number(offset[3]) : gs.height,
            canvas = document.createElement('canvas');

        canvas.width = w;
        canvas.height = h;

        context = canvas.getContext('2d');
        context.drawImage(gs, 0, 0, w, h);
        id = context.getImageData(0, 0, w, h);
        data = id.data;
        for (i = data.length - 1; i > 0; i -= 4) {
            data[i] = 255 - data[i - 3];
        }
        context.clearRect(0, 0, w, h);
        context.putImageData(id, 0, 0);
        return canvas;
    };
    
    /**
     * https://github.com/mrdoob/eventtarget.js/
     * THankS mr DOob!
     */

    /**
     * Adds event emitter functionality to a class
     *
     * @class EventTarget
     * @example
     *		function MyEmitter() {
     *			JSA.EventTarget.call(this); //mixes in event target stuff
     *		}
     *
     *		var em = new MyEmitter();
     *		em.emit({ type: 'eventName', data: 'some data' });
     */
    JSA.EventTarget = function () {
        var listeners = {};
        this.addEventListener = this.on = function (type, listener) {
            if (listeners[type] === undefined) {
                listeners[type] = [];
            }
            if (listeners[type].indexOf(listener) === -1) {
                listeners[type].push(listener);
            }
        };
        
        this.dispatchEvent = this.emit = function (event) {
            for (var listener in listeners[event.type]) {
                listeners[event.type][listener](event);
            }
        };
        
        this.removeEventListener = this.off = function (type, listener) {
            var index = listeners[type].indexOf(listener);
            if (index !== -1) {
                listeners[type].splice(index, 1);
            }
        };
    };
    
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = JSA;
        }
        exports.JSA = JSA;
    } else {
        root.JSA = JSA;
    }
}).call(this);
/* global devel: true, console: true */
(function () {
    'use strict';
    if (typeof JSA.FPS !== 'undefined') {
        return;
    }

    var root = this,
        FPS = function () {
        };
    
    FPS.HandlerInfo = function (handler, interval) {
        this.handler = handler; //回调handler(this.timeInfo)
        this.preframe = 0; //上一次调用帧
        this.timeInfo = new FPS.TimeInfo(0, 0, interval);
    };
    FPS.TimeInfo = function (frame, time, interval) {
        this.frame = frame; //当前帧
        this.time = time; //当前时间
        this.preTime = 0; //上一次调用时间
        this.interval = interval ? interval : 1; //时间间隔或帧间隔
    };
    FPS.TimeInfo.prototype.getIntervalCount = function (interval) {
        if (!interval) interval = this.interval;
        
        return ((this.time - this.preTime) / interval) | 0;
    };
    FPS.TimeInfo.prototype.sync = function (timeInfo) {
        if (timeInfo) {
            this.frame = timeInfo.frame;
            this.time = timeInfo.time;
            this.preTime = timeInfo.preTime;
            this.interval = timeInfo.interval;
        }
    };
    
    FPS.prefps = 30;
    FPS.fps = 30;
    FPS.requestId = 0;
    FPS.timeInfo = new FPS.TimeInfo(0, 0, 1000 / 30);
    FPS.on = function (fps) {
        if (fps) FPS.fps = fps;
    };
    FPS.off = function () {
    };
    FPS.frameHandler = function (time) {
        var i, hInfo;
        
        if (FPS.fps != FPS.prefps) {
            FPS.prefps = FPS.fps;
            FPS.timeInfo.interval = 1000 / FPS.fps;
        }
        FPS.timeInfo.time = time;
        if (FPS.timeInfo.frame != 0) {
            if (FPS.timeInfo.getIntervalCount() < 1) {
                //没到帧时间
                return;
            }
        }
        
        for (i = 0; i < FPS.handlers.length; i += 1) {
            hInfo = FPS.handlers[i];
            hInfo.timeInfo.time = time;
            if (hInfo.preframe == 0 || FPS.timeInfo.frame - hInfo.preframe >= hInfo.timeInfo.interval) {
                hInfo.handler.call(hInfo, hInfo.timeInfo);
                hInfo.timeInfo.frame += 1;
                hInfo.timeInfo.preTime = time;
                hInfo.preframe = FPS.timeInfo.frame;
            }
        }
        
        FPS.timeInfo.preTime = time;
        FPS.timeInfo.frame += 1;
        return true;
    };
    FPS.add = function (handler, interval) {
        var hInfo = FPS.get(handler);
        if (null == hInfo) {
            hInfo = new FPS.HandlerInfo(handler, interval);
            FPS.handlers.push(hInfo);
        } else if (interval) {
            hInfo.timeInfo.interval = interval;
        }
        return hInfo;
    };
    FPS.remove = function (handler) {
        var i, hInfo = FPS.get(handler);
        if (hInfo) {
            i = FPS.handlers.indexOf(hInfo);
            FPS.handlers.splice(i, 1);
        }
        return hInfo;
    };
    FPS.handlers = [];
    FPS.get = function (handler) {
        var i, hInfo;
        for (i = FPS.handlers.length - 1; i >= 0; i -= 1) {
            hInfo = handlers[i];
            if (hInfo && hInfo.handler == handler) {
                return hInfo;
            }
        }
        return null;
    };
    
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = JSA.FPS;
        }
        exports.JSA.FPS = FPS;
    } else {
        root.JSA.FPS = FPS;
    }
}).call(this);
/* global devel: true, console: true */
(function () {
    'use strict';
    if (typeof JSA.JSAAnimation !== 'undefined') {
        return;
    }
    var root = this;
    
    JSA.textureHandler = function(data) {
        var texture = data.texture;
        if(!texture) {
            texture = data.texture = {
                "frameData": {"res": data.pack.path, "x": data.offset[0], "y": data.offset[1]},
                "textureData": {"x": data.textureOffset[0], "y": data.textureOffset[1], "w": data.textureOffset[2], "h": data.textureOffset[3]}
            };
            
        }
        return texture;
    };
    
    /**
     * base on egret: http://www.egret.com
     */
    JSA.JSAAnimation = function (pack) {
        var i, item, texture, frames = [], mcData = {}, textureData = {};
        var movieClipData = new egret.MovieClipData();
        this.timeInfo = new JSA.FPS.TimeInfo(0, 0, 0);
        if (pack && pack.items) {
            for (i = 0; i < pack.items.length; i += 1) {
                item = pack.items[i];
                if (item.data && item.type == JSA.JSAType.FILE) {
                    if(JSA.isTexture(item.data.type)) {
                        texture = item.data.loadImage();
                        frames.push(texture["frameData"]);
                        textureData[item.path] = texture["textureData"];
                    } else {
                        //doesn't support
                    }
                }
            }
            if (pack.info && pack.info.fps) {
                this.timeInfo.interval = 1000 / pack.info.fps;
            }
            
            movieClipData.spriteSheet = pack.jsa.zip;
            movieClipData.textureData = textureData;
            mcData["frames"] = frames;
            movieClipData.mcData = mcData;
        }
        
        egret.MovieClip.call(this, movieClipData);
    };
    // constructor
    JSA.JSAAnimation.prototype = Object.create( egret.MovieClip.prototype );
    JSA.JSAAnimation.prototype.constructor = JSA.JSAAnimation;
    JSA.JSAAnimation.prototype.advanceTime = function (timeStamp) {
        var self = this;
        self.timeInfo.time = timeStamp;
        var count = 1;
        if(self.timeInfo.interval && self.timeInfo.preTime) {
            count = self.timeInfo.getIntervalCount();
        }
        if (count == 0) {
            return false;
        }
        while (count >= 1) {
            count--;
            self.$nextFrameNum++;
            if (self.$nextFrameNum > self.$totalFrames || (self.$frameLabelStart>0 && self.$nextFrameNum>self.$frameLabelEnd)) {
                if (self.playTimes == -1) {
                    self.$eventPool.push(egret.Event.LOOP_COMPLETE);
                    self.$nextFrameNum = 1;
                }
                else {
                    self.playTimes--;
                    if (self.playTimes > 0) {
                        self.$eventPool.push(egret.Event.LOOP_COMPLETE);
                        self.$nextFrameNum = 1;
                    }
                    else {
                        self.$nextFrameNum = self.$totalFrames;
                        self.$eventPool.push(egret.Event.COMPLETE);
                        self.stop();
                        break;
                    }
                }
            }
            if(self.$currentFrameNum == self.$frameLabelEnd){
                self.$nextFrameNum = self.$frameLabelStart;
            }
            self.advanceFrame();
        }
        self.constructFrame();
        self.handlePendingEvent();
        self.timeInfo.preTime = self.timeInfo.time;
        
        return false;
    };
    
    JSA.JSAContainer = function() {
        egret.DisplayObjectContainer.call(this);
        
        this.animations = [];
    };
    // constructor
    JSA.JSAContainer.prototype = Object.create( egret.DisplayObjectContainer.prototype );
    JSA.JSAContainer.prototype.constructor = JSA.JSAContainer;
    JSA.JSAContainer.prototype.addAnimation = function (animation, sync) {
        var i = this.animations.indexOf(animation);
        if (i < 0) {
            if (sync && this.animations.length > 0) {
                animation.gotoAndPlay(this.animations[0].currentFrame, -1);
            } else {
                animation.gotoAndPlay(0, -1);
            }
            this.addChild(animation);
            this.animations.push(animation);
        }
        return animation;
    };
    JSA.JSAContainer.prototype.removeAnimation = function (animation, dataOnly) {
        var i = this.animations.indexOf(animation);
        if (i >= 0) {
            animation.stop();
            if (!dataOnly) this.removeChild(animation);
            this.animations.splice(i, 1);
        }
        return animation;
    };
    JSA.JSAContainer.prototype.removeAnimations = function (dataOnly) {
        var animations = this.animations;
        var i = animations.length - 1;
        for (i; i >= 0; i -= 1) {
            this.removeAnimation(animations[i], dataOnly);
        }
    };
    JSA.JSAContainer.prototype.removeChildren = function () {
        this.removeAnimations(true)
        egret.DisplayObjectContainer.prototype.removeChildren.call(this);
    };
}).call(this);
