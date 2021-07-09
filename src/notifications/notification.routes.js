const Router = require('express');
const router = new Router();
const notificationController = require('./notification.controller');

//create notifications
// router.post('/', notificationController.storeNotification);
// router.post('/subscribe', notificationController.subscribe)
router.get('/', notificationController.fetchNotifications);
// router.get('/:userID', notificationController.fetchNotificationByUserID);
router.patch('/markread', notificationController.markRead);
router.delete('/:notificationID', notificationController.delete);

module.exports = router;
