
/**
 * Created by feir on 2015/11/14.
 */
var fl;
(function (fl) {
    fl.P_$UIComponent = "$UIComponent";
    /**event: eui.UIEvent.CREATION_COMPLETE = "creationComplete" */
    function isComponentInited(comp) {
        var b = true;
        if (comp && (fl.P_$UIComponent in comp)) {
            b = comp[fl.P_$UIComponent][29 /* initialized */];
        }
        return b;
    }
    fl.isComponentInited = isComponentInited;
    //hook contextView
    fl.P_$fl$contextView = "$fl$contextView";
    function injectContextView(comp, contextView) {
        if (isString(comp))
            comp = egret.getDefinitionByName(comp);
        if (comp)
            comp[fl.P_$fl$contextView] = contextView;
    }
    fl.injectContextView = injectContextView;
    function uninjectContextView(comp) {
        if (isString(comp))
            comp = egret.getDefinitionByName(comp);
        if (comp)
            comp[fl.P_$fl$contextView] = null;
    }
    fl.uninjectContextView = uninjectContextView;
    function getContextView(comp) {
        var cv;
        if (isObject(comp)) {
            cv = comp[fl.P_$fl$contextView];
            if (cv) {
                return cv;
            }
            comp = comp.constructor;
        }
        if (isClass(comp)) {
            cv = comp[fl.P_$fl$contextView];
        }
        return cv;
    }
    fl.getContextView = getContextView;
    /** hook egret.DisplayObject to dispatch egret.Event.ADDED_TO_STAGE to contextView */
    function hookContextView(comp) {
        var p = comp.prototype;
        Object.defineProperty(p, "initialized", { configurable: true, enumerable: true, get: function () {
                return fl.isComponentInited(this);
            } });
        var contextView;
        var e;
        var f1 = p.$onAddToStage;
        p.$onAddToStage = function (stage, nestLevel) {
            f1.apply(this, arguments);
            contextView = getContextView(this);
            if (contextView) {
                e = egret.Event.create(egret.Event, egret.Event.ADDED_TO_STAGE);
                e.$setTarget(this);
                e.$currentTarget = contextView;
                contextView.$notifyListener(e, true);
            }
        };
        var f2 = p.$onRemoveFromStage;
        p.$onRemoveFromStage = function () {
            f2.apply(this, arguments);
            contextView = getContextView(this);
            if (contextView) {
                e = egret.Event.create(egret.Event, egret.Event.REMOVED_FROM_STAGE);
                e.$setTarget(this);
                e.$currentTarget = contextView;
                contextView.$notifyListener(e, true);
            }
        };
    }
    fl.hookContextView = hookContextView;
    function isNumber(value) {
        var type = (typeof value);
        if (type === "object") {
            type = Object.prototype.toString.call(value);
            ;
            return type === "[object Number]";
        }
        else {
            return type === "number";
        }
    }
    fl.isNumber = isNumber;
    function isString(value) {
        var type = (typeof value);
        if (type === "object") {
            type = Object.prototype.toString.call(value);
            ;
            return type === "[object String]";
        }
        else {
            return type === "string";
        }
    }
    fl.isString = isString;
    function isArray(value) {
        if (Array.isArray)
            return Array.isArray(value);
        if (value)
            return Object.prototype.toString.call(value) === "[object Array]";
    }
    fl.isArray = isArray;
    function isObject(value) {
        var type = (typeof value);
        return type === "object";
    }
    fl.isObject = isObject;
    function isClass(value) {
        var type = (typeof value);
        return type === "function";
    }
    fl.isClass = isClass;
    function is(value, superValue) {
        if (value === superValue)
            return true;
        if (!value || !superValue)
            return false;
        var types;
        if (isString(value)) {
            types = [value];
        }
        else {
            var proto = value.prototype ? value.prototype : Object.getPrototypeOf(value);
            types = proto ? proto.__types__ : null;
            if (!types) {
                return false;
            }
        }
        superValue = getClassName(superValue);
        return (types.indexOf(superValue) !== -1);
    }
    fl.is = is;
    function getClassName(value, replaceColons) {
        if (replaceColons === void 0) { replaceColons = false; }
        var fqcn;
        if (fl.isString(value)) {
            fqcn = value;
        }
        else {
            fqcn = egret.getQualifiedClassName(value);
        }
        return replaceColons ? fqcn.replace('::', '.') : fqcn;
    }
    fl.getClassName = getClassName;
    //START: ------ string utils ------
    function isWhitespace(character) {
        switch (character) {
            case " ":
            case "\t":
            case "\r":
            case "\n":
            case "\f":
                return true;
            default:
                return false;
        }
    }
    fl.isWhitespace = isWhitespace;
    function substitute(str) {
        var rest = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            rest[_i - 1] = arguments[_i];
        }
        if (str == null)
            return '';
        var len = rest.length;
        var args;
        if (len == 1 && fl.isArray(rest[0])) {
            args = rest[0];
            len = args.length;
        }
        else {
            args = rest;
        }
        for (var i = 0; i < len; i++) {
            str = str.replace(new RegExp("\\{" + i + "\\}", "g"), args[i]);
        }
        return str;
    }
    fl.substitute = substitute;
    function joinLines(value) {
        fl.LINE_BREAKS.lastIndex = 0;
        return value ? value.replace(fl.LINE_BREAKS, "") : value;
    }
    fl.joinLines = joinLines;
    function toFixed(value, p, trimZero) {
        if (p === void 0) { p = 2; }
        if (trimZero === void 0) { trimZero = true; }
        var tmpS = value.toFixed(p);
        if (trimZero && p > 0) {
            for (var i = tmpS.length - 1; i >= 0; i--) {
                var tmpC = tmpS.charAt(i);
                if (tmpC == '.') {
                    break;
                }
                else if (tmpC != '0') {
                    i++;
                    break;
                }
            }
            tmpS = tmpS.substring(0, i);
        }
        return tmpS;
    }
    fl.toFixed = toFixed;
    function replaceText(s, ft, tt) {
        return s.split(ft).join(tt);
    }
    fl.replaceText = replaceText;
    function stringFullMatch(source, target) {
        var tmpResult = false;
        if (source == target) {
            tmpResult = true;
        }
        else if (source == null || target == null) {
            tmpResult = false;
        }
        else {
            var tmpReg = new RegExp('^' + target + '$', 'm');
            tmpResult = (null != source.match(tmpReg));
        }
        return tmpResult;
    }
    fl.stringFullMatch = stringFullMatch;
    function formatHtml(s, color, size, bold, under, italic, face) {
        if (color === void 0) { color = null; }
        if (size === void 0) { size = null; }
        if (bold === void 0) { bold = false; }
        if (under === void 0) { under = false; }
        if (italic === void 0) { italic = false; }
        if (face === void 0) { face = "SimSun"; }
        var sc = "";
        if (color != null) {
            sc = fl.getColorStr(fl.getColor(color));
            sc = "color='" + sc + "'";
        }
        var ss = "";
        if (size != null) {
            ss = "size='" + size + "'";
        }
        var sf = "";
        if (face != null) {
            sf = "face='" + face + "'";
        }
        var template = fl.substitute(fl.COLOR_TEXT, sc, ss, sf, s);
        if (bold) {
            template = "<b>" + template + "</b>";
        }
        if (under) {
            template = "<u>" + template + "</u>";
        }
        if (italic) {
            template = "<i>" + template + "</i>";
        }
        return template;
    }
    fl.formatHtml = formatHtml;
    function getWordWidth(value) {
        var tmpResult = 0;
        for (var i = 0; i < value.length; i++) {
            var tmpC = value.charCodeAt(i);
            if (tmpC >= 0 && tmpC <= 126) {
                tmpResult += 1;
            }
            else {
                tmpResult += 2;
            }
        }
        return tmpResult;
    }
    fl.getWordWidth = getWordWidth;
    function strByteLen(str) {
        var byteLen = 0;
        if (!str)
            return 0;
        var strLen = str.length;
        for (var i = 0; i < strLen; i++) {
            byteLen += str.charCodeAt(i) >= 0x7F ? 2 : 1;
        }
        return byteLen;
    }
    fl.strByteLen = strByteLen;
    function repeatStr(str, count) {
        var s = "";
        for (var i = 0; i < count; i++) {
            s += str;
        }
        return s;
    }
    fl.repeatStr = repeatStr;
    function complementByChar(str, length, char, ignoreHtml) {
        if (ignoreHtml === void 0) { ignoreHtml = true; }
        var byteLen = fl.strByteLen(ignoreHtml ? str.replace(fl.HTML_TAG, "") : str);
        return str + fl.repeatStr(char, length - byteLen);
    }
    fl.complementByChar = complementByChar;
    //END:------ string utils ------
    //START:------ color utils -----
    function adjustBrightness(rgb, brite) {
        var r = Math.max(Math.min(((rgb >> 16) & 0xFF) + brite, 255), 0);
        var g = Math.max(Math.min(((rgb >> 8) & 0xFF) + brite, 255), 0);
        var b = Math.max(Math.min((rgb & 0xFF) + brite, 255), 0);
        return (r << 16) | (g << 8) | b;
    }
    fl.adjustBrightness = adjustBrightness;
    function adjustBrightness2(rgb, brite) {
        var r = 0;
        var g = 0;
        var b = 0;
        if (brite == 0)
            return rgb;
        if (brite < 0) {
            brite = (100 + brite) / 100;
            r = ((rgb >> 16) & 0xFF) * brite;
            g = ((rgb >> 8) & 0xFF) * brite;
            b = (rgb & 0xFF) * brite;
        }
        else {
            brite /= 100;
            r = ((rgb >> 16) & 0xFF);
            g = ((rgb >> 8) & 0xFF);
            b = (rgb & 0xFF);
            r += ((0xFF - r) * brite);
            g += ((0xFF - g) * brite);
            b += ((0xFF - b) * brite);
            r = Math.min(r, 255);
            g = Math.min(g, 255);
            b = Math.min(b, 255);
        }
        return (r << 16) | (g << 8) | b;
    }
    fl.adjustBrightness2 = adjustBrightness2;
    function rgbMultiply(rgb1, rgb2) {
        var r1 = (rgb1 >> 16) & 0xFF;
        var g1 = (rgb1 >> 8) & 0xFF;
        var b1 = rgb1 & 0xFF;
        var r2 = (rgb2 >> 16) & 0xFF;
        var g2 = (rgb2 >> 8) & 0xFF;
        var b2 = rgb2 & 0xFF;
        return ((r1 * r2 / 255) << 16) | ((g1 * g2 / 255) << 8) | (b1 * b2 / 255);
    }
    fl.rgbMultiply = rgbMultiply;
    function getColorStr(color) {
        var result = "#";
        result += color.toString(16);
        return result;
    }
    fl.getColorStr = getColorStr;
    function getColorInt(color) {
        return Number("0x" + color.substr(1, color.length));
    }
    fl.getColorInt = getColorInt;
    function getColor(color) {
        var n = 0;
        if (fl.isString(color)) {
            if (String(color).charAt(0) == "#") {
                n = fl.getColorInt(color);
            }
            else {
                n = Number(color);
            }
        }
        else {
            n = Number(color);
        }
        return n;
    }
    fl.getColor = getColor;
})(fl || (fl = {}));
fl.LINE_BREAKS = new RegExp("[\r\n]+", "img");
fl.COLOR_TEXT = "\<font {0} {1} {2}\>{3}\</font\>";
fl.HTML_TAG = /<[^>]+>/g;
//hooks
fl.hookContextView(egret.DisplayObject);

