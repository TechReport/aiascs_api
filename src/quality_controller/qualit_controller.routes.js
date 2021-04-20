const Router = require('express');
const router = new Router();
const qualityControlController = require('./quality_controller.controller');
const sessionMonitor = require('../../utils/middlewares/sessionMonitor');


router.get('/', sessionMonitor, qualityControlController.getAll)
router.get('/:id', sessionMonitor, qualityControlController.getById)

router.post('/', qualityControlController.register)
router.delete('/', sessionMonitor, qualityControlController.delete)
router.patch('/update/:id', sessionMonitor, qualityControlController.update)


module.exports = router;
