const {Sequelize} = require("sequelize");
const { DB_HOST, DB_NAME, DB_USER, DB_PASS, DB_PORT } = require('../config/env');

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'postgres',
    logging: false
});

module.exports = sequelize;