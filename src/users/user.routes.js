const Router = require('express')
const router = new Router()
const userController = require('./user.controller')
// const validateSession = require('../../middlewares/validateToken')

router.get('/', userController.getAll)
router.post('/login', userController.login)
router.post('/register', userController.register)


// router.post('/route', middleware, controller)

module.exports = router

