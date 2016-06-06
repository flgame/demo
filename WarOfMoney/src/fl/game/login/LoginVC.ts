module game {
	export class LoginMediator extends fl.Mediator {
		public onRegister():void {
			super.onRegister();
			
			this.addContextListener(LoginConstants.EVENT_LOGINOK, this.loginOk, this)
		}
		
		private loginOk(e:fl.GlobalEvent):void {
			sceneMgr.createScenes();
		}
	}
	export class LoginView extends ui.BaseStaticComp {
		public constructor() {
			super();
			this.skinName = "skins.LoginSkin";
		}
		
		public nameT:eui.EditableText;
		public passT:eui.EditableText;
		public loginB:eui.Button;
		public createChildren():void {
			super.createChildren();
			
			this.loginB.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onLogin, this);
		}
		
		private onLogin(e:egret.TouchEvent):void {
			var req:defaultProto.MLoginReq = new Protos.defaultPB.MLoginReq();
			req.username = this.nameT.text;
			req.password = this.passT.text;
			LoginAction.getInstance().login(req);
		}
	}
}