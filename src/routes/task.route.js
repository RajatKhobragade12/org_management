const express = require('express');
const router = express.Router();
const { createTask, getAllTask, getTask, deleteTask, updateTask,getTasksGroupedByOrganization } = require("../controllers/task.controller");
const { authentication, authorization } = require("../middleware/auth.middleware");


router.post('/task/:id', authentication, authorization, createTask);
router.get('/task/:id', authentication, getTask);
router.get('/tasks', authentication, getAllTask);
router.put('/task/:id', authentication, authorization, updateTask);
router.delete('/task/:id', authentication, authorization, deleteTask);
// router.post('/group/:userId', authentication, getTasksGroupedByOrganization);
router.post('/group/:userId', getTasksGroupedByOrganization);


module.exports = router;