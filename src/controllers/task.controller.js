const { Op } = require('sequelize');
const { Task } = require("../models/task.model");
const { Organization } = require('../models/organization.model');
const { User } = require('../models/user.model');



async function createTask(req, res) {
    try {
        const { name, description } = req.body;
        const { id } = req.params;
        const userId = req.session.userId;

        if (!name || !description) {
            return res.status(400).send({ message: "Missing fields" })
        }
        const organization = await Organization.findOne({ where: { id: id } });
        if (!organization) {
            return res.status(404).send({ message: 'Organization not found' });
        }
        let existingUser = await User.findOne({ where: { id: userId } });

        if (!existingUser) {
            return res.status(404).send({ message: "Unauthenticated or Session not found, Please login again." })
        }
        if (!existingUser.organizationId.includes(id)) {
            return res.status(403).send({ message: "User doesn't have access to this organization." });

        }
        const newTask = await Task.create({ name: name, description: description, organizationId: id ,userId:userId});
        return res.status(201).send({ message: 'Task created successfully', newTask });
    } catch (error) {
        res.status(500).send({ message: 'Internal server error', error: error.message });
    }

}


async function getTask(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).send({ message: "Missing fields" })
        }
        const task = await Task.findOne({ where: { id: id } });
        if (!task) {
            return res.status(404).send({ message: 'Task not found' });
        }
        return res.status(200).send({ message: "Task fetched successfully", data: task })

    } catch (error) {
        res.status(500).send({ message: 'Internal server error', error: error.message });

    }
}


async function updateTask(req, res) {
    try {
        const { name, description } = req.body;
        const { id } = req.params;

        if (!id) {
            return res.status(400).send({ message: "Missing fields" })
        }
        if (!name && !description) {
            return res.status(400).send({ message: "Missing fields" })
        }

        const task = await Task.findOne({ where: { id: id } });
        if (!task) {
            return res.status(404).send({ message: 'Task not found' });
        }

        if (name) {
            task['name'] = name;
        }
        if (description) {
            task['description'] = description;
        }
        await task.save();
        let updatedTask = await Task.findOne({where:{id:id}})
        return res.status(200).send({ message: "Task updated successfully",data:updatedTask })
    } catch (error) {
        res.status(500).send({ message: 'Internal server error', error: error.message });

    }
}


async function deleteTask(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).send({ message: "Missing fields" })

        }
        const task = await Task.findOne({ where: { id: id } });
        if (!task) {
            return res.status(404).send({ message: 'Task not found' });
        }
        await task.destroy();
        return res.status(200).send({ message: "Task deleted successfully" })

    } catch (error) {
        res.status(500).send({ message: 'Internal server error', error: error.message });

    }
}


async function getAllTask(req, res) {
    try {
        const organizationId = req.session.userId;
        if (!organizationId) {
            return res.status(401).send({ message: "Unauthenticated" })
        }
        const tasks = await Task.findAll({ userId: organizationId })
        return res.status(200).send({ message: "Task fetched successfully", data: tasks })
    } catch (error) {
        res.status(500).send({ message: 'Internal server error', error: error.message });
    }
}


async function getTasksGroupedByOrganization(req, res) {
    try {
        const { userId } = req.params;
        
        const user = await User.findByPk(userId);
        
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        if (!Array.isArray(user.organizationId) || user.organizationId.length === 0) {
            return res.status(404).send({ message: "No organizations found for this user" });
        }
        const organizations = await Organization.findAll({
            where: {
                id: {
                    [Op.in]: user.organizationId
                }
            },
            include: {
                model: Task,
                attributes: ['id', 'name', 'description']
            },
        });
        const result = organizations.map(org => ({
            organizationId: org.id,
            organizationName: org.name,
            tasks: org.tasks || []
        }));

        return res.status(200).send({ message: "Data fetched successfully", data: result });

    } catch (error) {
        res.status(500).send({ message: 'Internal server error', error: error.message });
    }
}

module.exports = {
    createTask,
    getAllTask,
    getTask,
    deleteTask,
    updateTask,
    getTasksGroupedByOrganization
}