/* eslint-disable no-console */
/* eslint-disable comma-dangle */
/* eslint-disable space-before-blocks */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
/* eslint-disable prettier/prettier */
const FeedbackModel = require('./feedback_model');
// const productController = require('../agro_inputs/products.modal');

const productController = require('../manufacturer/manufacture.model');

module.exports = {
  createFeedback: async (req, res, next) => {
    const newFeedback = await FeedbackModel.create(req.body);
    if (newFeedback != null) res.status(201).json(newFeedback);
  },

  validateFromSMS: async (req, res, next) => {
    // const number = req.body.message;
    console.log('kijacode welcome');
console.log('in geneartee');
    productController
      .findOne({ token: req.body.message })
      .populate('companyId')
      .populate('productAgent')
      .lean()
      .exec()
      .then((product) => {
        console.log('on data feedback');
        console.log(product);
        if (product.isRevoked) {
          const feedback = new FeedbackModel(
            {
              // eslint-disable-next-line quote-props
              'message': req.body.message,
              // eslint-disable-next-line quote-props
              'fromID': req.body.fromID,
            }
          );
          feedback.save();
          res.status(200).json({
            message: 'Product is Fake',
          });
        } else {
          const feedback = new FeedbackModel(
            {
              // eslint-disable-next-line quote-props
              'message': req.body.message,
              // eslint-disable-next-line quote-props
              'fromID': req.body.fromID
            }
          );
          feedback.save();
          res.status(200).json({
            message: 'Product is Genuine',
          });
        }
      });
},

    };
