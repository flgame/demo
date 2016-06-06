
var game_file_list = [
    //以下为自动修改，请勿修改
    //----auto game_file_list start----
	"libs/modules/egret/egret.js",
	"libs/modules/egret/egret.native.js",
	"libs/modules/res/res.js",
	"libs/modules/socket/socket.js",
	"libs/modules/tween/tween.js",
	"libs/modules/game/game.js",
	"libs/modules/game/game.native.js",
	"libs/modules/eui/eui.js",
	"libs/modules/protobufjs/protobufjs.js",
	"libs/modules/jsa/jsa.js",
	"libs/modules/robotlegs_egret/robotlegs_egret.js",
	"libs/modules/flgame/flgame.js",
	"libs/modules/tiled/tiled.js",
	"libs/modules/md5/md5.js",
	"libs/modules/greensock/greensock.js",
	"bin-debug/AssetAdapter.js",
	"bin-debug/fl/game/Actions.js",
	"bin-debug/fl/game/CompManager.js",
	"bin-debug/fl/game/framework/GameObject.js",
	"bin-debug/fl/game/framework/GameScene.js",
	"bin-debug/fl/game/framework/ObjectPool.js",
	"bin-debug/fl/game/framework/State.js",
	"bin-debug/fl/game/framework/StateMachine.js",
	"bin-debug/fl/game/GameTime.js",
	"bin-debug/fl/game/login/LoginAction.js",
	"bin-debug/fl/ui/PopUpComp.js",
	"bin-debug/fl/game/login/LoginVC.js",
	"bin-debug/fl/game/Modules.js",
	"bin-debug/fl/game/Protocol.js",
	"bin-debug/fl/game/Protos.js",
	"bin-debug/fl/game/scene/SceneAction.js",
	"bin-debug/fl/game/scene/SceneMgr.js",
	"bin-debug/fl/game/scene/SceneVC.js",
	"bin-debug/fl/game/UIRes.js",
	"bin-debug/fl/game/utils.js",
	"bin-debug/fl/startup.js",
	"bin-debug/fl/ui/PopUpManager.js",
	"bin-debug/fl/ui/ui.js",
	"bin-debug/fl/ui/UIGlobal.js",
	"bin-debug/LoadingUI.js",
	"bin-debug/Main.js",
	"bin-debug/ThemeAdapter.js",
	//----auto game_file_list end----
];

var window = {};

egret_native.setSearchPaths([""]);

egret_native.requireFiles = function () {
    for (var key in game_file_list) {
        var src = game_file_list[key];
        require(src);
    }
};

egret_native.egretInit = function () {
    egret_native.requireFiles();
    egret.TextField.default_fontFamily = "/system/fonts/DroidSansFallback.ttf";
    //egret.dom为空实现
    egret.dom = {};
    egret.dom.drawAsCanvas = function () {
    };
};

egret_native.egretStart = function () {
    var option = {
        //以下为自动修改，请勿修改
        //----auto option start----
		entryClassName: "Main",
		frameRate: 30,
		scaleMode: "showAll",
		contentWidth: 480,
		contentHeight: 800,
		showPaintRect: false,
		showFPS: false,
		fpsStyles: "x:0,y:0,size:30,textColor:0x00c200,bgAlpha:0.9",
		showLog: false,
		logFilter: "",
		maxTouches: 2,
		textureScaleFactor: 1
		//----auto option end----
    };

    egret.native.NativePlayer.option = option;
    egret.runEgret();
    egret_native.Label.createLabel(egret.TextField.default_fontFamily, 20, "", 0);
    egret_native.EGTView.preSetOffScreenBufferEnable(true);
};