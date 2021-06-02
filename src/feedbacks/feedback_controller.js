/* eslint-disable comma-dangle */
/* eslint-disable space-before-blocks */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
/* eslint-disable prettier/prettier */
const FeedbackModel = require('./feedback_model');
const ProductModal = require('../agro_inputs/products.modal');

// const productController = require('../agro_inputs/products.modal');

module.exports = {
  createFeedback: async (req, res, next) => {
    const newFeedback = await FeedbackModel.create(req.body);
    if (newFeedback != null) res.status(201).json(newFeedback);
  },

  validateFromSMS: async (req, res, next) => {
    // const number = req.body.message;
    console.log(req.body);

    ProductModal.findOne({ token: req.body.message })
      .populate('companyId')
      .populate('productAgent')
      .lean()
      .exec()
      .then((product) => {
        console.log(product);
        // console.log(typeof (product.isRevoked));
        if (product) {
          if (product.isRevoked) {
            const feedback = new FeedbackModel({
              // eslint-disable-next-line quote-props
              message: req.body.message,
              // eslint-disable-next-line quote-props
              fromID: req.body.fromID,
            });
            feedback.save();
            res.status(200).json({
              message:
                'Product has been revoked by quality controllers. It is Fake.',
              from: req.body.fromID,
            });
          } else {
            const feedback = new FeedbackModel({
              // eslint-disable-next-line quote-props
              message: req.body.message,
              // eslint-disable-next-line quote-props
              fromID: req.body.fromID,
            });
            feedback.save();
            res.status(200).json({
              message: 'Product is Genuine',
              from: req.body.fromID,
            });
          }
        } else {
          const feedback = new FeedbackModel({
            // eslint-disable-next-line quote-props
            message: req.body.message,
            // eslint-disable-next-line quote-props
            fromID: req.body.fromID,
          });
          feedback.save();
          res.status(200).json({
            message:
              'Product does Not Exist or it is Not Genuine. Check the token and try again. If the problem persists, report to the nearest quality controllers office, with the package',
            from: req.body.fromID,
          });
        }
      });
  },
};
