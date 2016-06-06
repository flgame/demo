module game {
	export class GameSceneBase extends GameScene {
		public constructor() {
			super();
			this._container = this.createContainer();
		}
		protected createContainer():egret.DisplayObjectContainer {
			return new egret.DisplayObjectContainer();
		}
		protected _stage:egret.Stage;
		public onCreate(prop:any = null) {
			this._stage = prop.stage;
			this._stage.addChildAt(this.container, prop.index);
    	}
		public onDestroy():void {
			this._stage.removeChild(this.container);
    	} 
		
		protected _container:egret.DisplayObjectContainer;
		public get container():egret.DisplayObjectContainer {
			return this._container;
		}
	}
	export class GameSceneMap extends GameSceneBase {
		public constructor() {
			super();
		}
		protected _mapId:string;
		public get mapId():string {
			return this._mapId;
		}
		public set mapId(v:string) {
			if(this._mapId != v) {
				this._mapId = v;
				this.loadMap(this._mapId);
			}
		}
		private loadMap(v:string):void {
			var __self__:GameSceneMap = this;
			var loader:egret.URLLoader = new egret.URLLoader();
			loader.dataFormat = egret.URLLoaderDataFormat.TEXT;
			loader.addEventListener(egret.Event.COMPLETE, function(e:egret.Event):void {
				__self__.mapLoadHandler(loader, v);
			}, this);
			loader.load(new egret.URLRequest(UIRes.getTMX(v)));
		}
		
		public tmxTileMap:tiled.TMXTilemap
		public mapLoadHandler(loader:egret.URLLoader, m:string):void {
			if(m != this.mapId) return;
			
			if(this.tmxTileMap) {
				this.container.removeChild(this.tmxTileMap);
			}
			var data:egret.XML = egret.XML.parse(loader.data);
			var w:number = data.attributes.width * data.attributes.tilewidth;
			var h:number = data.attributes.height * data.attributes.tileheight;
			this.tmxTileMap = new tiled.TMXTilemap(w, h, data, UIRes.getTMX(this.mapId));
            this.tmxTileMap.render();
			this.container.addChild(this.tmxTileMap);
		}
	}
	export class GameSceneElement extends GameSceneBase {
		public constructor() {
			super();
		}
	}
	export class SceneMgr extends egret.HashObject {
		public mapScene:GameSceneMap;
		public elementScene:GameSceneElement;
		public createScenes(stage:egret.Stage = null):void {
			game.showUI([LoginView], ToggleInfo.TOGGLE_TYPE_HIDE);
			
			stage = stage || ui.UIGlobal.stage;
			this.mapScene = <any>objectPool.createObject(GameSceneMap, {stage: stage, index: 0});
			this.elementScene = <any>objectPool.createObject(GameSceneElement, {stage: stage, index: 1});
			
			game.showUI([SceneView], ToggleInfo.TOGGLE_TYPE_SHOW);
			this.enterMap("village");
		}
		
		public enterMap(v:string):boolean {
			this.mapScene.mapId = v;
			return true;
		}
		private static instance:SceneMgr;
		public static getInstance():SceneMgr {
			if (SceneMgr.instance == null) {
				SceneMgr.instance = new SceneMgr();
			}
			return SceneMgr.instance;
		}
	}
	export var sceneMgr:SceneMgr = SceneMgr.getInstance();
}