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
    //TODO batchInfoz: {
    //   name: {
    //     type: String,
    //     default: new Date(Date.now()).toDateString(),
    //   },
    //   createdAt: {
    //     type: mongoose.Schema.Types.Date,
    //     default: new Date(Date.now()).toISOString(),
    //   },
    //   productCount: {
    //     type: Number,
    //   },
    // },
    productStatus: {
      type: String,
      enum: ['genuine', 'fake'],
    },
    activity: [
      {
        actor: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'users',
        },
        position: {
          type: String,
          enum: ['Quality Controller', 'Manufacturer', 'Agent'],
        },
        title: {
          type: String,
          required: true,
        },
        descriptions: {
          type: String,
        },
        location: {
          region: String,
          district: String,
          ward: String,
        },
        productStatus: {
          type: String,
          enum: ['genuine', 'non genuine'],
        },
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
    assignedToAgent: {
      type: Boolean,
      default: false,
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
//TODO productsSchema.virtual('batchInfo').get(function () {
//   return this.createdAt;
//   return this.createdAt.toLocaleDateString();
// });

// eslint-disable-next-line func-names
productsSchema.virtual('hasExpired').get(function () {
  return this.expiry < Date.now();
});

// TODO productsSchema.pre('insertMany', async (next, docs) => {
//   console.log('pre insertMany');
//   this.batchInfoz = { productCount: docs.length };
//   next();
//   console.log(docs);
//   console.log(next.length);
//   docs.map((doc) => console.log(doc));
// });

module.exports = mongoose.model('agroInputs', productsSchema);
