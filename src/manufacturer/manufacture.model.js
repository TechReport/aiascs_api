const mongoose = require('mongoose');

const manufacture = new mongoose.Schema({
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
    max: 12,
    min: 12,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    required: true,
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

  productAgent: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'productAgent',
    },
  ],
});

manufacture.pre('save', function (next) {
  if (this.email.contain('@')) {
    next();
  }
  next(new Error('Enter valid Email'));
});

manufacture.post('remove', async (doc, next) => {
  _.forEach(doc.productAgent, (singlemanufactureDoc) => {
    productAgent.findOneAndUpdate(
      { _id: singlemanufactureDoc._id },
      { $pullAll: { manufacture: [doc._id] } }
    );
  }).exec();

  next();
});

module.exports = mongoose.model('manufacture', manufacture);
