/* eslint-disable prettier/prettier */
const Router = require('express');

const router = new Router();
const productController = require('./products.controller');

const sessionMonitor = require('../../utils/middlewares/sessionMonitor');
const { logEventToProduct } = require('./products.middleware');

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

router.get('/batches', sessionMonitor, productController.getOne);
router.get(
  '/batches/:companyId',
  sessionMonitor,
  productController.getBatchesByCompanyId,
);
router.get(
  '/batchesVSProducts/:companyId',
  sessionMonitor,
  productController.getBatchesVSProductsByCompanyId,
);
router.post('/batches', sessionMonitor, productController.createBatch);

// DONT USE THIS
// router.get(
//   '/batch/:companyId/:mode',
//   sessionMonitor,
//   // eslint-disable-next-line comma-dangle
//   productController.getBatchesOld
// );

router.get(
  '/productToken/:token',
  sessionMonitor,
  logEventToProduct,
  productController.getProductByToken,
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
  '/activity/:productId',
  sessionMonitor,
  productController.getProductActivity,
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
