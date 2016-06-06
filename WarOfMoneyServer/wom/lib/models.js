var Sequelize = require('sequelize');

module.exports = function () {
    var sequelize = new Sequelize('wom', null, null, {
        dialect: 'sqlite',
        storage: 'data/wom.sqlite'
    });
    sequelize.define('user', {
        username: { type: Sequelize.STRING },
        password: { type: Sequelize.STRING }
    }, {
        freezeTableName: true // Model tableName will be the same as the model name
    });
    sequelize.authenticate();
    sequelize.sync({
        logging: console.log
        //force: true
    });
    return sequelize;
};