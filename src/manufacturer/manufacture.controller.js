/* eslint-disable no-unused-vars */
// eslint-disable-next-line prettier/prettier
const Manufacture = require('./manufacture.model');

module.exports = {
  getManufuctureById: (req, res, next) =>
    // eslint-disable-next-line implicit-arrow-linebreak
    Manufacture.findById(req.manufactureId).exec(),

  getAllManufacture: (req, res, next) => Manufacture.find({}).exec(),

  createManufacture: (req, res, next) => {
    const manufactureDetails = req.body;
    return Manufacture.create(manufactureDetails);
  },

  removeManufactureyId: (req, res, next) => {
    const { id } = req.params;
    return Manufacture.findByIdAndDelete(id).exec();
  },
  updateManufactureById: (req, res, next) => {
    const { id } = req.params;
    const update = req.body;
    return Manufacture.findByIdAndUpdate(id, update, { new: true }).exec();
  },
};
