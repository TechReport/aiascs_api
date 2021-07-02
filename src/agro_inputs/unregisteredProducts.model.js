const mongoose = require('mongoose');

let unregisteredProductsSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    photo: [
      {
        type: Object,
        trim: true,
      },
    ],
    isRevoked: {
      type: Boolean,
      default: true,
    },
    companyName: {
      type: String,
    },
    descriptions: {
      type: String,
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
    location: {
      country: String,
      district: String,
      ward: String,
    },
  },
  { timestamps: true }
);

// productsSchema.virtual('batchInfo').get(function () {
//     console.log('i am called')
//     return this.createdAt
// })

// productsSchema.virtual('hasExpired').get(function () {
//     console.log('i am called')
//     return this.expiry > Date.now() ? true : false
// })

module.exports = mongoose.model(
  'unregisteredProducts',
  unregisteredProductsSchema
);
