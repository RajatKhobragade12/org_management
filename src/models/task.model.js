const { DataTypes } = require('sequelize');
const sequelize = require("../config/database");
const { User } = require("../models/user.model");
const { Organization } = require("../models/organization.model");


const Task = sequelize.define('task',{
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
    },
    description: {
        type: DataTypes.STRING,
    },
    
    description: {
        type: DataTypes.STRING,
    },
    userId:{
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    organizationId:{
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Organization,
            key: 'id'
        }
    }
},{timestamps:true});

sequelize.sync().then(() => {
    console.log('Task model synchronized successfully')

}).catch((error) => {
    console.log(`Error: Task model synchronization ${error}`)

});

module.exports = { Task };
