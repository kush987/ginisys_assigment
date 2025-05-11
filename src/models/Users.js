const  {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../config/sqlDatabase');

const User = sequelize.define('User', {
    id : {
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        validate: {
            len: {
                args: [3, 50], // Minimum 3 characters, maximum 50 characters
                msg: 'Name must be between 3 and 50 characters'
            }
        }
    },
    email: {
        type: DataTypes.STRING,
        unique:true
    },
    contact_no: {
        type: DataTypes.BIGINT,
        validate: {
            isTenDigits(value) {
                if (!/^\d{10}$/.test(value.toString())) {
                    throw new Error('Contact number must be exactly 10 digits');
                }
            }
        }
    },
    password:{
        type: DataTypes.STRING
    }
})

User.associate = (models) => {
    User.belongsToMany(models.PET, { through: 'UserPets', foreignKey: 'user_id' });
};

module.exports = {User, sequelize};