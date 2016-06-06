#WarOfMoneyServer

#steps:
1. dir to wom
2. npm install
3. npm install sqlite3 --save
4. node .

#ps:
compile errors, ref https://www.npmjs.com/package/node-gyp

#useage：
1. register protocols by：actions.injectAction(LoginAction);
see wom/game/actions.js
2. same data structure for nodejs and egret:
use protobufjs to make it simple, see wom/proto, you just need to write *.proto and run proto2tsd, you will get *.json and *.d.ts