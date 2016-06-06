declare module fl {
}
/**
 * Created by feir on 2015/11/14.
 */
declare module fl {
    var P_$UIComponent: string;
    /**event: eui.UIEvent.CREATION_COMPLETE = "creationComplete" */
    function isComponentInited(comp: any): boolean;
    var P_$fl$contextView: string;
    function injectContextView(comp: any, contextView: any): void;
    function uninjectContextView(comp: any): void;
    function getContextView(comp: any): any;
    /** hook egret.DisplayObject to dispatch egret.Event.ADDED_TO_STAGE to contextView */
    function hookContextView(comp: any): void;
    function isNumber(value: any): boolean;
    function isString(value: any): boolean;
    function isArray(value: any): boolean;
    function isObject(value: any): boolean;
    function isClass(value: any): boolean;
    function is(value: any, superValue: any): boolean;
    function getClassName(value: any, replaceColons?: boolean): string;
    function isWhitespace(character: string): boolean;
    function substitute(str: string, ...rest: any[]): string;
    var LINE_BREAKS: RegExp;
    function joinLines(value: string): string;
    function toFixed(value: number, p?: number, trimZero?: boolean): string;
    function replaceText(s: string, ft: string, tt: string): string;
    function stringFullMatch(source: string, target: string): boolean;
    var COLOR_TEXT: string;
    function formatHtml(s: string, color?: any, size?: any, bold?: boolean, under?: boolean, italic?: boolean, face?: string): string;
    function getWordWidth(value: string): number;
    function strByteLen(str: string): number;
    function repeatStr(str: string, count: number): string;
    var HTML_TAG: RegExp;
    function complementByChar(str: string, length: number, char: string, ignoreHtml?: boolean): string;
    function adjustBrightness(rgb: number, brite: number): number;
    function adjustBrightness2(rgb: number, brite: number): number;
    function rgbMultiply(rgb1: number, rgb2: number): number;
    function getColorStr(color: number): string;
    function getColorInt(color: string): number;
    function getColor(color: any): number;
}
declare module fl {
    class Error {
        name: string;
        message: string;
        constructor(message?: any, name?: any);
    }
}
/**
 * Created by huitao on 2015/6/25.
 */
