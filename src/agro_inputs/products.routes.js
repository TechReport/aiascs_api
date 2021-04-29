const Router = require('express');
const router = new Router();
const productController = require('./products.controller');
const sessionMonitor = require('../../utils/middlewares/sessionMonitor')


router.post('/report', sessionMonitor, productController.reportUnregisteredProduct)
router.get('/unregistered', sessionMonitor, productController.getUnregisteredProducts)

router.post('/', sessionMonitor, productController.register)
router.get('/:productID', sessionMonitor, productController.getOne)
router.get('/', sessionMonitor, productController.getAll)
router.delete('/:productID', sessionMonitor, productController.deleteOne)
router.patch('/revoke/:productID', sessionMonitor, productController.revokeProduct)

// router.get('/:token', productController.getProductByToken);
router.patch(
    '/revoke/:productID',
    sessionMonitor,
    // eslint-disable-next-line comma-dangle
    productController.revokeProduct
);

module.exports = router;
