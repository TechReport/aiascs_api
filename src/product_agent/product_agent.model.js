/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const _ = require('lodash');
const Manufacture = require('../manufacturer/manufacture.model');
const Product = require('../agro_inputs/products.modal');

const productAgent = new mongoose.Schema(
  {
    regno: {
      type: String,
      unique: true,
      required: true,
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

    location: {
      country: String,
      district: String,
      ward: String,
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now(),
    },

    manufacture: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'manufacture',
      },
    ],
  },
  // eslint-disable-next-line
 {timestamps:true}
);

productAgent.pre('save', (next) => {
  // eslint-disable-next-line no-constant-condition
  if (true) {
    next();
  }
  next(new Error('Enter valid Email'));
});

productAgent.post('remove', async (doc, next) => {
  _.forEach(doc.manufacture, async (singlemanufactureDoc) => {
    await Manufacture.findOneAndUpdate(
      { _id: singlemanufactureDoc._id },
      // eslint-disable-next-line comma-dangle
      { $pullAll: { productAgent: [doc._id] } }
    );
  }).exec();

  next();
});

productAgent.post('remove', async (doc, next) => {
  Product.deleteMany({ manufacture: doc._id }, (error, response) => {
    if (error) {
      next(error);
    }
    // eslint-disable-next-line no-console
    console.log(response);
    next();
  });
});

module.exports = mongoose.model('productAgent', productAgent);
