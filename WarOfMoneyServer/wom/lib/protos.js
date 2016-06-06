var fs = require("fs");
var ProtoBuf = require("protobufjs");

module.exports = function () {
    var protobuf = {};
    var protoStr = fs.readFileSync('proto/default.proto').toString();
    protobuf.defaultPB = ProtoBuf.loadProto(protoStr).build('defaultProto');
    return protobuf;
};