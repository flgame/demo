module game {
	export class Protos {
		public static inited:boolean = false;
		public static defaultPB:defaultProto.ProtoBufBuilder;
		public static init()
		{
			if(Protos.inited)
				return ;
			Protos.inited = true;
			
			var protoStr:string = RES.getRes('default.proto');
    		Protos.defaultPB = <any>dcodeIO.ProtoBuf.loadProto(protoStr).build("defaultProto");
		}
	}
}