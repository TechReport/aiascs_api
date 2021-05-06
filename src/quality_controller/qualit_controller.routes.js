const Router = require('express');
const router = new Router();
const qualityControlController = require('./quality_controller.controller');
const sessionMonitor = require('../../utils/middlewares/sessionMonitor');


router.get('/', sessionMonitor, qualityControlController.getAll)
router.get('/:id', sessionMonitor, qualityControlController.getById)

router.post('/register', sessionMonitor, qualityControlController.register)
router.delete('/', sessionMonitor, qualityControlController.delete)
router.patch('/update/:id', sessionMonitor, qualityControlController.update)
router.put('/assignAdmin/:companyId/:adminId', sessionMonitor, qualityControlController.assignAdmin)


module.exports = router;
