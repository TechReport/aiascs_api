/* eslint-disable indent */
/* eslint-disable prettier/prettier */
const feedbackModel = require('./feedback_model');
const productController = require('../agro_inputs/products.modal');

module.exports = {
  createFeedback: async (req, res) => {
    const newFeedback = await feedbackModel.create(req.body);
    if (newFeedback != null) res.status(201).json(newFeedback);
  },

  validateFromSMS: async (next, req, res) => {
    const number = req.body.message;
    productController
      .findOne({ token: number })
      .populate('companyId')
      .populate('productAgent')
      .lean()
      .exec()
      .then((product) => {
        if (product.isRevoked) {
          res.status(200).json({
            message: 'Product is Fake',
          });
        } else {
          res.status(200).json({
            message: 'Product is Genuine',
          });
        }
        feedbackModel.create(req.body);
      }).catch((err) => {
        next(err);
      });
},

    };
