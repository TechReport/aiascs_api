const mongoose = require('mongoose');
const manufactureModel = require('../manufacturer/manufacture.model');

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      required: true,
      dropDups: true,
    },
    phoneNumber: {
      type: String,
      unique: true,
      trim: true,
      required: true,
      dropDups: true,
    },
    location: {
      country: { type: String, default: 'Tanzania' },
      region: String,
      district: String,
      ward: String,
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    firstTimeLoginStatus: {
      type: Number,
      enum: [0, 1],
      default: 1,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      // required: true,
      refPath: 'onModel',
    },
    onModel: {
      type: String,
      // required: true,
      enum: ['manufacture', 'productAgent', 'qualityController'],
    },
    /*
     *for first login, before user changes password, firstTimeLoginStats is set to 0
     *after resetting password, the firstTimeLoginStats is set to 1
     */
    role: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'role',
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    token: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre('deleteOne', async (next) => {
  await manufactureModel.findOneAndUpdate(
    { admin: this._id },
    { admin: undefined },
    { useFindAndModify: false }
  );
  next();
});

userSchema.virtual('fullName').get(function () {
  return this.firstName + ' ' + this.lastName;
});

module.exports = mongoose.model('users', userSchema);
