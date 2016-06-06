var game;
(function (game) {
    var Protos = (function () {
        function Protos() {
        }
        var d = __define,c=Protos;p=c.prototype;
        Protos.init = function () {
            if (Protos.inited)
                return;
            Protos.inited = true;
            var protoStr = RES.getRes('default.proto');
            Protos.defaultPB = dcodeIO.ProtoBuf.loadProto(protoStr).build("defaultProto");
        };
        Protos.inited = false;
        return Protos;
    })();
    game.Protos = Protos;
    egret.registerClass(Protos,"game.Protos");
})(game || (game = {}));
