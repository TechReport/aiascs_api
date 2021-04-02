const Router = require('express')
const router = new Router()
const productController = require('./products.controller')
// const validateSession = require('../../middlewares/validateToken')
// const sessionMonitor = require('../../utils/middlewares/sessionMonitor')

// router.get('/', productController.getAll)
router.post('/', productController.register)
// router.post('/register', userController.register)
// router.patch('/resetPassword', sessionMonitor, userController.resetPassword)


// router.post('/route', middleware, controller)

module.exports = router

