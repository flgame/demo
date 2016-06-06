module game {
	export class ToggleInfo extends egret.HashObject {
		public static EVENT_TOGGLE_VIEW:string = "EVENT_TOGGLE_VIEW";
		public static TOGGLE_TYPE_TOGGLE:string = "toggle";
		public static TOGGLE_TYPE_SHOW:string = "show";
		public static TOGGLE_TYPE_HIDE:string = "hide";
		
		public viewType:string = "";
		public toggleType:string = ToggleInfo.TOGGLE_TYPE_TOGGLE;
		public updateOtherView:boolean = true;
		public creatorPoint:egret.Point;
		public targetPoint:egret.Point;
		public offsetPoint:egret.Point;
		public data:any;

		public constructor(viewType:any,toggleType:string = "toggle")
		{
			super();
			this.viewType = fl.getClassName(viewType);
			this.toggleType = toggleType;
		}

	}
						
	export class CompManager extends egret.HashObject {

		public static instance_:CompManager;
		public static getInstance():CompManager
		{
			CompManager.instance_ = CompManager.instance_ || new CompManager();
			return CompManager.instance_;
		}

		public gameContext:fl.GameContext;
		private startupFuns:Array<any> = [];
		public startup(context?:fl.GameContext)
		{
			game.GameTime.traceTime("[CompManager.startup start]");
			this.gameContext = context || new fl.GameContext(this.stage);
			this.resizeHandler();
			
			fl.actionMgr.initActions(this.gameContext.injector);
			game.Actions.init();
			game.Modules.init(this.startupFuns);
			this.runStartupFuncs();
		}

		public destory()
		{
		}

		private delta:number = 100;
		public started:boolean = false;
		private runStartupFuncs()
		{
			var tmpT:number = egret.getTimer();
			var tmpF:Function;
			game.GameTime.traceTime("[CompManager.runStartupFuncs] >>");
			while(this.startupFuns.length > 0 && egret.getTimer() - tmpT < this.delta)
			{
				tmpF = this.startupFuns.shift();
				if(null != tmpF)
					tmpF();
			}
			game.GameTime.traceTime("[CompManager.runStartupFuncs] <<");
			if(this.startupFuns.length > 0)
			{
				egret.callLater(this.runStartupFuncs,this);
			}
			else
			{
				game.GameTime.traceTime("[CompManager.startup end]");
				this.started = true;
			}
		}

		public get compLayer():eui.UILayer
		{
			return ui.UIGlobal.compLayer;
		}

		public get popupLayer():eui.UILayer
		{
			return ui.UIGlobal.popupLayer;
		}

		public get topLayer():eui.UILayer
		{
			return ui.UIGlobal.topLayer;
		}

		public get stage():egret.Stage
		{
			return ui.UIGlobal.stage;
		}

		public resizeHandler(env:egret.Event = null)
		{
			var w:number = <any>this.stage.stageWidth;
			var h:number = <any>this.stage.stageHeight;
			if(w > 0 && h > 0)
			{
				var tmpObj:any;
				var i:number = 0;
				for(i = this.popupLayer.numChildren; i > 0; i--)
				{
					tmpObj = this.popupLayer.getChildAt(i - 1);
					if(fl.is(tmpObj, ui.IPopUpComp))
					{
						tmpObj.updatePosition();
					}
				}
				for(i = this.compLayer.numChildren; i > 0; i--)
				{
					tmpObj = this.compLayer.getChildAt(i - 1);
					if(fl.is(tmpObj,ui.IPopUpComp))
					{
						tmpObj.updatePosition();
					}
				}
				for(i = this.topLayer.numChildren; i > 0; i--)
				{
					tmpObj = this.topLayer.getChildAt(i - 1);
					if(fl.is(tmpObj,ui.IPopUpComp))
					{
						tmpObj.updatePosition();
					}
				}
			}
		}

		private _uiInstance:fl.Dictionary = new fl.Dictionary();
		private _uiClazz:fl.Dictionary = new fl.Dictionary();
		public registerView(viewClass:any,viewName:string = null,mediatorClass:any = null,viewIns:any = null,injectViewAs:any = null,autoCreate:boolean = true,autoRemove:boolean = true)
		{
			viewName = viewName || fl.getClassName(viewClass);
			this._uiClazz.setItem(viewName,viewClass);
			if(this.gameContext && mediatorClass)
			{
				this.gameContext.mapView(viewClass,mediatorClass,viewIns,injectViewAs,autoCreate,autoRemove);
			}
		}

		public registerStaticComp(viewIns:any = null,viewClass:any = null,mediatorClass:any = null,injectViewAs:any = null,autoCreate:boolean = true,autoRemove:boolean = true):any
		{
			if(viewIns == null && viewClass)
			{
				viewIns = new viewClass();
			}
			if(viewIns)
			{
				this.addComp(viewIns);
			}
			if(this.gameContext && mediatorClass)
			{
				viewClass = viewClass || viewIns.constructor;
				this.gameContext.mapView(viewClass,mediatorClass,viewIns,injectViewAs,autoCreate,autoRemove);
			}
			return viewIns;
		}

		public registerPopComp(viewIns:any = null,viewClass:any = null,parent:egret.DisplayObjectContainer = null,modal:boolean = false,mediatorClass:any = null,injectViewAs:any = null,autoCreate:boolean = true,autoRemove:boolean = true):any
		{
			if(viewIns == null && viewClass)
			{
				viewIns = new viewClass();
			}
			if(viewIns)
			{
				this.addPop(viewIns,parent,modal);
			}
			if(this.gameContext && mediatorClass)
			{
				viewClass = viewClass || viewIns.constructor;
				this.gameContext.mapView(viewClass,mediatorClass,viewIns,injectViewAs,autoCreate,autoRemove);
			}
			return viewIns;
		}

		private staticUICache_:Array<any> = [];
		public addComp(comp:any):any
		{
			if(comp && this.staticUICache_.indexOf(comp) == -1)
			{
				this.staticUICache_.push(comp);
				if(fl.is(comp,ui.IPopUpComp))
				{
					(<ui.IPopUpComp>comp).showComp(this.compLayer);
				}
				else
				{
					this.compLayer.addChild(comp);
				}
				return comp;
			}
			return null;
		}

		public removeComp(comp:any):any
		{
			var tmpI:number = comp?this.staticUICache_.indexOf(comp):-1;
			if(tmpI >= 0)
			{
				this.staticUICache_.splice(tmpI,1);
				if(fl.is(comp,ui.IPopUpComp))
				{
					(<ui.IPopUpComp>comp).hideComp();
				}
				else
				{
					this.compLayer.removeChild(comp);
				}
				return comp;
			}
			return null;
		}

		public hasComp(comp:any):boolean
		{
			return comp && this.staticUICache_.indexOf(comp) >= 0;
		}

		public getCompByClass(clz:any):any
		{
			var tmpC:any;
			var tmpC_key_a;
			for(tmpC_key_a in this.staticUICache_)
			{
				tmpC = this.staticUICache_[tmpC_key_a];
				if(fl.is(tmpC, clz))
				{
					return tmpC;
				}
			}
			return null;
		}

		private staticPopCache_:Array<any> = [];
		public addPop(comp:any,p:egret.DisplayObjectContainer = null,m:boolean = false):any
		{
			if(comp && this.staticPopCache_.indexOf(comp) == -1)
			{
				this.staticPopCache_.push(comp);
				if(fl.is(comp,ui.IPopUpComp))
				{
					(<ui.IPopUpComp>comp).showComp(this.popupLayer);
				}
				else
				{
					ui.UIGlobal.popup.createPopUp(comp,false,m);
				}
				return comp;
			}
			return null;
		}

		public removePop(comp:any):any
		{
			var tmpI:number = comp?this.staticPopCache_.indexOf(comp):-1;
			if(tmpI >= 0)
			{
				this.staticPopCache_.splice(tmpI,1);
				if(fl.is(comp,ui.IPopUpComp))
				{
					(<ui.IPopUpComp>comp).hideComp();
				}
				else
				{
					ui.UIGlobal.popup.removePopUp(comp);
				}
				return comp;
			}
			return null;
		}

		public hasPop(comp:any):boolean
		{
			return comp && this.staticPopCache_.indexOf(comp) >= 0;
		}

		public getPopByClass(clz:any):any
		{
			var tmpC:any;
			var tmpC_key_a;
			for(tmpC_key_a in this.staticPopCache_)
			{
				tmpC = this.staticPopCache_[tmpC_key_a];
				if(fl.is(tmpC,clz))
				{
					return tmpC;
				}
			}
			return null;
		}

		public setCompsVisibleByClass(clzs:Array<any>,v:boolean)
		{
			var tmpComp:any;
			for(var tmpClz_key_a in clzs)
			{
				var tmpClz:any = clzs[tmpClz_key_a];
				tmpComp = this.getPopByClass(tmpClz);
				tmpComp = tmpComp || this.getCompByClass(tmpClz);
				if(tmpComp)
				{
					tmpComp.visible = v;
				}
			}
		}

		public toggleView(viewInfo:game.ToggleInfo)
		{
			var uiView:ui.IPopUpComp = this.getUIView(viewInfo.viewType,viewInfo.toggleType != ToggleInfo.TOGGLE_TYPE_HIDE);
			if(null == uiView)
				return ;
			uiView.creatorPoint = this.getCreatorPoint(viewInfo);
			if(viewInfo.targetPoint)
				uiView.targetPoint = viewInfo.targetPoint;
			if(viewInfo.offsetPoint)
				uiView.offsetPoint = viewInfo.offsetPoint;
			uiView.viewData = viewInfo.data;
			this.toggleUIView(uiView,viewInfo.toggleType);
			if(viewInfo.updateOtherView)
			{
				this.updateOtherView(viewInfo.viewType);
			}
		}

		public getCreatorPoint(viewInfo:game.ToggleInfo):egret.Point
		{
			var tmpP:egret.Point = viewInfo.creatorPoint;
			return tmpP;
		}

		private updateOtherView(viewType:string)
		{
		}

		private closeExcludes:Array<any> = [];
		public updateViewsByType(curView:string = null,showList:Array<any> = null,closeList:Array<any> = null)
		{
			var tmpInfo:game.ToggleInfo;
			var tmpType:any;
			var tmpShowList:Array<any> = [];
			var tmpShowTypes:Array<any> = [];
			var tmpType_key_a;
			for(tmpType_key_a in showList)
			{
				tmpType = showList[tmpType_key_a];
				if(fl.is(tmpType,game.ToggleInfo))
				{
					tmpInfo = tmpType;
					tmpInfo.toggleType = ToggleInfo.TOGGLE_TYPE_SHOW;
				}
				else
				{
					tmpInfo = new ToggleInfo(tmpType,ToggleInfo.TOGGLE_TYPE_SHOW);
				}
				tmpInfo.updateOtherView = false;
				tmpShowList.push(tmpInfo);
				tmpShowTypes.push(tmpInfo.viewType);
			}
			if(closeList == null)
			{
				closeList = [];
				for(var forinvar__ in this._uiInstance.map)
				{
					tmpType = this._uiInstance.map[forinvar__][0];
					if(this._uiInstance.getItem(tmpType) && this._uiInstance.getItem(tmpType).closeAble)
					{
						closeList.push(tmpType);
					}
				}
			}
			var tmpCloseList:Array<any> = [];
			var tmpType_key_a;
			for(tmpType_key_a in closeList)
			{
				tmpType = closeList[tmpType_key_a];
				if(fl.is(tmpType,game.ToggleInfo))
				{
					tmpInfo = tmpType;
					tmpInfo.toggleType = ToggleInfo.TOGGLE_TYPE_HIDE;
				}
				else
				{
					tmpInfo = new ToggleInfo(tmpType,ToggleInfo.TOGGLE_TYPE_HIDE);
				}
				tmpInfo.updateOtherView = false;
				if(curView != tmpInfo.viewType && this.closeExcludes.indexOf(tmpInfo.viewType) == -1 && tmpShowTypes.indexOf(tmpInfo.viewType) == -1 && this.isViewShow(tmpInfo.viewType))
				{
					tmpCloseList.push(tmpInfo);
				}
			}
			this.updateViewsByInfo(tmpCloseList.concat(tmpShowList));
		}

		private updateViewsByInfo(viewList:Array<any>)
		{
			var tmpInfo:game.ToggleInfo;
			var tmpInfo_key_a;
			for(tmpInfo_key_a in viewList)
			{
				tmpInfo = viewList[tmpInfo_key_a];
				this.toggleView(tmpInfo);
			}
		}

		public isViewShow(viewType:any):boolean
		{
			viewType = fl.getClassName(viewType);
			var tmpComp:ui.IPopUpComp = this._uiInstance.getItem(viewType);
			return tmpComp && tmpComp.isShow;
		}

		public getUIView(viewType:any,toCreate:boolean = true):ui.IPopUpComp
		{
			viewType = fl.getClassName(viewType);
			var tmpComp:ui.IPopUpComp = this._uiInstance.getItem(viewType);
			if(tmpComp == null && toCreate)
			{
				var tmpClazz:any = <any>this._uiClazz.getItem(viewType);
				if(tmpClazz)
				{
					this._uiInstance.setItem(viewType,tmpComp = new tmpClazz());
					tmpComp.viewType = viewType;
				}
				else
				{
					egret.error("[getUIView] unknow ui type: " + viewType);
				}
			}
			return tmpComp;
		}

		public showExcludes:Array<any> = null;
		private _hideList:fl.Dictionary = new fl.Dictionary(true);
		private toggleUIView(uiView:ui.IPopUpComp,toggleType:string = "toggle")
		{
			var _self__:any = this;
			var isShow:boolean = <any>false;
			if(toggleType == ToggleInfo.TOGGLE_TYPE_HIDE)
			{
				uiView.hideComp();
				if(uiView.isLoading)
				{
					this._hideList.setItem(uiView,true);
				}
			}
			else if(toggleType == ToggleInfo.TOGGLE_TYPE_SHOW)
			{
				if(uiView.isPopUp)
				{
					if(this.getTopMostView() != uiView)
						uiView.bringToFront();
				}
				else
				{
					isShow = true;
				}
			}
			else
			{
				if(uiView.isPopUp)
				{
					uiView.hideComp();
					if(uiView.isLoading)
					{
						this._hideList.setItem(uiView,true);
					}
				}
				else
				{
					isShow = true;
				}
			}
			if(isShow)
			{
				if(this.closeExcludes.indexOf(uiView.viewType) != -1)
				{}
				else if(this.showExcludes && this.showExcludes.indexOf(uiView.viewType) == -1)
				{
					return ;
				}
				uiView.showComp();
			}
		}

		public getTopMostView(closeAble:boolean = true):ui.IPopUpComp
		{
			var topComp:ui.IPopUpComp;
			var tmpComp:ui.IPopUpComp;
			var tmpObj:egret.DisplayObject;
			var i:number = 0;
			for(i = this.popupLayer.numChildren; i > 0; i--)
			{
				tmpObj = this.popupLayer.getChildAt(i - 1);
				tmpComp = fl.is(tmpObj,ui.IPopUpComp)?<ui.IPopUpComp>tmpObj:null;
				if(tmpComp && (!closeAble || tmpComp.closeAble) && tmpObj.visible)
				{
					topComp = tmpComp;
					break;
				}
			}
			if(!topComp)
			{
				for(i = this.compLayer.numChildren; i > 0; i--)
				{
					tmpObj = this.compLayer.getChildAt(i - 1);
					tmpComp = fl.is(tmpObj,ui.IPopUpComp)?<ui.IPopUpComp>tmpObj:null;
					if(tmpComp && (!closeAble || tmpComp.closeAble) && tmpObj.visible)
					{
						topComp = tmpComp;
						break;
					}
				}
			}
			return topComp;
		}
	}
	export var compMgr:CompManager = CompManager.getInstance();
}
