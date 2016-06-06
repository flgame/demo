module game {
	export class SceneMediator extends fl.Mediator {
		public onRegister():void {
			super.onRegister();
			
			this.viewComponent.updateData();
		}
	}
	export class SceneView extends ui.BaseStaticComp {
		public constructor() {
			super();
			this.skinName = "skins.SceneSkin";
		}
		
		public nameL:eui.Label;
		
		public updateData(obj?:any):void {
			super.updateData(obj);
			
			this.nameL.text = LoginAction.getInstance().loginRet.username;
		}
	}
}