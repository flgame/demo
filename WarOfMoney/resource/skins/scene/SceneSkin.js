var skins;
(function (skins) {
	var SceneSkin=(function (_super) {
		__extends(SceneSkin, _super);
		function SceneSkin() {
			_super.call(this);
			
			this.height = 300;
			this.width = 400;
			this.elementsContent = [this._Label1_i(),this._Label2_i(),this.nameL_i()];
		}
		var _proto = SceneSkin.prototype;
	
		_proto._Label1_i = function () {
			var t = new eui.Label();
			t.text = "You are welcome ";
			t.x = 74;
			t.y = 149;
			return t;
		};
		_proto._Label2_i = function () {
			var t = new eui.Label();
			t.text = "Hello";
			t.x = 109;
			t.y = 87;
			return t;
		};
		_proto.nameL_i = function () {
			var t = new eui.Label();
			this.nameL = t;
			t.text = "user";
			t.x = 206;
			t.y = 87;
			return t;
		};
		Object.defineProperty(_proto, "skinParts", {
			get: function () {
				return ["nameL"];
			},
			enumerable: true,
			configurable: true
		});
		return SceneSkin;
	})(eui.Skin);
})(skins || (skins = {}));