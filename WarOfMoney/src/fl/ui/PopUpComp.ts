module ui {
	export interface IPopUpComp extends egret.DisplayObject {

		showComp(parent?:egret.DisplayObjectContainer,modal?:boolean);
		hideComp();
		close();
		bringToFront();
		move(x:number,y:number);
		updateData(obj?:any);
		updatePosition(obj?:any);
		updateIndex(obj?:any);
		
		isPopUp:boolean;
		leftPartner:IPopUpComp;
		rightPartner:IPopUpComp;
		creatorPoint:egret.Point;
		offsetPoint:egret.Point;
		targetPoint:egret.Point;
		
		moveEnable:boolean;
		isShow:boolean;
		isHide:boolean;
		closeAble:boolean;
		closeBtn:egret.DisplayObject;
		viewType:string;
		isLoading:boolean;
		viewData:any;
	}
	export var IPopUpComp:string = "ui.IPopUpComp";
	
	export class BaseStaticComp extends eui.Component implements IPopUpComp {
		public constructor()
		{
			super();
		}

		protected popupParent:egret.DisplayObjectContainer;
		public showComp(parent:egret.DisplayObjectContainer = null,modal:boolean = false)
		{
			this.popupParent = parent || UIGlobal.stage;
			ui.addToParent(this,this.popupParent);
			this.doShow();
		}
		
		public get inited():boolean {
			return fl.isComponentInited(this)
		}
		protected doShow()
		{
			if(!this.inited)
			{
				this.addEventListener(eui.UIEvent.CREATION_COMPLETE,this.onCreationComplete,this);
			}
			else
			{
				this.showHandler();
			}
		}

		protected onCreationComplete(env:egret.Event)
		{
			this.removeEventListener(eui.UIEvent.CREATION_COMPLETE,this.onCreationComplete,this);
			if(this.isPopUp)
			{
				this.showHandler();
			}
		}

		protected showHandler()
		{
			this.updatePosition();
			this.resetPosition();
		}

		public hideComp()
		{
			ui.removeFromParent(this);
		}

		public close()
		{
		}
		
		public move(x:number, y:number):void {
			this.x = x;
			this.y = y;
		}
		
		public bringToFront()
		{
		}

		public updateData(obj:any = null)
		{
		}
		
		public updatePosition(obj:any = null)
		{
		}

		public updateIndex(obj:any = null)
		{
		}

		public get isPopUp():boolean
		{
			return this.parent != null;
		}

		private viewType_:string;
		public get viewType():string
		{
			return this.viewType_;
		}

		public set viewType(value:string)
		{
			this.viewType_ = value;
		}

		private viewData_:any;
		public get viewData():any
		{
			return this.viewData_;
		}

		public set viewData(value:any)
		{
			this.viewData_ = value;
		}

		private leftPartner_:IPopUpComp;
		public get leftPartner():IPopUpComp
		{
			return this.leftPartner_;
		}

		public set leftPartner(p:IPopUpComp)
		{
			this.leftPartner_ = p;
		}

		private rightPartner_:IPopUpComp;
		public get rightPartner():IPopUpComp
		{
			return this.rightPartner_;
		}

		public set rightPartner(p:IPopUpComp)
		{
			this.rightPartner_ = p;
		}

		private creatorPoint_:egret.Point;
		public get creatorPoint():egret.Point
		{
			return this.creatorPoint_;
		}

		public set creatorPoint(p:egret.Point)
		{
			this.creatorPoint_ = p;
		}

		private targetPoint_:egret.Point;
		public get targetPoint():egret.Point
		{
			if(this.targetPoint_ == null)
			{
				this.updatePosition();
			}
			return this.targetPoint_;
		}

		public set targetPoint(p:egret.Point)
		{
			this.targetPoint_ = p;
			if(this.isPopUp && this.inited && !this.isPlaying)
			{
				this.resetPosition();
			}
		}

		private offsetPoint_:egret.Point;
		public get offsetPoint():egret.Point
		{
			return this.offsetPoint_;
		}

		public set offsetPoint(p:egret.Point)
		{
			this.offsetPoint_ = p;
			if(this.isPopUp && this.inited && !this.isPlaying)
			{
				this.resetPosition();
			}
		}

		protected resetPosition()
		{
			var tmpX:number = this.x;
			var tmpY:number = this.y;
			if(this.targetPoint)
			{
				tmpX = this.targetPoint.x;
				tmpY = this.targetPoint.y;
			}
			else if(this.popupParent)
			{
				var p:egret.Point = new egret.Point();
				p.x = this.popupParent.width;
				p.y = this.popupParent.height;
				tmpX = (p.x - this.width) / 2;
				if(tmpX < 0)
					tmpX = 0;
				tmpY = (p.y - this.height) / 2;
				if(tmpY < 0)
					tmpY = 0;
				var tmpP:egret.Point = this.popupParent.localToGlobal(tmpX,tmpY);
				tmpX = tmpP.x;
				tmpY = tmpP.y;
			}
			if(this.offsetPoint)
			{
				tmpX += this.offsetPoint.x;
				tmpY += this.offsetPoint.y;
			}
			this.move(tmpX,tmpY);
		}

		public get moveEnable():boolean
		{
			return false;
		}

		public set moveEnable(value:boolean)
		{
		}

		public get isPlaying():boolean
		{
			return false;
		}

		public get isShow():boolean
		{
			return this.parent && this.visible;
		}

		public get isHide():boolean
		{
			return !this.parent || !this.visible;
		}

		public get closeAble():boolean
		{
			return false;
		}

		public get closeBtn():egret.DisplayObject
		{
			return null;
		}

		private isLoading_:boolean = false;
		public get isLoading():boolean
		{
			return this.isLoading_;
		}

		public set isLoading(value:boolean)
		{
			if(this.isLoading_ != value)
			{
				this.isLoading_ = value;
			}
		}

		private title_:string = "";
		public get title():string
		{
			return this.title_;
		}

		public set title(value:string)
		{
			if(this.title_ != value)
			{
				this.title_ = value;
			}
		}

	}
	
	export class BasePopUpComp extends BaseStaticComp {
		public constructor()
		{
			super();
		}

		public showComp(parent:egret.DisplayObjectContainer = null,modal:boolean = false)
		{
			this.popupParent = parent || UIGlobal.stage;
			UIGlobal.popup.createPopUp(this, false, modal);
			this.doShow();
		}

		public hideComp()
		{
			UIGlobal.popup.removePopUp(this);
		}

		public get isPopUp():boolean
		{
			return UIGlobal.popup.hasPopUp(this);
		}

		public bringToFront()
		{
			UIGlobal.popup.bringToFront(this);
		}

	}
}