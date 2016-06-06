module game {
	export class LoginConstants {
		public static EVENT_LOGINOK:string = "EVENT_LOGINOK";
	}
	export class LoginAction extends fl.BaseAction {
		private static _instance:LoginAction;
		public static getInstance():LoginAction {
			LoginAction._instance = LoginAction._instance || <any>fl.actionMgr.getActionByClass(LoginAction);
			return LoginAction._instance;
		}
		
		public constructor() {
			super();
			
			this.mapProtocols = [
				Protocol.LOGIN_RET
			];
		}
		
		public loginRet:defaultProto.MLoginRet;
		public process(bytes:dcodeIO.ByteBuffer, protocol:number = 0):void {
			var pack:fl.BasePack = new fl.BasePack(protocol);
			switch(protocol) {
				case Protocol.LOGIN_RET:
					pack.protoModel = Protos.defaultPB.MLoginRet;
					pack.setBytes(bytes);
					this.loginRet = pack.protoValue;
					this.checkLogin();
					break;
			}
		}
		private checkLogin():void {
			if(this.loginRet && this.loginRet.hashcode) {
				this.dispatch(new fl.GlobalEvent(LoginConstants.EVENT_LOGINOK));
			}
		}
		public login(user:defaultProto.MLoginReq):void {
			var pack:fl.BasePack = new fl.BasePack(Protocol.LOGIN_REQ);
			pack.protoValue = user;
			this.sendPack(pack);
		}
	}
}