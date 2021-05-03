const Router = require('express');

const router = new Router();
const userController = require('./user.controller');
const sessionMonitor = require('../../utils/middlewares/sessionMonitor');

router.get('/role', userController.getUsersByRole);
router.get('/getCompanyUserByRole', userController.getCompanyUserByRole);
router.get('/:id', sessionMonitor, userController.getById);

router.get('/', sessionMonitor, userController.getAll);

router.post('/login', userController.login);
router.post('/signout', sessionMonitor, userController.signOut);
router.post('/register', sessionMonitor, userController.register);
router.patch('/resetPassword', sessionMonitor, userController.resetPassword);
router.delete('/:userId', sessionMonitor, userController.deleteUser);

module.exports = router;
