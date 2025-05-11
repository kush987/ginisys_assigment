const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const sequelize = require('../config/sqlDatabase');

const basename = path.basename(__filename);
const db = {};

fs.readdirSync(__dirname)
  .filter(file => file !== basename && file.endsWith('.js'))
  .forEach(file => {
    const modelExports = require(path.join(__dirname, file));
    
    Object.keys(modelExports).forEach(modelName => {
      const model = modelExports[modelName];
      db[model.name] = model;
    });
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
