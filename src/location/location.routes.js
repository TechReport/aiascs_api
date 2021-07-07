const Router = require('express');

const router = new Router();
const locationController = require('./location.controller');

router.get('/:userId', locationController.findByUserId);

router.post('/', locationController.create);
router.patch('/:userId', locationController.update);

module.exports = router;
