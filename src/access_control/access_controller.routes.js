const Router = require('express');
const sessionMonitor = require('../../utils/middlewares/sessionMonitor');;
// ../../utils/middlewares/sessionMonitor

const accessController = require('./access_controller.controller')
// const checkPermission = require('../../middlewares/checkPermissions')

const routes = new Router();
//create user roles
// checkPermission('access-control', 'write-role')
routes.get('/roles', accessController.getRoles);
routes.post('/roles', accessController.createRole);
routes.get('/auth', sessionMonitor, accessController.checkSession);

//create user roles
module.exports = routes;