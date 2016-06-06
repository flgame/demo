module game {
	export function showUI(arr:Array<any>, showFlag:string = "toggle", data?:any):void {
		if(!arr || arr.length == 0) return;
		var info:ToggleInfo = new ToggleInfo(arr[0], showFlag);
		info.data = arr.slice(1);
		
		compMgr.toggleView(info);
	}
}