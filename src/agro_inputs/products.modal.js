const mongoose = require('mongoose');
const QrCode = require('../qrCode/qrcode.model');

const productsSchema = new mongoose.Schema(
  {
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
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'batches',
    },
    batchInfoz: {
      name: {
        type: String,
        default: new Date(Date.now()).toDateString(),
      },
      createdAt: {
        type: mongoose.Schema.Types.Date,
        default: new Date(Date.now()).toISOString(),
      },
      productCount: {
        type: Number,
      },
    },
    activity: [
      {
        actor: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'users',
        },
        position: {
          type: String,
          enum: ['qualityController', 'manufacturer', 'agent'],
        },
        title: { type: String },
        descriptions: {},
        issuedAt: { type: mongoose.Schema.Types.Date },
      },
    ],
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
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

productsSchema.pre('validate', async function (next) {
  // eslint-disable-next-line no-console
  const qrcodeObject = await QrCode.findById({ _id: this.qrcode }).exec();
  this.token = qrcodeObject.productToken;
  // eslint-disable-next-line no-console
  return next();
});

// eslint-disable-next-line func-names
productsSchema.virtual('batchInfo').get(function () {
  //   return this.createdAt;
  return this.createdAt.toLocaleDateString();
});

// eslint-disable-next-line func-names
productsSchema.virtual('hasExpired').get(function () {
  return this.expiry < Date.now();
});

productsSchema.pre('insertMany', async (next, docs) => {
  console.log('pre insertMany');
  this.batchInfoz = { productCount: docs.length };
  next();
  //   console.log(docs);
  //   console.log(next.length);
  //   docs.map((doc) => console.log(doc));
});

module.exports = mongoose.model('agroInputs', productsSchema);
