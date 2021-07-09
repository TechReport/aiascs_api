const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let notificationSchema = mongoose
  .Schema(
    {
      createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true,
      },
      read: {
        type: Boolean,
        default: false,
      },
      subject: {
        type: String,
        required: true,
      },
      body: {
        type: Schema.Types.ObjectId,
        refPath: 'onBodyModel',
        required: true,
      },
      onBodyModel: {
        type: String,
        required: true,
        enum: ['agroInputs', 'batches'],
      },
    },
    { timestamps: true }
  )
  .pre('save', () => {
    console.log('pre save');
  })
  .post('save', () => {
    console.log('post save');
  });

const NotificationSchema = mongoose.model('notifications', notificationSchema);

module.exports = NotificationSchema;
