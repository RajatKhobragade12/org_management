const express = require('express');
const router = express.Router();
const { createOrganization, getOrganization, getAllOrganization, updateOrganization, deleteOrganization, accessOrganization, switchOrganization } = require("../controllers/organization.controller");
const { authentication, authorization } = require("../middleware/auth.middleware");

router.post('/organization', authentication, authorization, createOrganization);
router.get('/organization/:id', authentication, getOrganization);
router.get('/organizations', authentication, getAllOrganization);
router.put('/organization/:id', authentication, authorization, updateOrganization);
router.delete('/organization/:id', authentication, authorization, deleteOrganization);
router.post('/access/:id', authentication, authorization, accessOrganization);
router.post('/switch', authentication, switchOrganization);


module.exports = router;