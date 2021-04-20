const Router = require('express');

const router = new Router();
const productController = require('./products.controller');
// const validateSession = require('../../middlewares/validateToken')
const sessionMonitor = require('../../utils/middlewares/sessionMonitor')

router.get('/', sessionMonitor, productController.getAll)
router.post('/', sessionMonitor, productController.register)
router.get('/:productID', sessionMonitor, productController.getOne)
router.delete('/:productID', sessionMonitor, productController.deleteOne)
router.patch('/revoke/:productID', sessionMonitor, productController.revokeProduct)

// router.post('/route', middleware, controller)

module.exports = router;
