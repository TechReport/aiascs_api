const Notifications = require('./notification.model');

module.exports = {
  storeNotification: async ({ createdBy, onBodyModel, subject, body }) => {
    var notification = new Notifications({
      createdBy,
      subject,
      body,
      onBodyModel,
    });
    const status = notification.save();
    return status;
  },
  fetchNotifications: async (req, res) => {
    try {
      console.log(req.body);
      const notifications = await Notifications.find()
        // .populate('body')
        .populate({
          path: 'body',
          populate: [
            { path: 'companyId' },
            { path: 'batch' },
            { path: 'qrcode' },
          ],
        })
        .populate({
          path: 'createdBy',
          populate: [{ path: 'companyId' }, { path: 'role' }],
        });
      // .populate({path})
      //   console.log(notifications);
      // .select('createdAt createdBy recepient requestId')
      // .sort('-createdAt')
      // .populate('recepient.recepientID createdBy')
      // .populate({
      //   path: 'recepient.recepientID',
      //   select: 'firstName lastName status readAt',
      // })
      // .populate({
      //   path: 'createdBy',
      //   select: 'firstName lastName',
      // });
      return res.status(200).json(notifications);
    } catch (e) {
      return res.status(400).json({
        userMessage: 'Whoops something went wrong',
        developerMessage: e.message,
      });
    }
  },

  //   fetchNotificationByUserID: async (req, res) => {
  //     try {
  //       // const { userId } = req.body
  //       const notifications = await Notification.findOneAndUpdate(
  //         { userId: req.params.userID, status: 0 },
  //         { status: 1 }
  //       );
  //       //status 0 = not read, 1 read
  //       return res.status(200).json({
  //         status: true,
  //         message: 'notifications ready',
  //         data: notifications,
  //       });
  //     } catch (e) {
  //       return res.status(400).json({
  //         userMessage: 'Whoops something went wrong',
  //         developerMessage: e.message,
  //       });
  //     }
  //   },
  markRead: async (req, res) => {
    try {
      const { requestId, userId } = req.body;
      const notif = await Notifications.findOne({
        requestId,
        'recepient.recepientID': userId,
      });
      notif.recepient.forEach((item) => {
        if (item.recepientID.toString() === userId) {
          item.status = 1;
        }
      });
      notif.readAt = new Date().toISOString();
      notif.save();
      return res.status(200).json({
        status: true,
        message: 'marked read',
        data: {},
      });
    } catch (e) {
      return res.status(400).json({
        userMessage: 'Whoops something went wrong',
        developerMessage: e.message,
      });
    }
  },
  delete: async (req, res) => {
    try {
      // console.log(req.params)
      await Notifications.deleteOne({ _id: req.params.notificationID });
      res.status(200).json({
        message: 'deleted',
        status: true,
        // data:
      });
    } catch (e) {
      return res.status(400).json({
        userMessage: 'Whoops something went wrong',
        developerMessage: e.message,
      });
    }
  },
};
// const getNotificationAndEmit = async (socket, userId) => {
//   console.log('emmiting');
//   const notifications = await Notifications.find({
//     'recepient.recepientID': userId,
//     'recepient.status': 0,
//   })
//     .select('createdBy subject requestId createdAt')
//     .sort('-createdAt')
//     .populate('createdBy', 'firstName lastName');
//   socket.emit('notifications', notifications);
// };

// const getNotificationCountAndEmit = async (socket, userId) => {
//   const count = await Notifications.find({
//     'recepient.recepientID': userId,
//     'recepient.status': 0,
//   }).countDocuments();
//   socket.emit('notificationsCount', count);
// };
