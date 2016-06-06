var skins;
(function (skins) {
	var LoginSkin=(function (_super) {
		__extends(LoginSkin, _super);
		function LoginSkin() {
			_super.call(this);
			
			this.height = 300;
			this.width = 400;
			this.elementsContent = [this.nameT_i(),this._Label1_i(),this.passT_i(),this._Label2_i(),this.loginB_i()];
		}
		var _proto = LoginSkin.prototype;
	
		_proto.nameT_i = function () {
			var t = new eui.EditableText();
			this.nameT = t;
			t.height = 34;
			t.width = 211;
			t.x = 175;
			t.y = 25;
			return t;
		};
		_proto._Label1_i = function () {
			var t = new eui.Label();
			t.text = "username";
			t.x = 20;
			t.y = 27;
			return t;
		};
		_proto.passT_i = function () {
			var t = new eui.EditableText();
			this.passT = t;
			t.displayAsPassword = true;
			t.height = 34;
			t.width = 211;
			t.x = 175;
			t.y = 80;
			return t;
		};
		_proto._Label2_i = function () {
			var t = new eui.Label();
			t.text = "password";
			t.x = 20;
			t.y = 82;
			return t;
		};
		_proto.loginB_i = function () {
			var t = new eui.Button();
			this.loginB = t;
			t.horizontalCenter = 0;
			t.label = "login";
			t.y = 162;
			return t;
		};
		Object.defineProperty(_proto, "skinParts", {
			get: function () {
				return ["nameT","passT","loginB"];
			},
			enumerable: true,
			configurable: true
		});
		return LoginSkin;
	})(eui.Skin);
})(skins || (skins = {}));