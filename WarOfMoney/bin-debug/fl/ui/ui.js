var ui;
(function (ui) {
    /**
         * 把child添加到parent中
         * @param child
         * @param parent
         * @return
         *
         */
    function addToParent(child, parent, index) {
        if (index === void 0) { index = -1; }
        if (child && parent) {
            var n = parent.numChildren;
            if (index >= 0 && index < n) {
                if (child.parent != parent) {
                    parent.addChildAt(child, index);
                }
                else {
                    parent.setChildIndex(child, index);
                }
            }
            else {
                if (child.parent != parent) {
                    parent.addChild(child);
                }
                else if (index >= n && n > 0) {
                    parent.setChildIndex(child, n - 1);
                }
            }
        }
        return child;
    }
    ui.addToParent = addToParent;
    /**
     * 把child从child.parent中移除，如果child.parent存在的话
     * @param child
     * @return
     *
     */
    function removeFromParent(child) {
        if (child && child.parent)
            child.parent.removeChild(child);
        return child;
    }
    ui.removeFromParent = removeFromParent;
})(ui || (ui = {}));
