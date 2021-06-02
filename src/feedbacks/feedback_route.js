/* eslint-disable no-unused-vars */
/* eslint-disable comma-dangle */
/* eslint-disable prettier/prettier */
const express = require('express');

const router = express.Router();
const feedbackController = require('./feedback_controller');

// eslint-disable-next-line prettier/prettier
router.post('/verify', feedbackController.validateFromSMS);

module.exports = router;
