/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const _ = require('lodash');
const ProductAgent = require('../product_agent/product_agent.model');
const Product = require('../agro_inputs/products.modal');

const manufacture = new mongoose.Schema(
  {
    regno: {
      type: String,
      unique: true,
      required: true,
    },
    code: {
      type: String,
      unique: true,
      //   required: true,
    },
    name: {
      type: String,
      min: 5,
      unique: true,
      required: true,
    },

    phonenumber: {
      type: Number,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@\\"]+(\.[^<>()[\]\\.,;:\s@\\"]+)*)|(\\".+\\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please enter a valid email',
      ],
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
    },
    location: {
      country: { type: String, default: 'Tanzania' },
      region: String,
      district: String,
      ward: String,
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now(),
    },

    productAgent: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'productAgent',
      },
    ],
  },
  // eslint-disable-next-line prettier/prettier
  { timestamps: true }
);

manufacture.pre('save', (next) => {
  if (true) {
    next();
  }
  next(new Error('Enter valid Email'));
});

manufacture.post('remove', async (doc, next) => {
  _.forEach(doc.productAgent, (singlemanufactureDoc) => {
    ProductAgent.findOneAndUpdate(
      { _id: singlemanufactureDoc._id },
      // eslint-disable-next-line prettier/prettier
      { $pullAll: { manufacture: [doc._id] } }
    );
  }).exec();

  next();
});

manufacture.post('remove', async (doc, next) => {
  Product.deleteMany({ manufacture: doc._id }, (error, response) => {
    if (error) {
      next(error);
    }
    // eslint-disable-next-line no-console
    console.log(response);
    next();
  });
});

// manufacture.post('deleteOne', async (doc, next) => {
//     console.log('delete manufacturer')
//     // await userModal.deleteMany({ companyId: this._id })
//     await AgroInputsModal.deleteMany({ companyId: this._id })
//     next()
// })

module.exports = mongoose.model('manufacture', manufacture);
