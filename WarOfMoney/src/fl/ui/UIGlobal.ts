module ui {
	export class UIGlobal extends egret.HashObject {

		public static stage:egret.Stage;
		public static compLayer:eui.UILayer;
		public static popupLayer:eui.UILayer;
		public static topLayer:eui.UILayer;
		public static popup:ui.PopUpManager;
		public static init(s:egret.Stage,compL:eui.UILayer = null,popupL:eui.UILayer = null,topL:eui.UILayer = null)
		{
			UIGlobal.stage = s;
			if(null == compL)
			{
				compL = new eui.UILayer();
				compL.name = "comp";
				UIGlobal.stage.addChild(compL);
			}
			UIGlobal.compLayer = compL;
			if(null == popupL)
			{
				popupL = new eui.UILayer();
				popupL.name = "popup";
				UIGlobal.stage.addChild(popupL);
			}
			UIGlobal.popupLayer = popupL;
			UIGlobal.popup = new ui.PopUpManager(popupL);
			
			if(null == topL)
			{
				topL = new eui.UILayer();
				topL.name = "tooltip";
				UIGlobal.stage.addChild(topL);
			}
			UIGlobal.topLayer = topL;
			
			UIGlobal.resizeHandler();
			UIGlobal.stage.addEventListener(egret.Event.RESIZE,UIGlobal.resizeHandler,null);
		}

		public static width:number;
		public static height:number;
		private static resizeHandler(env:egret.Event = null)
		{
			var w:number = UIGlobal.stage.stageWidth;
			var h:number = UIGlobal.stage.stageHeight;
			if(w > 0 && h > 0)
			{
				UIGlobal.width = w;
				UIGlobal.height = h;
				
				UIGlobal.popup.setSize(w, h);
			}
		}
	}
}