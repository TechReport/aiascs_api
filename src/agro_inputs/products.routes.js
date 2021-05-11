const Router = require('express');

const router = new Router();
const productController = require('./products.controller');

const sessionMonitor = require('../../utils/middlewares/sessionMonitor');

router.post(
  '/report',
  sessionMonitor,
  // eslint-disable-next-line comma-dangle
  productController.reportUnregisteredProduct
);
// router.get('/unregistered/:productID', sessionMonitor, productController.getUnregisteredProducts)
router.get(
  '/unregistered',
  sessionMonitor,
  // eslint-disable-next-line comma-dangle
  productController.getUnregisteredProducts
);

router.get('/productToken/:token', productController.getProductByToken);
router.post('/', sessionMonitor, productController.register);
router.get('/:productID', sessionMonitor, productController.getOne);
router.get('/', sessionMonitor, productController.getAll);
// router.delete('/:productID', sessionMonitor, productController.deleteOne);
router.get(
  '/revoke/:productID',
  // sessionMonitor,
  // eslint-disable-next-line comma-dangle
  productController.revokeProduct
);

module.exports = router;
