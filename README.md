# demo
a simple demo for flgame framework


# WarOfMoney: client on egret
ref libs: protobufjs, robotlegs for egret, ...

# WarOfMoneyServer: server on nodejs
ref libs: protobufjs, ws, sequelize, sqlite3, ... 

#flow
[c] is client, [s] is server<br/>
[c]Main.createScene -> [c]fl/game/login/LoginVC.LoginView.onLogin -> <br/>
[s]game/login/LoginAction.process -> [s]game/login/LoginAction.checkLogin -> <br/>
[c]fl/game/login/LoginVC.LoginAction.process -> [c]fl/game/login/LoginVC.LoginAction.checkLogin -><br/> [c]fl/game/login/LoginVC.LoginMediator.loginOk -> ...
