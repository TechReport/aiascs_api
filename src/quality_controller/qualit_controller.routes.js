const Router = require('express');
const router = new Router();
const qualityControlController = require('./quality_controller.controller');
const sessionMonitor = require('../../utils/middlewares/sessionMonitor');

router.get('/', sessionMonitor, qualityControlController.getAll);
router.get('/:id', sessionMonitor, qualityControlController.getById);

router.post('/register', sessionMonitor, qualityControlController.register);
router.delete('/', sessionMonitor, qualityControlController.delete);
router.put(
  '/update/:id',
  sessionMonitor,
  qualityControlController.updateOneById
);
router.put(
  '/assignAdmin/:companyId/:adminId',
  sessionMonitor,
  qualityControlController.assignAdmin
);
router.post(
  '/updatelogo/:companyId',
  sessionMonitor,
  qualityControlController.updateLogo
);
router.patch(
  '/updatepostal/:companyId',
  sessionMonitor,
  qualityControlController.updatePostalAddress
);

module.exports = router;
