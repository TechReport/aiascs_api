const Router = require('express');
const sessionMonitor = require('../../utils/middlewares/sessionMonitor');
const checkPermission = require('../../utils/middlewares/checkPermission');
// ../../utils/middlewares/sessionMonitor

const accessController = require('./access_controller.controller');
// const checkPermission = require('../../middlewares/checkPermissions')

const routes = new Router();
// create user roles
// checkPermission('access-control', 'write-role')
// routes.get('/roles', sessionMonitor, accessController.getRoles);
routes.get('/roles', sessionMonitor, checkPermission('access-control', 'read_all_roles'), accessController.getRoles);
routes.get('/rolesbyrole', sessionMonitor, checkPermission('access-control', 'read_all_roles'), accessController.getRolesByRole);
routes.post('/roles', sessionMonitor, accessController.createRole);
routes.get('/auth', sessionMonitor, accessController.checkSession);

// create user roles
module.exports = routes;
