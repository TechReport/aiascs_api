const mongoose = require('mongoose');

const productsSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  photoInfo: {
    type: String,
    trim: true,
  },
  isRevoked: {
    type: Boolean,
    default: false,
  },
  token: {
    type: String,
    default: 'token',
  },
  qrcode: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'qrcode',
    unique: true,
  },
  expiry: {
    type: mongoose.Schema.Types.Date,
    trim: true,
    required: true,
  },
  manufacture: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'manufacture',
  },
  productAgent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'productAgent',
  },
});

productsSchema.virtual('batchInfo').get(function () {
  console.log('i am called');
  return this.createdAt;
});

productsSchema.virtual('hasExpired').get(function () {
  console.log('i am called');
  return this.expiry > Date.now();
});

module.exports = mongoose.model('agroInputs', productsSchema);
