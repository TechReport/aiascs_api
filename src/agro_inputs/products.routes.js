const Router = require('express');
const router = new Router();
const productController = require('./products.controller');
const sessionMonitor = require('../../utils/middlewares/sessionMonitor')

router.post('/report', sessionMonitor, productController.reportUnregisteredProduct)
// router.get('/unregistered/:productID', sessionMonitor, productController.getUnregisteredProducts)
router.get('/unregistered', sessionMonitor, productController.getUnregisteredProducts)

router.post('/', sessionMonitor, productController.register)
router.get('/:productID', sessionMonitor, productController.getOne)
router.get('/', sessionMonitor, productController.getAll)
router.delete('/:productID', sessionMonitor, productController.deleteOne)
router.patch('/revoke/:productID', sessionMonitor, productController.revokeProduct)

module.exports = router;