var fl;
(function (fl) {
    var Error = (function () {
        function Error(message, name) {
            if (message === void 0) { message = ""; }
            if (name === void 0) { name = 0; }
            this.name = name;
            this.message = message;
        }
        var d = __define,c=Error;p=c.prototype;
        return Error;
    })();
    fl.Error = Error;
    egret.registerClass(Error,"fl.Error");
})(fl || (fl = {}));

/**
 * Created by huitao on 2015/6/25.
 */
var fl;
(function (fl) {
    var Dictionary = (function () {
        function Dictionary(weak) {
            this.map = new Array();
        }
        var d = __define,c=Dictionary;p=c.prototype;
        p.getItem = function (key, val) {
            for (var i = 0; i < this.map.length; i++) {
                if (this.map[i][0] == key)
                    return this.map[i][1];
            }
            if (val) {
                this.map.push([key, val]);
            }
            return val;
        };
        p.setItem = function (key, val) {
            for (var i = 0; i < this.map.length; i++) {
                if (this.map[i][0] == key) {
                    this.map[i][1] = val;
                    return;
                }
            }
            this.map.push([key, val]);
            return val;
        };
        p.delItem = function (key) {
            var item;
            for (var i = 0; i < this.map.length; i++) {
                if (this.map[i][0] == key) {
                    item = this.map[i][1];
                    this.map.splice(i, 1);
                    break;
                }
            }
            return item;
        };
        p.hasOwnProperty = function (key) {
            if (this.map == undefined || this.map.length == undefined) {
                return false;
            }
            for (var i = 0; i < this.map.length; i++) {
                if (this.map[i][0] == key) {
                    return true;
                }
            }
            return false;
        };
        return Dictionary;
    })();
    fl.Dictionary = Dictionary;
    egret.registerClass(Dictionary,"fl.Dictionary");
})(fl || (fl = {}));

var fl;
(function (fl) {
    fl.ICommandMap = "fl.ICommandMap";
})(fl || (fl = {}));

var fl;
(function (fl) {
    fl.IContext = "fl.IContext";
})(fl || (fl = {}));

var fl;
(function (fl) {
    fl.IContextProvider = "fl.IContextProvider";
})(fl || (fl = {}));

var fl;
(function (fl) {
    fl.IEventMap = "fl.IEventMap";
})(fl || (fl = {}));

var fl;
(function (fl) {
    fl.IInjector = "fl.IInjector";
})(fl || (fl = {}));

var fl;
(function (fl) {
    fl.IMediator = "fl.IMediator";
})(fl || (fl = {}));

var fl;
(function (fl) {
    fl.IMediatorMap = "fl.IMediatorMap";
})(fl || (fl = {}));

var fl;
(function (fl) {
    fl.IReflector = "fl.IReflector";
})(fl || (fl = {}));

var fl;
(function (fl) {
    fl.IViewMap = "fl.IViewMap";
})(fl || (fl = {}));

var fl;
(function (fl) {
    var InjectionConfig = (function (_super) {
        __extends(InjectionConfig, _super);
        function InjectionConfig(request, injectionName) {
            _super.call(this);
            this.request = request;
            this.injectionName = injectionName;
        }
        var d = __define,c=InjectionConfig;p=c.prototype;
        p.getResponse = function (injector) {
            var ij = this.m_injector || injector;
            if (this.m_result) {
                return this.m_result.getResponse(ij);
            }
            var parentConfig = ij.getAncestorMapping(this.request, this.injectionName);
            if (parentConfig) {
                return parentConfig.getResponse(injector);
            }
            return null;
        };
        p.hasResponse = function (injector) {
            if (this.m_result) {
                return true;
            }
            var ij = this.m_injector || injector;
            var parentConfig = ij.getAncestorMapping(this.request, this.injectionName);
            return parentConfig != null;
        };
        p.hasOwnResponse = function () {
            return this.m_result != null;
        };
        p.setResult = function (result) {
            if (this.m_result != null && result != null) {
                console.log('Warning: Injector already has a rule for type "' + fl.getClassName(this.request) + '", named "' + this.injectionName + '".\n ' + 'If you have overwritten this mapping intentionally you can use ' + '"injector.unmap()" prior to your replacement mapping in order to ' + 'avoid seeing this message.');
            }
            this.m_result = result;
        };
        p.setInjector = function (injector) {
            this.m_injector = injector;
        };
        return InjectionConfig;
    })(egret.HashObject);
    fl.InjectionConfig = InjectionConfig;
    egret.registerClass(InjectionConfig,"fl.InjectionConfig");
})(fl || (fl = {}));

