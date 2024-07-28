const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require("../config/database");
const { User } = require("../models/user.model");
const {Task} = require("../models/task.model");

const Organization = sequelize.define('organization', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING
    },
    adminId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    userId: {
        type: DataTypes.ARRAY(DataTypes.UUID),
        defaultValue: []
    },
}, { timestamps: true });

Organization.hasMany(Task, { foreignKey: 'organizationId' });
Task.belongsTo(Organization, { foreignKey: 'organizationId' });

sequelize.sync().then(() => {
    console.log('Organization model synchronized successfully')

}).catch((error) => {
    console.log(`Error: Organization model synchronization ${error}`)

});
module.exports = { Organization };