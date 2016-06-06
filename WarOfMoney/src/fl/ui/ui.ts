module ui {
	/**
		 * 把child添加到parent中
		 * @param child
		 * @param parent
		 * @return 
		 * 
		 */		
		export function addToParent(child:egret.DisplayObject, parent:egret.DisplayObjectContainer, index:number = -1):egret.DisplayObject
		{
			if(child && parent) {
				var n:number = parent.numChildren;
				if(index >= 0 && index < n) {
					if(child.parent != parent) {
						parent.addChildAt(child, index);
					} else {
						parent.setChildIndex(child, index);
					}
				} else {
					if(child.parent != parent) {
						parent.addChild(child);
					} else if(index >= n && n > 0) {
						parent.setChildIndex(child, n - 1);
					}
				}
			}
			return child;
		}
		/**
		 * 把child从child.parent中移除，如果child.parent存在的话
		 * @param child
		 * @return 
		 * 
		 */		
		export function removeFromParent(child:egret.DisplayObject):egret.DisplayObject
		{
			if(child && child.parent)
				child.parent.removeChild(child);
			return child;
		}
}