var fl;
(function (fl) {
    var InjectionType = (function (_super) {
        __extends(InjectionType, _super);
        function InjectionType() {
            _super.apply(this, arguments);
        }
        var d = __define,c=InjectionType;p=c.prototype;
        return InjectionType;
    })(egret.HashObject);
    fl.InjectionType = InjectionType;
    egret.registerClass(InjectionType,"fl.InjectionType");
})(fl || (fl = {}));
fl.InjectionType.VALUE = 0;
fl.InjectionType.CLASS = 1;
fl.InjectionType.SINGLETON = 2;

var fl;
(function (fl) {
    var Injector = (function (_super) {
        __extends(Injector, _super);
        function Injector() {
            _super.call(this);
            this.m_mappings = new fl.Dictionary();
            this.m_injecteeDescriptions = fl.Injector.INJECTION_POINTS_CACHE;
            this.m_attendedToInjectees = new fl.Dictionary(true);
        }
        var d = __define,c=Injector;p=c.prototype;
        p.mapValue = function (whenAskedFor, useValue, named) {
            if (named === void 0) { named = ""; }
            var config = this.getMapping(whenAskedFor, named);
            config.setResult(new fl.InjectValueResult(useValue));
            return config;
        };
        p.mapClass = function (whenAskedFor, instantiateClass, named) {
            if (named === void 0) { named = ""; }
            var config = this.getMapping(whenAskedFor, named);
            config.setResult(new fl.InjectClassResult(instantiateClass));
            return config;
        };
        p.mapSingleton = function (whenAskedFor, named) {
            if (named === void 0) { named = ""; }
            return this.mapSingletonOf(whenAskedFor, whenAskedFor, named);
        };
        p.mapSingletonOf = function (whenAskedFor, useSingletonOf, named) {
            if (named === void 0) { named = ""; }
            var config = this.getMapping(whenAskedFor, named);
            config.setResult(new fl.InjectSingletonResult(useSingletonOf));
            return config;
        };
        p.mapRule = function (whenAskedFor, useRule, named) {
            if (named === void 0) { named = ""; }
            var config = this.getMapping(whenAskedFor, named);
            config.setResult(new fl.InjectOtherRuleResult(useRule));
            return useRule;
        };
        p.getMapping = function (whenAskedFor, named) {
            if (named === void 0) { named = ""; }
            var requestName = fl.getClassName(whenAskedFor);
            var config = this.m_mappings.getItem(requestName + '#' + named);
            if (!config) {
                config = this.m_mappings.setItem(requestName + '#' + named, new fl.InjectionConfig(whenAskedFor, named));
            }
            return config;
        };
        p.injectInto = function (target) {
            if (this.m_attendedToInjectees.getItem(target)) {
                return;
            }
            this.m_attendedToInjectees.setItem(target, true);
        };
        p.instantiate = function (clazz) {
            var injecteeDescription = this.m_injecteeDescriptions.getItem(clazz);
            if (!injecteeDescription) {
                injecteeDescription = this.getInjectionPoints(clazz);
            }
            var injectionPoint = injecteeDescription.ctor;
            var instance = injectionPoint.applyInjection(clazz, this);
            this.injectInto(instance);
            return instance;
        };
        p.unmap = function (clazz, named) {
            if (named === void 0) { named = ""; }
            var mapping = this.getConfigurationForRequest(clazz, named);
            if (!mapping) {
                throw new fl.InjectorError('Error while removing an injector mapping: ' + 'No mapping defined for class ' + fl.getClassName(clazz) + ', named "' + named + '"');
            }
            mapping.setResult(null);
        };
        p.hasMapping = function (clazz, named) {
            if (named === void 0) { named = ''; }
            var mapping = this.getConfigurationForRequest(clazz, named);
            if (!mapping) {
                return false;
            }
            return mapping.hasResponse(this);
        };
        p.getInstance = function (clazz, named) {
            if (named === void 0) { named = ''; }
            var mapping = this.getConfigurationForRequest(clazz, named);
            if (!mapping || !mapping.hasResponse(this)) {
                throw new fl.InjectorError('Error while getting mapping response: ' + 'No mapping defined for class ' + fl.getClassName(clazz) + ', named "' + named + '"');
            }
            return mapping.getResponse(this);
        };
        p.createChildInjector = function () {
            var injector = new fl.Injector();
            injector.setParentInjector(this);
            return injector;
        };
        p.setParentInjector = function (parentInjector) {
            if (this.m_parentInjector && !parentInjector) {
                this.m_attendedToInjectees = new fl.Dictionary(true);
            }
            this.m_parentInjector = parentInjector;
            if (parentInjector) {
                this.m_attendedToInjectees = parentInjector.attendedToInjectees;
            }
        };
        p.getParentInjector = function () {
            return this.m_parentInjector;
        };
        Injector.purgeInjectionPointsCache = function () {
            fl.Injector.INJECTION_POINTS_CACHE = new fl.Dictionary(true);
        };
        p.getAncestorMapping = function (whenAskedFor, named) {
            if (named === void 0) { named = null; }
            var parent = this.m_parentInjector;
            while (parent) {
                var parentConfig = parent.getConfigurationForRequest(whenAskedFor, named, false);
                if (parentConfig && parentConfig.hasOwnResponse()) {
                    return parentConfig;
                }
                parent = parent.getParentInjector();
            }
            return null;
        };
        d(p, "attendedToInjectees"
            ,function () {
                return this.m_attendedToInjectees;
            }
            ,function (value) {
                this.m_attendedToInjectees = value;
            }
        );
        p.getInjectionPoints = function (clazz) {
            var injectionPoints = [];
            var ctorInjectionPoint = new fl.NoParamsConstructorInjectionPoint();
            var injecteeDescription = new InjecteeDescription(ctorInjectionPoint, injectionPoints);
            this.m_injecteeDescriptions.setItem(clazz, injecteeDescription);
            return injecteeDescription;
        };
        p.getConfigurationForRequest = function (clazz, named, traverseAncestors) {
            if (traverseAncestors === void 0) { traverseAncestors = true; }
            var requestName = fl.getClassName(clazz);
            var config = this.m_mappings.getItem(requestName + '#' + named);
            if (!config && traverseAncestors && this.m_parentInjector && this.m_parentInjector.hasMapping(clazz, named)) {
                config = this.getAncestorMapping(clazz, named);
            }
            return config;
        };
        return Injector;
    })(egret.HashObject);
    fl.Injector = Injector;
    egret.registerClass(Injector,"fl.Injector",["fl.IInjector"]);
    var InjecteeDescription = (function (_super) {
        __extends(InjecteeDescription, _super);
        function InjecteeDescription(ctor, injectionPoints) {
            _super.call(this);
            this.ctor = ctor;
            this.injectionPoints = injectionPoints;
        }
        var d = __define,c=InjecteeDescription;p=c.prototype;
        return InjecteeDescription;
    })(egret.HashObject);
    egret.registerClass(InjecteeDescription,"InjecteeDescription");
})(fl || (fl = {}));
fl.Injector.INJECTION_POINTS_CACHE = new fl.Dictionary(true);

var fl;
(function (fl) {
    var InjectorError = (function (_super) {
        __extends(InjectorError, _super);
        function InjectorError(message, name) {
            if (message === void 0) { message = ""; }
            if (name === void 0) { name = 0; }
            _super.call(this, message, name);
        }
        var d = __define,c=InjectorError;p=c.prototype;
        return InjectorError;
    })(fl.Error);
    fl.InjectorError = InjectorError;
    egret.registerClass(InjectorError,"fl.InjectorError");
})(fl || (fl = {}));

