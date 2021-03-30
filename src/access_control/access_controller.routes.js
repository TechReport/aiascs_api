const Router = require('express')
const accessController = require('./access_controller.controller')
// const checkPermission = require('../../middlewares/checkPermissions')

const routes = new Router();
//create user roles
// checkPermission('access-control', 'write-role')
routes.get('/roles', accessController.getRoles);
routes.post('/roles', accessController.createRole);

//create user roles
module.exports = routes;