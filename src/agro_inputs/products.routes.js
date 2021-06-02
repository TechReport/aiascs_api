/* eslint-disable prettier/prettier */
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

router.get(
  '/productToken/:token',
  sessionMonitor,
  productController.getProductByToken
);
router.post('/', sessionMonitor, productController.register);

router.get(
  '/productVSTime',
  sessionMonitor,
  // eslint-disable-next-line comma-dangle
  productController.getProductStatsVSTime
);
router.get(
  '/productsVSCompany',
  sessionMonitor,
  // eslint-disable-next-line comma-dangle
  productController.getProductsVSCompany
);
router.get(
  '/registeredVSUnregistered',
  sessionMonitor,
  // eslint-disable-next-line comma-dangle
  productController.getRegisteredProductsVSUnregistered
);
router.get(
  '/verifiedVSUnverified',
  sessionMonitor,
  // eslint-disable-next-line comma-dangle
  productController.getVerifiedProductsVSUnverified
);

router.get(
  '/batch/:companyId/:mode',
  sessionMonitor,
  // eslint-disable-next-line comma-dangle
  productController.getBatches
);

router.get(
  '/activity/:productId',
  sessionMonitor,
  productController.getProductActivity
);
router.get('/adminstats', sessionMonitor, productController.getAdminStats);

router.get('/:productID', sessionMonitor, productController.getOne);
router.get('/', sessionMonitor, productController.getAll);
router.delete('/:productID', sessionMonitor, productController.deleteOne);
router.get(
  '/revoke/:productID',
  // sessionMonitor,
  // eslint-disable-next-line comma-dangle
  productController.revokeProduct
);

router.patch(
  '/revoke/:productID',
  sessionMonitor,
  // eslint-disable-next-line comma-dangle
  productController.revokeProduct
);
router.patch(
  '/revokebatch',
  sessionMonitor,
  // eslint-disable-next-line comma-dangle
  productController.revokeBatch
);
module.exports = router;
