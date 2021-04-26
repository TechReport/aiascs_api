const Router = require('express');

const router = new Router();
const productController = require('./products.controller');
// const validateSession = require('../../middlewares/validateToken')
const sessionMonitor = require('../../utils/middlewares/sessionMonitor');

router.get('/', sessionMonitor, productController.getAll);
router.post('/', sessionMonitor, productController.register);
router.get('/:productID', sessionMonitor, productController.getOne);

/**
 *
 *product delete route dose not work
 *
 * */

// router.delete('/:productID', sessionMonitor, productController.deleteOne);
router.patch(
  '/revoke/:productID',
  sessionMonitor,
  // eslint-disable-next-line comma-dangle
  productController.revokeProduct
);

// router.post('/route', middleware, controller)

module.exports = router;
