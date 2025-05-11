const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../config/sqlDatabase');

const PET = sequelize.define('PET', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    pet_name: {
        type: DataTypes.STRING,
    },
    breed: {
        type: DataTypes.STRING,
    },
    file_name: {
        type: DataTypes.STRING,
    },
    original_name: {
        type: DataTypes.STRING,
    },
    mime_type: {
        type: DataTypes.STRING,
    },
    size: {
        type: DataTypes.INTEGER,
    }
});

// Association function for index loader
PET.associate = (models) => {
    PET.belongsToMany(models.User, { through: 'UserPets', foreignKey: 'pet_id' });
    // PET.hasMany(models.PetImage, {foreignKey: 'pet_id',as: 'images',onDelete: 'CASCADE'});
}

module.exports = {PET, sequelize};

