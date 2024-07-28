const { Op } = require('sequelize');
const { Organization } = require('../models/organization.model');
const { User } = require('../models/user.model');


async function createOrganization(req, res) {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).send({ message: "Missing fields" })
        }
        let existingUser = await User.findOne({ where: { id: req.session.userId } });
        if (!existingUser) {
            return res.status(404).send({ message: "User not found" })
        }
        const newOrganization = await Organization.create({ name: name, adminId: req.session.userId });
        const updateOrganizationIds = [...existingUser.organizationId, newOrganization.id];
        await User.update(
            { organizationId: updateOrganizationIds },
            { where: { id: req.session.userId } }
        );
        req.session.organizationId = newOrganization.id;
        return res.status(400).send({ message: "Organization created successfully", data: newOrganization })

    } catch (error) {
        return res.status(500).send({ message: "Internal server error", error: error.message })

    }
};

async function getOrganization(req, res) {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).send({ message: "Missing fields" })

        }
        const organization = await Organization.findOne({ where: { id: id } });
        if (!organization) {
            return res.status(404).send({ message: "Organization not found" })

        }
        return res.status(200).send({ message: "Organization fetched successfully", data: organization })

    } catch (error) {
        return res.status(500).send({ message: "Internal server error", error: error.message })

    }
}


async function updateOrganization(req, res) {
    try {
        const { id } = req.params;
        const { name } = req.body;
        if (!id || !name) {
            return res.status(400).send({ message: "Missing fields" })

        }
        const organization = await Organization.findOne({ where: { id: id } });
        if (!organization) {
            return res.status(404).send({ message: "Organization not found" })

        }
        if (name) {
            organization['name'] = name;
        }
        await organization.save();
        return res.status(200).send({ message: "organization updated successfully" })

    } catch (error) {
        return res.status(500).send({ message: "Internal server error", error: error.message })

    }
};


async function deleteOrganization(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).send({ message: "Missing fields" })

        }
        const organization = await Organization.findOne({ where: { id: id } });
        if (!organization) {
            return res.status(404).send({ message: "Organization not found" })

        }
        const users = await User.findAll({ where: { organizationId: { [Op.contains]: [id] } } });
        const userUpdates = users.map(user => {
            const updatedOrganizationIds = user.organizationId.filter(orgId => orgId !== id);
            return user.update({ organizationId: updatedOrganizationIds });
        });

        await organization.destroy();
        return res.status(200).send({ message: "organization deleted successfully" })


    } catch (error) {

        return res.status(500).send({ message: "Internal server error", error: error.message })
    }
}


async function getAllOrganization(req, res) {
    try {
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).send({ message: "Unauthenticated" })
        }

        const organizations = await Organization.findAll({ userId: userId })
        return res.status(200).send({ message: "organizations fetched successfully", data: organizations })

    } catch (error) {
        return res.status(500).send({ message: "Internal server error", error: error.message })

    }
}


async function accessOrganization(req, res) {
    try {
        const sessionId = req.session.userId;
        const { id } = req.params;
        const { userId } = req.body;
        if (!sessionId) {
            return res.status(401).send({ message: "Unauthenticated or Session not found, Please login again." })
        };
        if (!id || !userId) {
            return res.status(400).send({ message: "Missing fields" })

        };
        const organization = await Organization.findOne({ where: { id: id } });
        if (!organization) {
            return res.status(404).send({ message: "Organization not found" })
        };

        let existingUser = await User.findOne({ where: { id: userId } });
        if (!existingUser) {
            return res.status(404).send({ message: "User not found" })
        }


        if (organization.userId.includes(userId)) {
            return res.status(400).send({ message: "User already has access to this organization." });
        }
        if (existingUser.organizationId.includes(id)) {
            return res.status(400).send({ message: "User already has access to this organization." });

        }
        const updatedUserIds = [...organization.userId, userId];

        await Organization.update(
            { userId: updatedUserIds },
            { where: { id: id } }
        );
        const updateOrganizationIds = [...existingUser.organizationId, id];
        await User.update(
            { organizationId: updateOrganizationIds },
            { where: { id: userId } }
        );

        const updatedOrganization = await Organization.findOne({ where: { id: id } });
        return res.status(200).send({ message: `User successfully given access to this organization:${organization.name}.`, data: updatedOrganization });

    } catch (error) {
        return res.status(500).send({ message: "Internal server error", error: error.message })

    }

}


async function switchOrganization(req, res) {
    try {
        const userId = req.session.userId;
        const { organizationId } = req.body;
        if (!userId) {
            return res.status(401).send({ message: "Unauthenticated or Session not found, Please login again." })
        };
        const organization = await Organization.findOne({ where: { id: organizationId } });
        if (!organization) {
            return res.status(404).send({ message: 'Organization not found' });
        }
        let existingUser = await User.findOne({ where: { id: userId } });
        if (!existingUser) {
            return res.status(404).send({ message: "User not found" })
        }
        if (!existingUser.organizationId.includes(organizationId)) {
            return res.status(400).send({ message: "User don't have access to this organization." });

        }
        req.session.organizationId = organizationId;
        return res.status(400).send({ message: `organization switched successfuly:${organization.name}` });

    } catch (error) {
        return res.status(500).send({ message: "Internal server error", error: error.message })

    }
}


module.exports = {
    createOrganization,
    getOrganization,
    updateOrganization,
    deleteOrganization,
    getAllOrganization,
    accessOrganization,
    switchOrganization
}