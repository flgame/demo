module game {
	export class Actions extends egret.HashObject {

		public static inited:boolean = false;
		public static init()
		{
			if(Actions.inited)
				return ;
			Actions.inited = true;
			//inject actions
			
			Actions.injectAction(LoginAction);
			Actions.injectAction(SceneAction);
		}

		public static injectAction(actionClass:any)
		{
			fl.actionMgr.injectAction(actionClass);
		}

		public static uninjectAction(actionClass:any)
		{
			fl.actionMgr.uninjectAction(actionClass);
		}

	}
}
