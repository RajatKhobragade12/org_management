const express = require('express');
const app = express();
const session = require('express-session');
require('dotenv').config();

const userRoutes = require('./src/routes/user.route');
const organizationRoutes = require("./src/routes/organization.route");
const taskRoutes = require("./src/routes/task.route");
app.use(express.json());


app.use(session({
    secret: process.env.SECRET,
    resave: false,
    name: 'userId',
    name:'organizationId',
    saveUninitialized: false,
}));

app.use('/tasks',taskRoutes);
app.use('/users', userRoutes);
app.use('/organizations', organizationRoutes)






app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})