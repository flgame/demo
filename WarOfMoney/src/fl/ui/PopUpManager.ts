module ui {
	export class DefaultModalOverlay extends egret.Sprite {
		public constructor()
		{
			super();
			var g:egret.Graphics = this.graphics;
			g.clear();
			g.beginFill(0x0,.5);
			g.drawRect(0,0,100,100);
		}
	}
	export class PopUpData extends egret.HashObject {

		private _popUp:egret.DisplayObject;
		private _modalOverlay:egret.DisplayObject;

		public constructor(popUp:egret.DisplayObject,overlay:egret.DisplayObject = null)
		{
			super();
			this._popUp = popUp;
			this._modalOverlay = overlay;
		}

		public get isModal():boolean
		{
			return this._modalOverlay != null;
		}

		public get popUp():egret.DisplayObject
		{
			return this._popUp;
		}

		public set popUp(value:egret.DisplayObject)
		{
			this._popUp = value;
		}

		public set modalOverlay(modalOverlay:egret.DisplayObject)
		{
			this._modalOverlay = modalOverlay;
		}

		public get modalOverlay():egret.DisplayObject
		{
			return this._modalOverlay;
		}

	}
	export class PopUpManager extends egret.HashObject {

		private _container:egret.DisplayObjectContainer;
		private _ModalOverlay:any;
		private _popUpCallback:Function;
		private _modalPopUpCallback:Function;
		private _width:number = 0;
		private _height:number = 0;
		private _popUps:fl.Dictionary;
		private _numModalPopUps:number = 0;

		public constructor(container:egret.DisplayObjectContainer)
		{
			super();
			if(!container.stage)
				throw new fl.Error("The container must already be added to the display list.");
			this._container = container;
			this._width = this._container.stage.stageWidth;
			this._height = this._container.stage.stageHeight;
			this._popUps = new fl.Dictionary();
		}

		public setSize(width:number,height:number)
		{
			this._width = width;
			this._height = height;
			
			var map:Array<any> = this._popUps.map;
			var popupData:PopUpData;
			for (var i = 0; i < map.length; i++) {
                popupData = map[i][1];
				if(popupData && popupData.modalOverlay) {
					popupData.modalOverlay.width = width;
					popupData.modalOverlay.height = height;
				}
            }
		}

		public set modalOverlay(modalOverlay:any)
		{
			this._ModalOverlay = modalOverlay;
		}

		public get modalOverlay():any{
			return this._ModalOverlay;
		}

		public set popUpCallback(popUpCallback:Function)
		{
			this._popUpCallback = popUpCallback;
		}

		public get popUpCallback():Function{
			return this._popUpCallback;
		}

		public set modalPopUpCallback(modalPopUpCallback:Function)
		{
			this._modalPopUpCallback = modalPopUpCallback;
		}

		public get modalPopUpCallback():Function{
			return this._modalPopUpCallback;
		}

		public createPopUp(displayObject:egret.DisplayObject,centerPopUp:boolean = false,modal:boolean = false)
		{
			if(this._popUps.hasOwnProperty(displayObject))
				return ;
			var overlay:egret.DisplayObject;
			if(modal)
			{
				overlay = this.createModalOverlay();
				this._container.addChild(overlay);
				this._numModalPopUps++;
			}
			this._popUps.setItem(displayObject,new PopUpData(displayObject,overlay));
			this._container.addChild(displayObject);
			if(centerPopUp)
				this.center(displayObject);
			if(this._popUpCallback != null)
				this._popUpCallback();
			if(modal && this._modalPopUpCallback != null)
				this._modalPopUpCallback();
		}

		public hasPopUp(displayObject:egret.DisplayObject = null):boolean
		{
			if(displayObject)
				return this._popUps.hasOwnProperty(displayObject);
			return this._popUps.map.length > 0;
		}

		public hasModalPopUp(displayObject:egret.DisplayObject = null):boolean
		{
			if(displayObject)
			{
				var popUpData:PopUpData = this._popUps.getItem(displayObject);
				if(!popUpData)
					return false;
				return popUpData.isModal;
			}
			return this._numModalPopUps > 0;
		}

		public get numPopUps():number
		{
			return this._popUps.map.length;
		}

		public get numModalPopUps():number
		{
			return this._numModalPopUps;
		}

		public get popUpOnTop():egret.DisplayObject
		{
			if(this._container.numChildren)
				return this._container.getChildAt(this._container.numChildren - 1);
			return null;
		}

		public bringToFront(displayObject:egret.DisplayObject)
		{
			if(!this._popUps.hasOwnProperty(displayObject))
				return ;
			var popUpData:PopUpData = <any>this._popUps.getItem(displayObject);
			if(popUpData.isModal)
			{
				this._container.setChildIndex(popUpData.modalOverlay,this._container.numChildren - 1);
			}
			this._container.setChildIndex(displayObject,this._container.numChildren - 1);
		}

		public center(displayObject:egret.DisplayObject)
		{
			displayObject.x = Math.round((this._width - displayObject.width) / 2);
			displayObject.y = Math.round((this._height - displayObject.height) / 2);
		}

		public removePopUp(displayObject:egret.DisplayObject)
		{
			if(!this._popUps.hasOwnProperty(displayObject))
				return ;
			var popUpData:PopUpData = this._popUps.delItem(displayObject);
			if(popUpData.isModal)
			{
				this._container.removeChild(popUpData.modalOverlay);
				this._numModalPopUps--;
			}
			this._container.removeChild(displayObject);
			if(this._popUpCallback != null)
				this._popUpCallback();
			if(popUpData.isModal && this._modalPopUpCallback != null)
				this._modalPopUpCallback();
		}

		public makeModal(displayObject:egret.DisplayObject)
		{
			if(!this._popUps.hasOwnProperty(displayObject))
				return ;
			var popUpData:PopUpData = this._popUps.getItem(displayObject);
			if(popUpData.isModal)
				return ;
			var overlay:egret.DisplayObject = this.createModalOverlay();
			this._container.addChildAt(overlay,this._container.getChildIndex(displayObject));
			popUpData.modalOverlay = overlay;
			this._numModalPopUps++;
			if(this._modalPopUpCallback != null)
				this._modalPopUpCallback();
		}

		public makeModeless(displayObject:egret.DisplayObject)
		{
			if(!this._popUps.hasOwnProperty(displayObject))
				return ;
			var popUpData:PopUpData = this._popUps.getItem(displayObject);
			if(!popUpData.isModal)
				return ;
			this._container.removeChild(popUpData.modalOverlay);
			popUpData.modalOverlay = null;
			this._numModalPopUps--;
			if(this._modalPopUpCallback != null)
				this._modalPopUpCallback();
		}

		private createModalOverlay():egret.DisplayObject
		{
			var overlay:egret.DisplayObject = this._ModalOverlay != null?new this._ModalOverlay():new DefaultModalOverlay();
			overlay.width = this._width;
			overlay.height = this._height;
			return overlay;
		}

	}
}

