const Router = require('express');

<<<<<<< HEAD
const router = new Router();
const userController = require('./user.controller');
const sessionMonitor = require('../../utils/middlewares/sessionMonitor');
=======
router.get('/', sessionMonitor, userController.getAll)
router.post('/login', userController.login)
router.post('/signout', sessionMonitor, userController.signOut)
router.post('/register', sessionMonitor, userController.register)
router.patch('/resetPassword', sessionMonitor, userController.resetPassword)
>>>>>>> 84c9433133ab8feaa83d356a114c25cd8ef2ee9c

router.get('/', userController.getAll);
router.post('/login', userController.login);
router.post('/register', userController.register);
router.patch('/resetPassword', sessionMonitor, userController.resetPassword);

module.exports = router;