declare module fl {
    class Dictionary {
        map: Array<any>;
        constructor(weak?: boolean);
        getItem(key: any, val?: any): any;
        setItem(key: any, val: any): any;
        delItem(key: any): any;
        hasOwnProperty(key: any): boolean;
    }
}
declare module fl {
    interface ICommandMap {
        context: fl.IContext;
        detain(command: any): any;
        release(command: any): any;
        execute(commandClass: any, payload?: any, payloadClass?: any, named?: string): any;
        mapEvent(eventType: string, commandClass: any, eventClass?: any, oneshot?: boolean): any;
        unmapEvent(eventType: string, commandClass: any, eventClass?: any): any;
        unmapEvents(): any;
        hasEventCommand(eventType: string, commandClass: any, eventClass?: any): boolean;
    }
    var ICommandMap: string;
}
declare module fl {
    interface IContext {
        eventDispatcher: egret.IEventDispatcher;
        injector: fl.IInjector;
        reflector: fl.IReflector;
        contextView: egret.DisplayObjectContainer;
        commandMap: fl.ICommandMap;
        mediatorMap: fl.IMediatorMap;
        viewMap: fl.IViewMap;
        createChildInjector(): fl.IInjector;
    }
    var IContext: string;
}
declare module fl {
    interface IContextProvider {
        getContext(): fl.IContext;
    }
    var IContextProvider: string;
}
declare module fl {
    interface IEventMap {
        mapListener(dispatcher: egret.IEventDispatcher, type: string, listener: Function, thisObject: any, eventClass?: any, useCapture?: boolean, priority?: number): any;
        unmapListener(dispatcher: egret.IEventDispatcher, type: string, listener: Function, thisObject: any, eventClass?: any, useCapture?: boolean): any;
        unmapListeners(): any;
    }
    var IEventMap: string;
}
declare module fl {
    interface IInjector {
        mapValue(whenAskedFor: any, useValue: any, named?: string): any;
        mapClass(whenAskedFor: any, instantiateClass: any, named?: string): any;
        mapSingleton(whenAskedFor: any, named?: string): any;
        mapSingletonOf(whenAskedFor: any, useSingletonOf: any, named?: string): any;
        mapRule(whenAskedFor: any, useRule: any, named?: string): any;
        injectInto(target: any): any;
        instantiate(clazz: any): any;
        getInstance(clazz: any, named?: string): any;
        createChildInjector(): IInjector;
        unmap(clazz: any, named?: string): any;
        hasMapping(clazz: any, named?: string): boolean;
    }
    var IInjector: string;
}
declare module fl {
    interface IMediator {
        preRegister(): any;
        onRegister(): any;
        preRemove(): any;
        onRemove(): any;
        getViewComponent(): any;
        setViewComponent(viewComponent: any): any;
        context: fl.IContext;
    }
    var IMediator: string;
}
declare module fl {
    interface IMediatorMap {
        mapView(viewClassOrName: any, mediatorClass: any, injectViewAs?: any, autoCreate?: boolean, autoRemove?: boolean): any;
        unmapView(viewClassOrName: any): any;
        createMediator(viewComponent: any): fl.IMediator;
        registerMediator(viewComponent: any, mediator: fl.IMediator): any;
        removeMediator(mediator: fl.IMediator): fl.IMediator;
        removeMediatorByView(viewComponent: any): fl.IMediator;
        retrieveMediator(viewComponent: any): fl.IMediator;
        hasMapping(viewClassOrName: any): boolean;
        hasMediator(mediator: fl.IMediator): boolean;
        hasMediatorForView(viewComponent: any): boolean;
        context: fl.IContext;
        contextView: egret.DisplayObjectContainer;
        enabled: boolean;
    }
    var IMediatorMap: string;
}
declare module fl {
    interface IReflector {
        classExtendsOrImplements(classOrClassName: any, superclass: any): boolean;
        getClass(value: any): any;
        getFQCN(value: any, replaceColons?: boolean): string;
    }
    var IReflector: string;
}
declare module fl {
    interface IViewMap {
        mapPackage(packageName: string): any;
        unmapPackage(packageName: string): any;
        hasPackage(packageName: string): boolean;
        mapType(type: any): any;
        unmapType(type: any): any;
        hasType(type: any): boolean;
        context: fl.IContext;
        contextView: egret.DisplayObjectContainer;
        enabled: boolean;
    }
    var IViewMap: string;
}
declare module fl {
    class InjectionConfig extends egret.HashObject {
        request: any;
        injectionName: string;
        private m_injector;
        private m_result;
        constructor(request: any, injectionName: string);
        getResponse(injector: fl.Injector): any;
        hasResponse(injector: fl.Injector): boolean;
        hasOwnResponse(): boolean;
        setResult(result: fl.InjectionResult): void;
        setInjector(injector: fl.Injector): void;
    }
}
declare module fl {
    class InjectionType extends egret.HashObject {
        static VALUE: number;
        static CLASS: number;
        static SINGLETON: number;
    }
}
declare module fl {
    class Injector extends egret.HashObject implements fl.IInjector {
        static INJECTION_POINTS_CACHE: fl.Dictionary;
        private m_parentInjector;
        private m_mappings;
        private m_injecteeDescriptions;
        private m_attendedToInjectees;
        constructor();
        mapValue(whenAskedFor: any, useValue: any, named?: string): any;
        mapClass(whenAskedFor: any, instantiateClass: any, named?: string): any;
        mapSingleton(whenAskedFor: any, named?: string): any;
        mapSingletonOf(whenAskedFor: any, useSingletonOf: any, named?: string): any;
        mapRule(whenAskedFor: any, useRule: any, named?: string): any;
        getMapping(whenAskedFor: any, named?: string): InjectionConfig;
        injectInto(target: any): void;
        instantiate(clazz: any): any;
        unmap(clazz: any, named?: string): void;
        hasMapping(clazz: any, named?: string): boolean;
        getInstance(clazz: any, named?: string): any;
        createChildInjector(): fl.Injector;
        setParentInjector(parentInjector: fl.Injector): void;
        getParentInjector(): fl.Injector;
        static purgeInjectionPointsCache(): void;
        getAncestorMapping(whenAskedFor: any, named?: string): InjectionConfig;
        attendedToInjectees: fl.Dictionary;
        private getInjectionPoints(clazz);
        private getConfigurationForRequest(clazz, named, traverseAncestors?);
    }
}
declare module fl {
    class InjectorError extends Error {
        constructor(message?: any, name?: any);
    }
}
declare module fl {
    class Reflector extends egret.HashObject implements fl.IReflector {
        constructor();
        classExtendsOrImplements(classOrClassName: any, superclass: any): boolean;
        getClass(value: any): any;
        getFQCN(value: any, replaceColons?: boolean): string;
    }
}
declare module fl {
    class InjectionPoint extends egret.HashObject {
        constructor(injector: fl.Injector);
        applyInjection(target: any, injector: fl.Injector): any;
    }
}
declare module fl {
    class NoParamsConstructorInjectionPoint extends fl.InjectionPoint {
        constructor();
        applyInjection(target: any, injector: fl.Injector): any;
    }
}
declare module fl {
    class InjectionResult extends egret.HashObject {
        constructor();
        getResponse(injector: fl.Injector): any;
    }
}
declare module fl {
    class InjectClassResult extends fl.InjectionResult {
        private m_responseType;
        constructor(responseType: any);
        getResponse(injector: fl.Injector): any;
    }
}
declare module fl {
    class InjectOtherRuleResult extends fl.InjectionResult {
        private m_rule;
        constructor(rule: fl.InjectionConfig);
        getResponse(injector: fl.Injector): any;
    }
}
declare module fl {
    class InjectSingletonResult extends fl.InjectionResult {
        private m_responseType;
        private m_response;
        constructor(responseType: any);
        getResponse(injector: fl.Injector): any;
        private createResponse(injector);
    }
}
declare module fl {
    class InjectValueResult extends fl.InjectionResult {
        private m_value;
        constructor(value: any);
        getResponse(injector: fl.Injector): any;
    }
}
declare module fl {
    class CommandMap extends egret.HashObject implements fl.ICommandMap {
        protected eventDispatcher: egret.IEventDispatcher;
        protected injector: fl.IInjector;
        protected reflector: fl.IReflector;
        protected eventTypeMap: fl.Dictionary;
        protected verifiedCommandClasses: fl.Dictionary;
        protected detainedCommands: fl.Dictionary;
        context: fl.IContext;
        constructor(context: fl.IContext);
        mapEvent(eventType: string, commandClass: any, eventClass?: any, oneshot?: boolean): void;
        unmapEvent(eventType: string, commandClass: any, eventClass?: any): void;
        unmapEvents(): void;
        hasEventCommand(eventType: string, commandClass: any, eventClass?: any): boolean;
        execute(commandClass: any, payload?: any, payloadClass?: any, named?: string): void;
        detain(command: any): void;
        release(command: any): void;
        protected verifyCommandClass(commandClass: any): void;
        protected routeEventToCommand(event: egret.Event, commandClass: any, oneshot: boolean, originalEventClass: any): boolean;
    }
}
declare module fl {
    class ContextBase extends egret.HashObject implements fl.IContext, egret.IEventDispatcher {
        protected _eventDispatcher: egret.IEventDispatcher;
        protected _injector: fl.IInjector;
        protected _reflector: fl.IReflector;
        protected _contextView: egret.DisplayObjectContainer;
        protected _commandMap: fl.ICommandMap;
        protected _mediatorMap: fl.IMediatorMap;
        protected _viewMap: fl.IViewMap;
        constructor();
        contextView: egret.DisplayObjectContainer;
        injector: fl.IInjector;
        protected createInjector(): fl.IInjector;
        createChildInjector(): fl.IInjector;
        reflector: fl.IReflector;
        protected createReflector(): fl.IReflector;
        commandMap: fl.ICommandMap;
        mediatorMap: fl.IMediatorMap;
        viewMap: fl.IViewMap;
        protected createEventDispatcher(): egret.IEventDispatcher;
        eventDispatcher: egret.IEventDispatcher;
        once(type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number): void;
        addEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number): void;
        dispatchEvent(event: egret.Event): boolean;
        hasEventListener(type: string): boolean;
        removeEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean): void;
        willTrigger(type: string): boolean;
    }
}
declare module fl {
    class ContextError implements Error {
        static E_COMMANDMAP_NOIMPL: string;
        static E_COMMANDMAP_OVR: string;
        static E_MEDIATORMAP_NOIMPL: string;
        static E_MEDIATORMAP_OVR: string;
        static E_EVENTMAP_NOSNOOPING: string;
        static E_CONTEXT_INJECTOR: string;
        static E_CONTEXT_REFLECTOR: string;
        static E_CONTEXT_VIEW_OVR: string;
        message: string;
        name: string;
        constructor(message?: string, id?: number);
    }
}
declare module fl {
    class ContextEvent extends egret.Event {
        static STARTUP: string;
        static STARTUP_COMPLETE: string;
        static SHUTDOWN: string;
        static SHUTDOWN_COMPLETE: string;
        protected _body: any;
        constructor(type: string, body?: any);
        body: any;
        clone(): egret.Event;
    }
}
declare module fl {
    class EventMap extends egret.HashObject implements fl.IEventMap {
        protected eventDispatcher: egret.IEventDispatcher;
        protected _dispatcherListeningEnabled: boolean;
        protected listeners: Array<any>;
        constructor(eventDispatcher: egret.IEventDispatcher);
        dispatcherListeningEnabled: boolean;
        mapListener(dispatcher: egret.IEventDispatcher, type: string, listener: Function, thisObject: any, eventClass?: any, useCapture?: boolean, priority?: number): void;
        unmapListener(dispatcher: egret.IEventDispatcher, type: string, listener: Function, thisObject: any, eventClass?: any, useCapture?: boolean): void;
        unmapListeners(): void;
        protected routeEventToListener(event: egret.Event, listener: Function, thisObject: any, originalEventClass: any): void;
    }
}
declare module fl {
    class MediatorBase extends egret.HashObject implements fl.IMediator {
        static UIComponentClass: string;
        protected viewComponent: any;
        protected removed: boolean;
        protected _context: fl.IContext;
        constructor();
        context: fl.IContext;
        protected updateContext(): void;
        preRegister(): void;
        onRegister(): void;
        preRemove(): void;
        onRemove(): void;
        getViewComponent(): any;
        setViewComponent(viewComponent: any): void;
        protected onCreationComplete(e: egret.Event): void;
    }
}
declare module fl {
    class ViewMapBase extends egret.HashObject {
        protected _enabled: boolean;
        protected _contextView: egret.DisplayObjectContainer;
        protected injector: fl.IInjector;
        protected useCapture: boolean;
        protected viewListenerCount: number;
        context: fl.IContext;
        constructor(context: fl.IContext);
        contextView: egret.DisplayObjectContainer;
        enabled: boolean;
        protected addListeners(): void;
        protected removeListeners(): void;
        protected onViewAdded(e: egret.Event): void;
    }
}
declare module fl {
    class MediatorMap extends fl.ViewMapBase implements fl.IMediatorMap {
        protected mediatorByView: fl.Dictionary;
        protected mappingConfigByView: fl.Dictionary;
        protected mappingConfigByViewClassName: fl.Dictionary;
        protected mediatorsMarkedForRemoval: fl.Dictionary;
        protected hasMediatorsMarkedForRemoval: boolean;
        protected reflector: fl.IReflector;
        constructor(context: fl.IContext);
        mapView(viewClassOrName: any, mediatorClass: any, injectViewAs?: any, autoCreate?: boolean, autoRemove?: boolean): void;
        unmapView(viewClassOrName: any): void;
        createMediator(viewComponent: any): fl.IMediator;
        registerMediator(viewComponent: any, mediator: fl.IMediator): void;
        removeMediator(mediator: fl.IMediator): fl.IMediator;
        removeMediatorByView(viewComponent: any): fl.IMediator;
        retrieveMediator(viewComponent: any): fl.IMediator;
        hasMapping(viewClassOrName: any): boolean;
        hasMediatorForView(viewComponent: any): boolean;
        hasMediator(mediator: fl.IMediator): boolean;
        protected addListeners(): void;
        protected removeListeners(): void;
        protected onViewAdded(e: egret.Event): void;
        protected createMediatorUsing(viewComponent: any, viewClassName?: string, config?: MappingConfig): fl.IMediator;
        protected onViewRemoved(e: egret.Event): void;
        protected removeMediatorLater(value: number): boolean;
    }
    class MappingConfig extends egret.HashObject {
        mediatorClass: any;
        typedViewClasses: Array<any>;
        autoCreate: boolean;
        autoRemove: boolean;
    }
}
declare module fl {
    class ViewMap extends fl.ViewMapBase implements fl.IViewMap {
        protected mappedPackages: Array<any>;
        protected mappedTypes: fl.Dictionary;
        protected injectedViews: fl.Dictionary;
        constructor(context: fl.IContext);
        mapPackage(packageName: string): void;
        unmapPackage(packageName: string): void;
        mapType(type: any): void;
        unmapType(type: any): void;
        hasType(type: any): boolean;
        hasPackage(packageName: string): boolean;
        protected addListeners(): void;
        protected removeListeners(): void;
        protected onViewAdded(e: egret.Event): void;
        protected injectInto(target: egret.DisplayObject): void;
    }
}
declare module fl {
    class Actor extends egret.HashObject {
        protected _eventDispatcher: egret.IEventDispatcher;
        protected _eventMap: fl.IEventMap;
        constructor();
        eventDispatcher: egret.IEventDispatcher;
        protected eventMap: fl.IEventMap;
        protected dispatch(event: egret.Event): boolean;
    }
}
declare module fl {
    class Command extends egret.HashObject {
        context: fl.IContext;
        eventDispatcher: egret.IEventDispatcher;
        constructor();
        execute(): void;
        protected dispatch(event: egret.Event): boolean;
    }
}
declare module fl {
    class Context extends fl.ContextBase implements fl.IContext {
        protected _autoStartup: boolean;
        constructor(contextView?: egret.DisplayObjectContainer, autoStartup?: boolean);
        startup(): void;
        shutdown(): void;
        contextView: egret.DisplayObjectContainer;
        protected mapInjections(): void;
        protected checkAutoStartup(): void;
        protected onAddedToStage(e: egret.Event): void;
        protected createInjector(): fl.IInjector;
        protected createReflector(): fl.IReflector;
    }
}
declare module fl {
    class Mediator extends fl.MediatorBase {
        protected _eventDispatcher: egret.IEventDispatcher;
        protected _eventMap: fl.IEventMap;
        constructor();
        protected updateContext(): void;
        preRemove(): void;
        eventDispatcher: egret.IEventDispatcher;
        protected eventMap: fl.IEventMap;
        protected dispatch(event: egret.Event): boolean;
        protected addViewListener(type: string, listener: Function, thisObject: any, eventClass?: any, useCapture?: boolean, priority?: number): void;
        protected removeViewListener(type: string, listener: Function, thisObject: any, eventClass?: any, useCapture?: boolean): void;
        protected addContextListener(type: string, listener: Function, thisObject: any, eventClass?: any, useCapture?: boolean, priority?: number): void;
        protected removeContextListener(type: string, listener: Function, thisObject: any, eventClass?: any, useCapture?: boolean): void;
    }
}
