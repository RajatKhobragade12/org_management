const { DataTypes } = require('sequelize');
const sequelize = require("../config/database");

const User = sequelize.define('user', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
    },
    role: {
        type: DataTypes.STRING
    },
    organizationId:{
        type: DataTypes.ARRAY(DataTypes.UUID),
        defaultValue: []
    }
},{timestamps:true});

sequelize.sync().then(() => {
    console.log('User model synchronized successfully')

}).catch((error) => {
    console.log(`Error: User model synchronization ${error}`)

});
module.exports = { User };