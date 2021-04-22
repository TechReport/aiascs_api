const Router = require('express');

const router = new Router();
const userController = require('./user.controller');
const sessionMonitor = require('../../utils/middlewares/sessionMonitor');

router.get('/', sessionMonitor, userController.getAll);
router.get('/role', sessionMonitor, userController.getUsersByRole);
router.post('/login', userController.login);
router.post('/signout', sessionMonitor, userController.signOut);
router.post('/register', sessionMonitor, userController.register);
router.patch('/resetPassword', sessionMonitor, userController.resetPassword);

module.exports = router;