var fl;
(function (fl) {
    var Reflector = (function (_super) {
        __extends(Reflector, _super);
        function Reflector() {
            _super.call(this);
        }
        var d = __define,c=Reflector;p=c.prototype;
        p.classExtendsOrImplements = function (classOrClassName, superclass) {
            var actualClass;
            if (fl.isString(classOrClassName)) {
                try {
                    actualClass = egret.getDefinitionByName(classOrClassName);
                }
                catch (e) {
                    throw new fl.Error("The class name " + classOrClassName + " is not valid because of " + e + "\n" + e.getStackTrace());
                }
            }
            else {
                actualClass = classOrClassName;
            }
            if (!actualClass) {
                throw new fl.Error("The parameter classOrClassName must be a valid Class " + "instance or fully qualified class name.");
            }
            return fl.is(actualClass, superclass);
        };
        p.getClass = function (value) {
            if (fl.isClass(value)) {
                return value;
            }
            return value.constructor;
        };
        p.getFQCN = function (value, replaceColons) {
            if (replaceColons === void 0) { replaceColons = false; }
            return fl.getClassName(value, replaceColons);
        };
        return Reflector;
    })(egret.HashObject);
    fl.Reflector = Reflector;
    egret.registerClass(Reflector,"fl.Reflector",["fl.IReflector"]);
})(fl || (fl = {}));

var fl;
(function (fl) {
    var InjectionPoint = (function (_super) {
        __extends(InjectionPoint, _super);
        function InjectionPoint(injector) {
            _super.call(this);
        }
        var d = __define,c=InjectionPoint;p=c.prototype;
        p.applyInjection = function (target, injector) {
            return target;
        };
        return InjectionPoint;
    })(egret.HashObject);
    fl.InjectionPoint = InjectionPoint;
    egret.registerClass(InjectionPoint,"fl.InjectionPoint");
})(fl || (fl = {}));

/// <reference path="InjectionPoint" />
var fl;
(function (fl) {
    var NoParamsConstructorInjectionPoint = (function (_super) {
        __extends(NoParamsConstructorInjectionPoint, _super);
        function NoParamsConstructorInjectionPoint() {
            _super.call(this, null);
        }
        var d = __define,c=NoParamsConstructorInjectionPoint;p=c.prototype;
        p.applyInjection = function (target, injector) {
            return new target();
        };
        return NoParamsConstructorInjectionPoint;
    })(fl.InjectionPoint);
    fl.NoParamsConstructorInjectionPoint = NoParamsConstructorInjectionPoint;
    egret.registerClass(NoParamsConstructorInjectionPoint,"fl.NoParamsConstructorInjectionPoint");
})(fl || (fl = {}));

var fl;
(function (fl) {
    var InjectionResult = (function (_super) {
        __extends(InjectionResult, _super);
        function InjectionResult() {
            _super.call(this);
        }
        var d = __define,c=InjectionResult;p=c.prototype;
        p.getResponse = function (injector) {
            return null;
        };
        return InjectionResult;
    })(egret.HashObject);
    fl.InjectionResult = InjectionResult;
    egret.registerClass(InjectionResult,"fl.InjectionResult");
})(fl || (fl = {}));

/// <reference path="InjectionResult" />
var fl;
(function (fl) {
    var InjectClassResult = (function (_super) {
        __extends(InjectClassResult, _super);
        function InjectClassResult(responseType) {
            _super.call(this);
            this.m_responseType = responseType;
        }
        var d = __define,c=InjectClassResult;p=c.prototype;
        p.getResponse = function (injector) {
            return injector.instantiate(this.m_responseType);
        };
        return InjectClassResult;
    })(fl.InjectionResult);
    fl.InjectClassResult = InjectClassResult;
    egret.registerClass(InjectClassResult,"fl.InjectClassResult");
})(fl || (fl = {}));

/// <reference path="InjectionResult" />
var fl;
(function (fl) {
    var InjectOtherRuleResult = (function (_super) {
        __extends(InjectOtherRuleResult, _super);
        function InjectOtherRuleResult(rule) {
            _super.call(this);
            this.m_rule = rule;
        }
        var d = __define,c=InjectOtherRuleResult;p=c.prototype;
        p.getResponse = function (injector) {
            return this.m_rule.getResponse(injector);
        };
        return InjectOtherRuleResult;
    })(fl.InjectionResult);
    fl.InjectOtherRuleResult = InjectOtherRuleResult;
    egret.registerClass(InjectOtherRuleResult,"fl.InjectOtherRuleResult");
})(fl || (fl = {}));

/// <reference path="InjectionResult" />
var fl;
(function (fl) {
    var InjectSingletonResult = (function (_super) {
        __extends(InjectSingletonResult, _super);
        function InjectSingletonResult(responseType) {
            _super.call(this);
            this.m_responseType = responseType;
        }
        var d = __define,c=InjectSingletonResult;p=c.prototype;
        p.getResponse = function (injector) {
            return this.m_response = this.m_response || this.createResponse(injector);
        };
        p.createResponse = function (injector) {
            return injector.instantiate(this.m_responseType);
        };
        return InjectSingletonResult;
    })(fl.InjectionResult);
    fl.InjectSingletonResult = InjectSingletonResult;
    egret.registerClass(InjectSingletonResult,"fl.InjectSingletonResult");
})(fl || (fl = {}));

/// <reference path="InjectionResult" />
var fl;
(function (fl) {
    var InjectValueResult = (function (_super) {
        __extends(InjectValueResult, _super);
        function InjectValueResult(value) {
            _super.call(this);
            this.m_value = value;
        }
        var d = __define,c=InjectValueResult;p=c.prototype;
        p.getResponse = function (injector) {
            return this.m_value;
        };
        return InjectValueResult;
    })(fl.InjectionResult);
    fl.InjectValueResult = InjectValueResult;
    egret.registerClass(InjectValueResult,"fl.InjectValueResult");
})(fl || (fl = {}));

var fl;
(function (fl) {
    var CommandMap = (function (_super) {
        __extends(CommandMap, _super);
        function CommandMap(context) {
            _super.call(this);
            this.context = context;
            this.eventDispatcher = context.eventDispatcher;
            this.injector = context.createChildInjector();
            this.reflector = context.reflector;
            this.eventTypeMap = new fl.Dictionary(false);
            this.verifiedCommandClasses = new fl.Dictionary(false);
            this.detainedCommands = new fl.Dictionary(false);
        }
        var d = __define,c=CommandMap;p=c.prototype;
        p.mapEvent = function (eventType, commandClass, eventClass, oneshot) {
            if (eventClass === void 0) { eventClass = null; }
            if (oneshot === void 0) { oneshot = false; }
            var _self__ = this;
            this.verifyCommandClass(commandClass);
            eventClass = eventClass || egret.Event;
            var eventClassMap = this.eventTypeMap.getItem(eventType, new fl.Dictionary(false));
            var callbacksByCommandClass = eventClassMap.getItem(eventClass, new fl.Dictionary(false));
            if (callbacksByCommandClass.getItem(commandClass)) {
                throw new fl.ContextError(fl.ContextError.E_COMMANDMAP_OVR + ' - eventType (' + eventType + ') and Command (' + commandClass + ')');
            }
            var callback = function (event) {
                _self__.routeEventToCommand(event, commandClass, oneshot, eventClass);
            };
            this.eventDispatcher.addEventListener(eventType, callback, null, false, 0);
            callbacksByCommandClass.setItem(commandClass, callback);
        };
        p.unmapEvent = function (eventType, commandClass, eventClass) {
            if (eventClass === void 0) { eventClass = null; }
            var eventClassMap = this.eventTypeMap.getItem(eventType);
            if (eventClassMap == null)
                return;
            var callbacksByCommandClass = eventClassMap.getItem(eventClass || egret.Event);
            if (callbacksByCommandClass == null)
                return;
            var callback = callbacksByCommandClass.getItem(commandClass);
            if (callback == null)
                return;
            this.eventDispatcher.removeEventListener(eventType, callback, null, false);
            callbacksByCommandClass.delItem(commandClass);
        };
        p.unmapEvents = function () {
            for (var forinvar__ in this.eventTypeMap.map) {
                var map = this.eventTypeMap.map[forinvar__];
                var eventType = map[0];
                var eventClassMap = map[1];
                for (var callbacksByCommandClass_key_a in eventClassMap.map) {
                    var callbacksByCommandClass = eventClassMap.map[callbacksByCommandClass_key_a][1];
                    for (var callback_key_a in callbacksByCommandClass.map) {
                        var callback = callbacksByCommandClass.map[callback_key_a][1];
                        this.eventDispatcher.removeEventListener(eventType, callback, null, false);
                    }
                }
            }
            this.eventTypeMap = new fl.Dictionary(false);
        };
        p.hasEventCommand = function (eventType, commandClass, eventClass) {
            if (eventClass === void 0) { eventClass = null; }
            var eventClassMap = this.eventTypeMap.getItem(eventType);
            if (eventClassMap == null)
                return false;
            var callbacksByCommandClass = eventClassMap.getItem(eventClass || egret.Event);
            if (callbacksByCommandClass == null)
                return false;
            return callbacksByCommandClass.getItem(commandClass) != null;
        };
        p.execute = function (commandClass, payload, payloadClass, named) {
            if (payload === void 0) { payload = null; }
            if (payloadClass === void 0) { payloadClass = null; }
            if (named === void 0) { named = ''; }
            this.verifyCommandClass(commandClass);
            if (payload != null || payloadClass != null) {
                payloadClass = payloadClass || this.reflector.getClass(payload);
                if (fl.is(payload, egret.Event) && payloadClass != egret.Event)
                    this.injector.mapValue(egret.Event, payload);
                this.injector.mapValue(payloadClass, payload, named);
            }
            var command = this.injector.instantiate(commandClass);
            if (payload !== null || payloadClass != null) {
                if (fl.is(payload, egret.Event) && payloadClass != egret.Event)
                    this.injector.unmap(egret.Event);
                this.injector.unmap(payloadClass, named);
            }
            command.execute();
        };
        p.detain = function (command) {
            this.detainedCommands.setItem(command, true);
        };
        p.release = function (command) {
            this.detainedCommands.delItem(command);
        };
        p.verifyCommandClass = function (commandClass) {
        };
        p.routeEventToCommand = function (event, commandClass, oneshot, originalEventClass) {
            if (!(fl.is(event, originalEventClass)))
                return false;
            this.execute(commandClass, event);
            if (oneshot)
                this.unmapEvent(event.type, commandClass, originalEventClass);
            return true;
        };
        return CommandMap;
    })(egret.HashObject);
    fl.CommandMap = CommandMap;
    egret.registerClass(CommandMap,"fl.CommandMap",["fl.ICommandMap"]);
})(fl || (fl = {}));

