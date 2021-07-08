const Router = require('express');
const router = new Router();

const reportController = require('./reports.controller');
const sessionMonitor = require('../../utils/middlewares/sessionMonitor');

router.get(
  '/productvscompany',
  sessionMonitor,
  reportController.getProductVSCompany
);
router.get(
  '/productsvsbatch/:companyId',
  sessionMonitor,
  reportController.productsVSBatch
);
router.get('/batchsummary', sessionMonitor, reportController.batchSummary);
router.get(
  '/companiesWithRevokedProducts',
  sessionMonitor,
  reportController.companiesWithRevokedProducts
);

router.get(
  '/batchesWithCounterfeitProducts',
  sessionMonitor,
  reportController.batchesWithCounterfeitProducts
);

// router.get('/:id', sessionMonitor, reportController.viewReport);

router.post('/', reportController.generateReport);

module.exports = router;
