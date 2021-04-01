const Router = require('express')
const router = new Router()
const userController = require('./user.controller')
const sessionMonitor = require('../../utils/middlewares/sessionMonitor')

router.get('/', userController.getAll)
router.post('/login', userController.login)
router.post('/register', userController.register)
router.patch('/resetPassword', sessionMonitor, userController.resetPassword)

module.exports = router

