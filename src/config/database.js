const { Sequelize } = require('sequelize');
require('dotenv').config();

const database_url = process.env.DATABASE_URL

const sequelize = new Sequelize(database_url, {
    dialect: 'postgres',
    logging: false
})




const connection = async () => {

    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }

}
connection();


module.exports = sequelize;