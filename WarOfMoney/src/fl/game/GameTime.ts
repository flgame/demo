module game {
	export class GameTime extends egret.HashObject {

		public static EVENT_SYNC_SERVER_TIME:string = "EVENT_SYNC_SERVER_TIME";
		public static FRAMERATE_SERVER:number = 60;
		public static timeServerStart:number = 0;
		public static timeServerSync:number = 0;
		public static timeServer:number = 0;
		/** seconds */
		public static get serverTime():number {
			return GameTime.timeServer / 1000;
		}

		public static FRAMERATE_CLIENT:number = 60;
		public static lastTickClient:number = 0;
		public static curTickClient:number = 0;
		public static lastTime:number = 0;
		public static curTime:number = 0;
		public static frameTime:number = 0;
		public static totalFrame:number = 0;
		public static update(t:number):boolean {
			var t:number = egret.getTimer();
			GameTime.lastTime = GameTime.curTime;
			GameTime.curTime = t;
			if(GameTime.lastTime == 0)
				GameTime.lastTime = GameTime.curTime;
			GameTime.frameTime = GameTime.curTime - GameTime.lastTime;
			GameTime.totalFrame++;
			GameTime.lastTickClient = GameTime.curTickClient;
			GameTime.curTickClient = t / 1000 * GameTime.FRAMERATE_CLIENT;
			if(GameTime.lastTickClient == 0)
				GameTime.lastTickClient = GameTime.curTickClient;
			GameTime.timeServer = GameTime.timeServerStart + (t - GameTime.timeServerSync);
			
			return true;
		}

		public static syncServerTick(v:number) {
			GameTime.timeServer = GameTime.timeServerStart = v;
			GameTime.timeServerSync = egret.getTimer();
			fl.eventMgr.dispatchEvent(new fl.GlobalEvent(GameTime.EVENT_SYNC_SERVER_TIME));
		}

		public static traceTime(value:string) {
			console.log("******[GameTime.traceTime] " + value + "*******",GameTime.totalFrame,GameTime.lastTime,GameTime.curTime,egret.getTimer());
		}

		public static _serverOnlineTime:number = 0;
		public static _setOnlineTimeTick:number = 0;
		/** by seconds */
		public static set todayOnlineTime(v:number)
		{
			GameTime._serverOnlineTime = v;
			GameTime._setOnlineTimeTick = egret.getTimer();
		}
		/** by seconds */
		public static get todayOnlineTime():number
		{
			return GameTime._serverOnlineTime + (egret.getTimer() - GameTime._setOnlineTimeTick) / 1000;
		}

	}
}
