const express = require('express');

const router = express.Router();
const productAgentController = require('./product_agent.controller');
const productMiddlware = require('../../utils/middlewares/productAgent_middleware');
const sessionMonitor = require('../../utils/middlewares/sessionMonitor');

router.get('/all', productAgentController.getAllProductAgent);
router.get(
  '/:id',
  productMiddlware.getId,
  // eslint-disable-next-line comma-dangle
  productAgentController.getProductAgentById
);
router.post('/register', productAgentController.createProductAgent);
router.delete(
  '/:id',
  productMiddlware.getId,
  // eslint-disable-next-line comma-dangle
  productAgentController.removeProductAgentId
);
router.put(
  '/update/:id',
  productMiddlware.getId,
  // eslint-disable-next-line comma-dangle
  productAgentController.updateProductAgentById
);
router.post(
  '/addManufacture/:id',
  productMiddlware.getId,
  // eslint-disable-next-line comma-dangle
  productAgentController.addManufactureToProductAgent
);
router.put(
  '/assignAdmin/:companyId/:adminId',
  sessionMonitor,
  // eslint-disable-next-line comma-dangle
  productAgentController.assignAdmin
);

module.exports = router;
