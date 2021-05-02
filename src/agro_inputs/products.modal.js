const mongoose = require('mongoose');
const QrCode = require('../qrCode/qrcode.model');

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
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'manufacture',
  },
  productAgent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'productAgent',
  },
});

productsSchema.pre('validate', true, async function (next) {
  // eslint-disable-next-line no-console
  const qrcodeObject = await QrCode.findById({ _id: this.qrcode }).exec();
  this.token = qrcodeObject.productToken;
  // eslint-disable-next-line no-console
  // next(new Error('Enter valid Email'));
  next();
});

// eslint-disable-next-line func-names
productsSchema.virtual('batchInfo').get(function () {
  console.log('i am called');
  return this.createdAt;
});

// eslint-disable-next-line func-names
productsSchema.virtual('hasExpired').get(function () {
  console.log('i am called');
  return this.expiry > Date.now();
});

module.exports = mongoose.model('agroInputs', productsSchema);
