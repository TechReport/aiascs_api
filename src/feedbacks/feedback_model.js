const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  message: {
    type: String,
  },
  fromID: String,
  feedBackFrom: {
    type: String,
    enum: ['Farmer', 'QualityController'],
    default: 'Farmer',
    toLowerCase: true,
  },
});

feedbackSchema.pre('validate', async function (next) {
  if (this.identifier.length > 12 && this.message.length > 16) {
    this.feedBackFrom = 'QualityController';
  }
  next();
});

feedbackSchema.virtual('messageCategory').get(function () {
  if (this.identifier.length === 12 && this.message.length === 16) {
    return 'verification';
  }
  return 'feedback';
});

module.exports = mongoose.model('feedback', feedbackSchema);