var fl;
(function (fl) {
    var ContextBase = (function (_super) {
        __extends(ContextBase, _super);
        function ContextBase() {
            _super.call(this);
            this._eventDispatcher = this.createEventDispatcher();
        }
        var d = __define,c=ContextBase;p=c.prototype;
        d(p, "contextView"
            ,function () {
                return this._contextView;
            }
            ,function (value) {
                this._contextView = value;
            }
        );
        d(p, "injector"
            ,function () {
                return this._injector = this._injector || this.createInjector();
            }
            ,function (value) {
                this._injector = value;
            }
        );
        p.createInjector = function () {
            return null;
        };
        p.createChildInjector = function () {
            return this.injector.createChildInjector();
        };
        d(p, "reflector"
            ,function () {
                return this._reflector = this._reflector || this.createReflector();
            }
            ,function (value) {
                this._reflector = value;
            }
        );
        p.createReflector = function () {
            return null;
        };
        d(p, "commandMap"
            ,function () {
                return this._commandMap = this._commandMap || new fl.CommandMap(this);
            }
            ,function (value) {
                this._commandMap = value;
            }
        );
        d(p, "mediatorMap"
            ,function () {
                return this._mediatorMap = this._mediatorMap || new fl.MediatorMap(this);
            }
            ,function (value) {
                this._mediatorMap = value;
            }
        );
        d(p, "viewMap"
            ,function () {
                return this._viewMap = this._viewMap || new fl.ViewMap(this);
            }
            ,function (value) {
                this._viewMap = value;
            }
        );
        p.createEventDispatcher = function () {
            return new egret.EventDispatcher(this);
        };
        d(p, "eventDispatcher"
            ,function () {
                return this._eventDispatcher;
            }
            ,function (value) {
                this._eventDispatcher = value;
            }
        );
        p.once = function (type, listener, thisObject, useCapture, priority) {
            if (useCapture === void 0) { useCapture = false; }
            if (priority === void 0) { priority = 0; }
            this.eventDispatcher.once(type, listener, thisObject, useCapture, priority);
        };
        p.addEventListener = function (type, listener, thisObject, useCapture, priority) {
            if (useCapture === void 0) { useCapture = false; }
            if (priority === void 0) { priority = 0; }
            this.eventDispatcher.addEventListener(type, listener, thisObject, useCapture, priority);
        };
        p.dispatchEvent = function (event) {
            if (this.eventDispatcher.hasEventListener(event.type))
                return this.eventDispatcher.dispatchEvent(event);
            return false;
        };
        p.hasEventListener = function (type) {
            return this.eventDispatcher.hasEventListener(type);
        };
        p.removeEventListener = function (type, listener, thisObject, useCapture) {
            if (useCapture === void 0) { useCapture = false; }
            this.eventDispatcher.removeEventListener(type, listener, thisObject, useCapture);
        };
        p.willTrigger = function (type) {
            return this.eventDispatcher.willTrigger(type);
        };
        return ContextBase;
    })(egret.HashObject);
    fl.ContextBase = ContextBase;
    egret.registerClass(ContextBase,"fl.ContextBase",["fl.IContext","egret.IEventDispatcher"]);
})(fl || (fl = {}));

var fl;
(function (fl) {
    var ContextError = (function () {
        function ContextError(message, id) {
            if (message === void 0) { message = ""; }
            if (id === void 0) { id = 0; }
            this.message = message;
            this.name = String(id);
        }
        var d = __define,c=ContextError;p=c.prototype;
        return ContextError;
    })();
    fl.ContextError = ContextError;
    egret.registerClass(ContextError,"fl.ContextError");
})(fl || (fl = {}));
fl.ContextError.E_COMMANDMAP_NOIMPL = 'Command Class does not implement an execute() method';
fl.ContextError.E_COMMANDMAP_OVR = 'Cannot overwrite map';
fl.ContextError.E_MEDIATORMAP_NOIMPL = 'Mediator Class does not implement IMediator';
fl.ContextError.E_MEDIATORMAP_OVR = 'Mediator Class has already been mapped to a View Class in this context';
fl.ContextError.E_EVENTMAP_NOSNOOPING = 'Listening to the context eventDispatcher is not enabled for this EventMap';
fl.ContextError.E_CONTEXT_INJECTOR = 'The ContextBase does not specify a concrete IInjector. Please override the injector getter in your concrete or abstract Context.';
fl.ContextError.E_CONTEXT_REFLECTOR = 'The ContextBase does not specify a concrete IReflector. Please override the reflector getter in your concrete or abstract Context.';
fl.ContextError.E_CONTEXT_VIEW_OVR = 'Context contextView must only be set once';

var fl;
(function (fl) {
    var ContextEvent = (function (_super) {
        __extends(ContextEvent, _super);
        function ContextEvent(type, body) {
            if (body === void 0) { body = null; }
            _super.call(this, type);
            this._body = body;
        }
        var d = __define,c=ContextEvent;p=c.prototype;
        d(p, "body"
            ,function () {
                return this._body;
            }
            ,function (value) {
                this.body = value;
            }
        );
        p.clone = function () {
            return new fl.ContextEvent(this.type, this.body);
        };
        return ContextEvent;
    })(egret.Event);
    fl.ContextEvent = ContextEvent;
    egret.registerClass(ContextEvent,"fl.ContextEvent");
})(fl || (fl = {}));
fl.ContextEvent.STARTUP = 'startup';
fl.ContextEvent.STARTUP_COMPLETE = 'startupComplete';
fl.ContextEvent.SHUTDOWN = 'shutdown';
fl.ContextEvent.SHUTDOWN_COMPLETE = 'shutdownComplete';

