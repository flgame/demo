module game {
	export class Modules extends egret.HashObject {

		public static inited:boolean = false;
		public static init(startupFuns:Array<any> = null):Array<any>
		{
			if(Modules.inited)
				return startupFuns;
			Modules.inited = true;

			startupFuns = startupFuns || [];
			startupFuns.push(Modules.registerViews);
			//var register:fl.CompManager = fl.compMgr;
			var f:Function;
			f = function ()
			{
				//register static views
				//register.registerStaticComp(null,TopView,TopViewMediator);
			};
			startupFuns.push(f);
			return startupFuns;
		}

		private static registerViews()
		{
			//register dynamical views
			var register:CompManager = compMgr;
			register.registerView(LoginView,null,LoginMediator);
			register.registerView(SceneView,null,SceneMediator);
		}
	}
}
