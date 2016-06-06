var game;
(function (game) {
    var GameSceneBase = (function (_super) {
        __extends(GameSceneBase, _super);
        function GameSceneBase() {
            _super.call(this);
            this._container = this.createContainer();
        }
        var d = __define,c=GameSceneBase;p=c.prototype;
        p.createContainer = function () {
            return new egret.DisplayObjectContainer();
        };
        p.onCreate = function (prop) {
            if (prop === void 0) { prop = null; }
            this._stage = prop.stage;
            this._stage.addChildAt(this.container, prop.index);
        };
        p.onDestroy = function () {
            this._stage.removeChild(this.container);
        };
        d(p, "container"
            ,function () {
                return this._container;
            }
        );
        return GameSceneBase;
    })(GameScene);
    game.GameSceneBase = GameSceneBase;
    egret.registerClass(GameSceneBase,"game.GameSceneBase");
    var GameSceneMap = (function (_super) {
        __extends(GameSceneMap, _super);
        function GameSceneMap() {
            _super.call(this);
        }
        var d = __define,c=GameSceneMap;p=c.prototype;
        d(p, "mapId"
            ,function () {
                return this._mapId;
            }
            ,function (v) {
                if (this._mapId != v) {
                    this._mapId = v;
                    this.loadMap(this._mapId);
                }
            }
        );
        p.loadMap = function (v) {
            var __self__ = this;
            var loader = new egret.URLLoader();
            loader.dataFormat = egret.URLLoaderDataFormat.TEXT;
            loader.addEventListener(egret.Event.COMPLETE, function (e) {
                __self__.mapLoadHandler(loader, v);
            }, this);
            loader.load(new egret.URLRequest(game.UIRes.getTMX(v)));
        };
        p.mapLoadHandler = function (loader, m) {
            if (m != this.mapId)
                return;
            if (this.tmxTileMap) {
                this.container.removeChild(this.tmxTileMap);
            }
            var data = egret.XML.parse(loader.data);
            var w = data.attributes.width * data.attributes.tilewidth;
            var h = data.attributes.height * data.attributes.tileheight;
            this.tmxTileMap = new tiled.TMXTilemap(w, h, data, game.UIRes.getTMX(this.mapId));
            this.tmxTileMap.render();
            this.container.addChild(this.tmxTileMap);
        };
        return GameSceneMap;
    })(GameSceneBase);
    game.GameSceneMap = GameSceneMap;
    egret.registerClass(GameSceneMap,"game.GameSceneMap");
    var GameSceneElement = (function (_super) {
        __extends(GameSceneElement, _super);
        function GameSceneElement() {
            _super.call(this);
        }
        var d = __define,c=GameSceneElement;p=c.prototype;
        return GameSceneElement;
    })(GameSceneBase);
    game.GameSceneElement = GameSceneElement;
    egret.registerClass(GameSceneElement,"game.GameSceneElement");
    var SceneMgr = (function (_super) {
        __extends(SceneMgr, _super);
        function SceneMgr() {
            _super.apply(this, arguments);
        }
        var d = __define,c=SceneMgr;p=c.prototype;
        p.createScenes = function (stage) {
            if (stage === void 0) { stage = null; }
            game.showUI([game.LoginView], game.ToggleInfo.TOGGLE_TYPE_HIDE);
            stage = stage || ui.UIGlobal.stage;
            this.mapScene = objectPool.createObject(GameSceneMap, { stage: stage, index: 0 });
            this.elementScene = objectPool.createObject(GameSceneElement, { stage: stage, index: 1 });
            game.showUI([game.SceneView], game.ToggleInfo.TOGGLE_TYPE_SHOW);
            this.enterMap("village");
        };
        p.enterMap = function (v) {
            this.mapScene.mapId = v;
            return true;
        };
        SceneMgr.getInstance = function () {
            if (SceneMgr.instance == null) {
                SceneMgr.instance = new SceneMgr();
            }
            return SceneMgr.instance;
        };
        return SceneMgr;
    })(egret.HashObject);
    game.SceneMgr = SceneMgr;
    egret.registerClass(SceneMgr,"game.SceneMgr");
    game.sceneMgr = SceneMgr.getInstance();
})(game || (game = {}));
