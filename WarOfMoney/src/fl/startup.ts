module fl {	
	export function startup(stage:egret.Stage):void 
	{
		ui.UIGlobal.init(stage);
		egret.startTick(game.GameTime.update, stage);
        game.Protos.init();
        game.compMgr.startup();
	}
}