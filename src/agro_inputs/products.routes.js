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

router.get(
  '/productVSTime',
  sessionMonitor,
  productController.getProductStatsVSTime
);
router.get(
  '/productsVSCompany',
  sessionMonitor,
  productController.getProductsVSCompany
);
router.get(
  '/registeredVSUnregistered',
  sessionMonitor,
  productController.getRegisteredProductsVSUnregistered
);
router.get(
  '/verifiedVSUnverified',
  sessionMonitor,
  productController.getVerifiedProductsVSUnverified
);

router.get(
  '/batch/:companyId/:mode',
  sessionMonitor,
  productController.getBatches
);
router.get('/:productID', sessionMonitor, productController.getOne);
router.get('/', sessionMonitor, productController.getAll);
router.delete('/:productID', sessionMonitor, productController.deleteOne);
router.patch(
  '/revoke/:productID',
  sessionMonitor,
  // eslint-disable-next-line comma-dangle
  productController.revokeProduct
);

// router.get('/:token', productController.getProductByToken);
router.patch(
  '/revoke/:productID',
  sessionMonitor,
  // eslint-disable-next-line comma-dangle
  productController.revokeProduct
);

module.exports = router;