var fl;
(function (fl) {
    var EventMap = (function (_super) {
        __extends(EventMap, _super);
        function EventMap(eventDispatcher) {
            _super.call(this);
            this._dispatcherListeningEnabled = true;
            this.listeners = new Array();
            this.eventDispatcher = eventDispatcher;
        }
        var d = __define,c=EventMap;p=c.prototype;
        d(p, "dispatcherListeningEnabled"
            ,function () {
                return this._dispatcherListeningEnabled;
            }
            ,function (value) {
                this._dispatcherListeningEnabled = value;
            }
        );
        p.mapListener = function (dispatcher, type, listener, thisObject, eventClass, useCapture, priority) {
            if (eventClass === void 0) { eventClass = null; }
            if (useCapture === void 0) { useCapture = false; }
            if (priority === void 0) { priority = 0; }
            var _self__ = this;
            if (this.dispatcherListeningEnabled == false && dispatcher == this.eventDispatcher) {
                throw new fl.ContextError(fl.ContextError.E_EVENTMAP_NOSNOOPING).message;
            }
            eventClass = eventClass || egret.Event;
            var params;
            var i = this.listeners.length;
            while (i--) {
                params = this.listeners[i];
                if (params["dispatcher"] == dispatcher && params["type"] == type && params["listener"] == listener && params["thisObject"] == thisObject && params["useCapture"] == useCapture && params["eventClass"] == eventClass) {
                    return;
                }
            }
            var callback = function (event) {
                _self__.routeEventToListener(event, listener, thisObject, eventClass);
            };
            params = { dispatcher: dispatcher, type: type, listener: listener, thisObject: thisObject, eventClass: eventClass, callback: callback, useCapture: useCapture };
            this.listeners.push(params);
            dispatcher.addEventListener(type, callback, thisObject, useCapture, priority);
        };
        p.unmapListener = function (dispatcher, type, listener, thisObject, eventClass, useCapture) {
            if (eventClass === void 0) { eventClass = null; }
            if (useCapture === void 0) { useCapture = false; }
            eventClass = eventClass || egret.Event;
            var params;
            var i = this.listeners.length;
            while (i--) {
                params = this.listeners[i];
                if (params["dispatcher"] == dispatcher && params["type"] == type && params["listener"] == listener && params["thisObject"] == thisObject && params["useCapture"] == useCapture && params["eventClass"] == eventClass) {
                    dispatcher.removeEventListener(type, params["callback"], params["thisObject"], useCapture);
                    this.listeners.splice(i, 1);
                    return;
                }
            }
        };
        p.unmapListeners = function () {
            var params;
            var dispatcher;
            while (params = this.listeners.pop()) {
                dispatcher = params["dispatcher"];
                dispatcher.removeEventListener(params["type"], params["callback"], params["thisObject"], params["useCapture"]);
            }
        };
        p.routeEventToListener = function (event, listener, thisObject, originalEventClass) {
            if (fl.is(event, originalEventClass)) {
                listener.call(thisObject, event);
            }
        };
        return EventMap;
    })(egret.HashObject);
    fl.EventMap = EventMap;
    egret.registerClass(EventMap,"fl.EventMap",["fl.IEventMap"]);
})(fl || (fl = {}));

var fl;
(function (fl) {
    var MediatorBase = (function (_super) {
        __extends(MediatorBase, _super);
        function MediatorBase() {
            _super.call(this);
            this.removed = false;
        }
        var d = __define,c=MediatorBase;p=c.prototype;
        d(p, "context"
            ,function () {
                return this._context;
            }
            ,function (value) {
                this._context = value;
                this.updateContext();
            }
        );
        p.updateContext = function () {
        };
        p.preRegister = function () {
            this.removed = false;
            if (fl.is(this.viewComponent, fl.MediatorBase.UIComponentClass) && !fl.isComponentInited(this.viewComponent)) {
                (this.viewComponent).addEventListener("creationComplete", this.onCreationComplete, this, false, 0);
            }
            else {
                this.onRegister();
            }
        };
        p.onRegister = function () {
        };
        p.preRemove = function () {
            this.removed = true;
            this.onRemove();
        };
        p.onRemove = function () {
        };
        p.getViewComponent = function () {
            return this.viewComponent;
        };
        p.setViewComponent = function (viewComponent) {
            this.viewComponent = viewComponent;
        };
        p.onCreationComplete = function (e) {
            (e.target).removeEventListener('creationComplete', this.onCreationComplete, this, false);
            if (!this.removed)
                this.onRegister();
        };
        MediatorBase.UIComponentClass = "eui.UIComponent";
        return MediatorBase;
    })(egret.HashObject);
    fl.MediatorBase = MediatorBase;
    egret.registerClass(MediatorBase,"fl.MediatorBase",["fl.IMediator"]);
})(fl || (fl = {}));

var fl;
(function (fl) {
    var ViewMapBase = (function (_super) {
        __extends(ViewMapBase, _super);
        function ViewMapBase(context) {
            _super.call(this);
            this._enabled = true;
            this.useCapture = false;
            this.viewListenerCount = 0;
            this.context = context;
            this.injector = context.injector;
            this.useCapture = true;
            this.contextView = context.contextView;
        }
        var d = __define,c=ViewMapBase;p=c.prototype;
        d(p, "contextView"
            ,function () {
                return this._contextView;
            }
            ,function (value) {
                if (value != this._contextView) {
                    this.removeListeners();
                    this._contextView = value;
                    if (this.viewListenerCount > 0)
                        this.addListeners();
                }
            }
        );
        d(p, "enabled"
            ,function () {
                return this._enabled;
            }
            ,function (value) {
                if (value != this._enabled) {
                    this.removeListeners();
                    this._enabled = value;
                    if (this.viewListenerCount > 0)
                        this.addListeners();
                }
            }
        );
        p.addListeners = function () {
        };
        p.removeListeners = function () {
        };
        p.onViewAdded = function (e) {
        };
        return ViewMapBase;
    })(egret.HashObject);
    fl.ViewMapBase = ViewMapBase;
    egret.registerClass(ViewMapBase,"fl.ViewMapBase");
})(fl || (fl = {}));

