#WarOfMoney
a simple login panel：
- if the user exist, verify the password and login
- else register the user with the password

#libs:
see libs/modules
egret 3.1.1

#usage:
1. register the ui module by: register.registerView(LoginView,null,LoginMediator);
see fl/game/Modules.ts

2. open or close the ui by:
game.showUI([game.LoginView], game.ToggleInfo.TOGGLE_TYPE_SHOW); or game.showUI([game.LoginView], game.ToggleInfo.TOGGLE_TYPE_HIDE);
see fl/game/utils.ts

3. register protocols by: Actions.injectAction(LoginAction);
see fl/game/Actions.ts

4. to add a new module, you need(mvc):
> actions to process network and data: XXX extends fl.BaseAction<br />     
> view to process the ui: XXX extends ui.BaseStaticComp<br />     
> mediator to process the updates by event： XXX extends fl.Mediator<br />     
see fl/game/login or fl/game/scene

