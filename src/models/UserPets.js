const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/sqlDatabase');
const User = require('../models/Users');
const Pet = require('../models/Pet');
const UserPets = sequelize.define('UserPets', {
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    },
    pet_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Pet,
            key: 'id'
        }
    }
});

module.exports = {UserPets, sequelize};