/// <reference path="ViewMapBase" />
var fl;
(function (fl) {
    var MediatorMap = (function (_super) {
        __extends(MediatorMap, _super);
        function MediatorMap(context) {
            _super.call(this, context);
            this.hasMediatorsMarkedForRemoval = false;
            this.reflector = context.reflector;
            this.mediatorByView = new fl.Dictionary(true);
            this.mappingConfigByView = new fl.Dictionary(true);
            this.mappingConfigByViewClassName = new fl.Dictionary(false);
            this.mediatorsMarkedForRemoval = new fl.Dictionary(false);
        }
        var d = __define,c=MediatorMap;p=c.prototype;
        p.mapView = function (viewClassOrName, mediatorClass, injectViewAs, autoCreate, autoRemove) {
            if (injectViewAs === void 0) { injectViewAs = null; }
            if (autoCreate === void 0) { autoCreate = true; }
            if (autoRemove === void 0) { autoRemove = true; }
            var viewClassName = this.reflector.getFQCN(viewClassOrName);
            if (this.mappingConfigByViewClassName.getItem(viewClassName) != null)
                throw new fl.ContextError(fl.ContextError.E_MEDIATORMAP_OVR + ' - ' + mediatorClass);
            if (this.reflector.classExtendsOrImplements(mediatorClass, fl.IMediator) == false)
                throw new fl.ContextError(fl.ContextError.E_MEDIATORMAP_NOIMPL + ' - ' + mediatorClass);
            var config = new MappingConfig();
            config.mediatorClass = mediatorClass;
            config.autoCreate = autoCreate;
            config.autoRemove = autoRemove;
            if (injectViewAs) {
                if (fl.isArray(injectViewAs)) {
                    config.typedViewClasses = injectViewAs.concat();
                }
                else if (!fl.isString(injectViewAs)) {
                    config.typedViewClasses = [injectViewAs];
                }
            }
            else if (viewClassOrName && !fl.isString(viewClassOrName)) {
                config.typedViewClasses = [viewClassOrName];
            }
            fl.injectContextView(viewClassName, this.contextView);
            this.mappingConfigByViewClassName.setItem(viewClassName, config);
            if (autoCreate || autoRemove) {
                this.viewListenerCount++;
                if (this.viewListenerCount == 1)
                    this.addListeners();
            }
            if (autoCreate && this.contextView && (viewClassName == fl.getClassName(this.contextView)))
                this.createMediatorUsing(this.contextView, viewClassName, config);
        };
        p.unmapView = function (viewClassOrName) {
            var viewClassName = this.reflector.getFQCN(viewClassOrName);
            fl.uninjectContextView(viewClassName);
            var config = this.mappingConfigByViewClassName.getItem(viewClassName);
            if (config && (config.autoCreate || config.autoRemove)) {
                this.viewListenerCount--;
                if (this.viewListenerCount == 0)
                    this.removeListeners();
            }
            this.mappingConfigByViewClassName.delItem(viewClassName);
        };
        p.createMediator = function (viewComponent) {
            return this.createMediatorUsing(viewComponent);
        };
        p.registerMediator = function (viewComponent, mediator) {
            var mediatorClass = this.reflector.getClass(mediator);
            this.injector.hasMapping(mediatorClass) && this.injector.unmap(mediatorClass);
            this.injector.mapValue(mediatorClass, mediator);
            this.mediatorByView.setItem(viewComponent, mediator);
            this.mappingConfigByView.setItem(viewComponent, this.mappingConfigByViewClassName.getItem(fl.getClassName(viewComponent)));
            mediator.setViewComponent(viewComponent);
            mediator.preRegister();
        };
        p.removeMediator = function (mediator) {
            if (mediator) {
                var viewComponent = mediator.getViewComponent();
                var mediatorClass = this.reflector.getClass(mediator);
                this.mediatorByView.delItem(viewComponent);
                this.mappingConfigByView.delItem(viewComponent);
                mediator.preRemove();
                mediator.setViewComponent(null);
                this.injector.hasMapping(mediatorClass) && this.injector.unmap(mediatorClass);
            }
            return mediator;
        };
        p.removeMediatorByView = function (viewComponent) {
            return this.removeMediator(this.retrieveMediator(viewComponent));
        };
        p.retrieveMediator = function (viewComponent) {
            return this.mediatorByView.getItem(viewComponent);
        };
        p.hasMapping = function (viewClassOrName) {
            var viewClassName = this.reflector.getFQCN(viewClassOrName);
            return (this.mappingConfigByViewClassName.getItem(viewClassName) != null);
        };
        p.hasMediatorForView = function (viewComponent) {
            return this.mediatorByView.getItem(viewComponent) != null;
        };
        p.hasMediator = function (mediator) {
            for (var med_key_a in this.mediatorByView.map) {
                var med = this.mediatorByView.map[med_key_a][1];
                if (med == mediator)
                    return true;
            }
            return false;
        };
        p.addListeners = function () {
            if (this.contextView && this.enabled) {
                this.contextView.addEventListener(egret.Event.ADDED_TO_STAGE, this.onViewAdded, this, this.useCapture, 0);
                this.contextView.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onViewRemoved, this, this.useCapture, 0);
            }
        };
        p.removeListeners = function () {
            if (this.contextView) {
                this.contextView.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onViewAdded, this, this.useCapture);
                this.contextView.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onViewRemoved, this, this.useCapture);
            }
        };
        p.onViewAdded = function (e) {
            if (this.mediatorsMarkedForRemoval.getItem(e.target)) {
                this.mediatorsMarkedForRemoval.delItem(e.target);
                return;
            }
            var viewClassName = fl.getClassName(e.target);
            var config = this.mappingConfigByViewClassName.getItem(viewClassName);
            if (config && config.autoCreate)
                this.createMediatorUsing(e.target, viewClassName, config);
        };
        p.createMediatorUsing = function (viewComponent, viewClassName, config) {
            if (viewClassName === void 0) { viewClassName = ''; }
            if (config === void 0) { config = null; }
            var mediator = this.mediatorByView.getItem(viewComponent);
            if (mediator == null) {
                viewClassName = viewClassName || fl.getClassName(viewComponent);
                config = config || this.mappingConfigByViewClassName.getItem(viewClassName);
                if (config) {
                    for (var claxx_key_a in config.typedViewClasses) {
                        var claxx = config.typedViewClasses[claxx_key_a];
                        this.injector.mapValue(claxx, viewComponent);
                    }
                    mediator = this.injector.instantiate(config.mediatorClass);
                    mediator.context = this.context;
                    for (var clazz_key_a in config.typedViewClasses) {
                        var clazz = config.typedViewClasses[clazz_key_a];
                        this.injector.unmap(clazz);
                    }
                    this.registerMediator(viewComponent, mediator);
                }
            }
            return mediator;
        };
        p.onViewRemoved = function (e) {
            var config = this.mappingConfigByView.getItem(e.target);
            if (config && config.autoRemove) {
                this.mediatorsMarkedForRemoval.setItem(e.target, e.target);
                if (!this.hasMediatorsMarkedForRemoval) {
                    this.hasMediatorsMarkedForRemoval = true;
                    egret.startTick(this.removeMediatorLater, this);
                }
            }
        };
        p.removeMediatorLater = function (value) {
            this.hasMediatorsMarkedForRemoval = false;
            egret.stopTick(this.removeMediatorLater, this);
            for (var view_key_a in this.mediatorsMarkedForRemoval.map) {
                var view = this.mediatorsMarkedForRemoval.map[view_key_a][1];
                if (!view.stage)
                    this.removeMediatorByView(view);
                this.mediatorsMarkedForRemoval.delItem(view);
            }
            this.hasMediatorsMarkedForRemoval = false;
            return true;
        };
        return MediatorMap;
    })(fl.ViewMapBase);
    fl.MediatorMap = MediatorMap;
    egret.registerClass(MediatorMap,"fl.MediatorMap",["fl.IMediatorMap"]);
    var MappingConfig = (function (_super) {
        __extends(MappingConfig, _super);
        function MappingConfig() {
            _super.apply(this, arguments);
            this.autoCreate = false;
            this.autoRemove = false;
        }
        var d = __define,c=MappingConfig;p=c.prototype;
        return MappingConfig;
    })(egret.HashObject);
    fl.MappingConfig = MappingConfig;
    egret.registerClass(MappingConfig,"fl.MappingConfig");
})(fl || (fl = {}));

