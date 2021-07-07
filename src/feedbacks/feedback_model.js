const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  message: {
    type: String,
  },
  fromID: String,
  messageType: {
    type: String,
    enum: ['1', '2'],
    //*  1 - for varefying product , 2- for feedbacks  */
    default: '2',
    toLowerCase: true,
  },
  feedBackFrom: {
    type: String,
    enum: ['Farmer', 'QualityController'],
    default: 'Farmer',
    toLowerCase: true,
  },
});

// eslint-disable-next-line func-names
feedbackSchema.pre('validate', async function (next) {
  if (this.fromID.length > 12 && this.message.length > 16) {
    this.feedBackFrom = 'QualityController';
  }
  next();
});

feedbackSchema.virtual('messageCategory').get(function () {
  if (this.fromID.length === 12 && this.message.length === 16) {
    return 'verification';
  }
  return 'feedback';
});

module.exports = mongoose.model('feedback', feedbackSchema);
