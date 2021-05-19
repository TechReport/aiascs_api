const express = require('express');

const router = express.Router();
const feedbackController = require('./feedback_controller');

router.post('/verify', feedbackController.validateFromSMS);

module.exports = router;