/// <reference path="ViewMapBase" />
var fl;
(function (fl) {
    var ViewMap = (function (_super) {
        __extends(ViewMap, _super);
        function ViewMap(context) {
            _super.call(this, context);
            this.mappedPackages = new Array();
            this.mappedTypes = new fl.Dictionary(false);
            this.injectedViews = new fl.Dictionary(true);
        }
        var d = __define,c=ViewMap;p=c.prototype;
        p.mapPackage = function (packageName) {
            if (this.mappedPackages.indexOf(packageName) == -1) {
                this.mappedPackages.push(packageName);
                this.viewListenerCount++;
                if (this.viewListenerCount == 1)
                    this.addListeners();
            }
        };
        p.unmapPackage = function (packageName) {
            var index = this.mappedPackages.indexOf(packageName);
            if (index > -1) {
                this.mappedPackages.splice(index, 1);
                this.viewListenerCount--;
                if (this.viewListenerCount == 0)
                    this.removeListeners();
            }
        };
        p.mapType = function (type) {
            if (this.mappedTypes.getItem(type))
                return;
            this.mappedTypes.setItem(type, type);
            this.viewListenerCount++;
            if (this.viewListenerCount == 1)
                this.addListeners();
            if (this.contextView && fl.is(this.contextView, type))
                this.injectInto(this.contextView);
        };
        p.unmapType = function (type) {
            var mapping = this.mappedTypes.getItem(type);
            this.mappedTypes.delItem(type);
            if (mapping) {
                this.viewListenerCount--;
                if (this.viewListenerCount == 0)
                    this.removeListeners();
            }
        };
        p.hasType = function (type) {
            return (this.mappedTypes.getItem(type) != null);
        };
        p.hasPackage = function (packageName) {
            return this.mappedPackages.indexOf(packageName) > -1;
        };
        p.addListeners = function () {
            if (this.contextView && this.enabled)
                this.contextView.addEventListener(egret.Event.ADDED_TO_STAGE, this.onViewAdded, this, this.useCapture, 0);
        };
        p.removeListeners = function () {
            if (this.contextView)
                this.contextView.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onViewAdded, this, this.useCapture);
        };
        p.onViewAdded = function (e) {
            var target = (e.target);
            if (this.injectedViews.getItem(target))
                return;
            for (var type_key_a in this.mappedTypes.map) {
                var type = this.mappedTypes.map[type_key_a][1];
                if (fl.is(target, type)) {
                    this.injectInto(target);
                    return;
                }
            }
            var len = this.mappedPackages.length;
            if (len > 0) {
                var className = fl.getClassName(target);
                for (var i = 0; i < len; i++) {
                    var packageName = this.mappedPackages[i];
                    if (className.indexOf(packageName) == 0) {
                        this.injectInto(target);
                        return;
                    }
                }
            }
        };
        p.injectInto = function (target) {
            this.injector.injectInto(target);
            this.injectedViews.setItem(target, true);
        };
        return ViewMap;
    })(fl.ViewMapBase);
    fl.ViewMap = ViewMap;
    egret.registerClass(ViewMap,"fl.ViewMap",["fl.IViewMap"]);
})(fl || (fl = {}));

var fl;
(function (fl) {
    var Actor = (function (_super) {
        __extends(Actor, _super);
        function Actor() {
            _super.call(this);
        }
        var d = __define,c=Actor;p=c.prototype;
        d(p, "eventDispatcher"
            ,function () {
                return this._eventDispatcher;
            }
            ,function (value) {
                this._eventDispatcher = value;
            }
        );
        d(p, "eventMap"
            ,function () {
                return this._eventMap || (this._eventMap = new fl.EventMap(this.eventDispatcher));
            }
            ,function (value) {
                this._eventMap = value;
            }
        );
        p.dispatch = function (event) {
            if (this.eventDispatcher.hasEventListener(event.type))
                return this.eventDispatcher.dispatchEvent(event);
            return false;
        };
        return Actor;
    })(egret.HashObject);
    fl.Actor = Actor;
    egret.registerClass(Actor,"fl.Actor");
})(fl || (fl = {}));

var fl;
(function (fl) {
    var Command = (function (_super) {
        __extends(Command, _super);
        function Command() {
            _super.call(this);
        }
        var d = __define,c=Command;p=c.prototype;
        p.execute = function () {
        };
        p.dispatch = function (event) {
            if (this.eventDispatcher.hasEventListener(event.type))
                return this.eventDispatcher.dispatchEvent(event);
            return false;
        };
        return Command;
    })(egret.HashObject);
    fl.Command = Command;
    egret.registerClass(Command,"fl.Command");
})(fl || (fl = {}));

var fl;
(function (fl) {
    var Context = (function (_super) {
        __extends(Context, _super);
        function Context(contextView, autoStartup) {
            if (contextView === void 0) { contextView = null; }
            if (autoStartup === void 0) { autoStartup = true; }
            _super.call(this);
            this._autoStartup = false;
            this._autoStartup = autoStartup;
            this.contextView = contextView;
        }
        var d = __define,c=Context;p=c.prototype;
        p.startup = function () {
            this.dispatchEvent(new fl.ContextEvent(fl.ContextEvent.STARTUP_COMPLETE));
        };
        p.shutdown = function () {
            this.dispatchEvent(new fl.ContextEvent(fl.ContextEvent.SHUTDOWN_COMPLETE));
        };
        d(p, "contextView"
            ,function () {
                return this._contextView;
            }
            ,function (value) {
                if (value == this._contextView)
                    return;
                if (this._contextView)
                    throw new fl.ContextError(fl.ContextError.E_CONTEXT_VIEW_OVR);
                this._contextView = value;
                this.mapInjections();
                this.checkAutoStartup();
            }
        );
        p.mapInjections = function () {
            this.injector.mapValue(fl.IReflector, this.reflector);
            this.injector.mapValue(fl.IInjector, this.injector);
            this.injector.mapValue("egret.IEventDispatcher", this.eventDispatcher);
            this.injector.mapValue(egret.DisplayObjectContainer, this.contextView);
            this.injector.mapValue(fl.ICommandMap, this.commandMap);
            this.injector.mapValue(fl.IMediatorMap, this.mediatorMap);
            this.injector.mapValue(fl.IViewMap, this.viewMap);
            this.injector.mapClass(fl.IEventMap, fl.EventMap);
        };
        p.checkAutoStartup = function () {
            if (this._autoStartup && this.contextView) {
                this.contextView.stage ? this.startup() : this.contextView.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this, false, 0);
            }
        };
        p.onAddedToStage = function (e) {
            this.contextView.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
            this.startup();
        };
        p.createInjector = function () {
            var injector = new fl.Injector();
            return injector;
        };
        p.createReflector = function () {
            var reflector = new fl.Reflector();
            return reflector;
        };
        return Context;
    })(fl.ContextBase);
    fl.Context = Context;
    egret.registerClass(Context,"fl.Context",["fl.IContext"]);
})(fl || (fl = {}));

var fl;
(function (fl) {
    var Mediator = (function (_super) {
        __extends(Mediator, _super);
        function Mediator() {
            _super.call(this);
        }
        var d = __define,c=Mediator;p=c.prototype;
        p.updateContext = function () {
            _super.prototype.updateContext.call(this);
            this._eventDispatcher = this.context.eventDispatcher;
        };
        p.preRemove = function () {
            if (this._eventMap)
                this._eventMap.unmapListeners();
            _super.prototype.preRemove.call(this);
        };
        d(p, "eventDispatcher"
            ,function () {
                return this._eventDispatcher;
            }
            ,function (value) {
                this._eventDispatcher = value;
            }
        );
        d(p, "eventMap"
            ,function () {
                return this._eventMap || (this._eventMap = new fl.EventMap(this.eventDispatcher));
            }
            ,function (value) {
                this._eventMap = value;
            }
        );
        p.dispatch = function (event) {
            if (this.eventDispatcher.hasEventListener(event.type))
                return this.eventDispatcher.dispatchEvent(event);
            return false;
        };
        p.addViewListener = function (type, listener, thisObject, eventClass, useCapture, priority) {
            if (eventClass === void 0) { eventClass = null; }
            if (useCapture === void 0) { useCapture = false; }
            if (priority === void 0) { priority = 0; }
            this.eventMap.mapListener(this.viewComponent, type, listener, thisObject, eventClass, useCapture, priority);
        };
        p.removeViewListener = function (type, listener, thisObject, eventClass, useCapture) {
            if (eventClass === void 0) { eventClass = null; }
            if (useCapture === void 0) { useCapture = false; }
            this.eventMap.unmapListener(this.viewComponent, type, listener, thisObject, eventClass, useCapture);
        };
        p.addContextListener = function (type, listener, thisObject, eventClass, useCapture, priority) {
            if (eventClass === void 0) { eventClass = null; }
            if (useCapture === void 0) { useCapture = false; }
            if (priority === void 0) { priority = 0; }
            this.eventMap.mapListener(this.eventDispatcher, type, listener, thisObject, eventClass, useCapture, priority);
        };
        p.removeContextListener = function (type, listener, thisObject, eventClass, useCapture) {
            if (eventClass === void 0) { eventClass = null; }
            if (useCapture === void 0) { useCapture = false; }
            this.eventMap.unmapListener(this.eventDispatcher, type, listener, thisObject, eventClass, useCapture);
        };
        return Mediator;
    })(fl.MediatorBase);
    fl.Mediator = Mediator;
    egret.registerClass(Mediator,"fl.Mediator");
})(fl || (fl = {}));

