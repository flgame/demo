/**
 * Created by feir on 2015/11/27.
 */
var fl = require("../lib/flgame_nodejs");
var LoginAction = require("./login/LoginAction");
var actions;
module.exports = actions = {};

actions.inited = false;
actions.injectAction = function (actionClass) {
    fl.ActionManager.injectAction(actionClass);
};
actions.uninjectAction = function (actionClass) {
    fl.ActionManager.uninjectAction(actionClass);
};
actions.init = function () {
    if (actions.inited)
        return;
    actions.inited = true;
    //inject actions

    actions.injectAction(LoginAction);
};
