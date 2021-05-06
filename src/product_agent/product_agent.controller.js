/* eslint-disable prettier/prettier */
const ProductAgent = require('./product_agent.model');

module.exports = {
  getProductAgentById: async (req, res, next) => {
    await ProductAgent.findById(req.productAgentId, (error, productAgent) => {
      if (error) {
        next(error);
      }
      res.status(200).json(productAgent);
    }).exec();
  },

  getAllProductAgent: async (req, res, next) => {
    await ProductAgent.find({}, (error, productAgent) => {
      if (error) {
        next(error);
      }
      res.status(200).json(productAgent);
    })
      .populate({
        path: 'admin',
        populate: [{ path: 'role', select: 'name' }],
      })
      .populate('manufacture')
      .sort('-createdAt')
      .lean()
      .exec();
  },

  createProductAgent: async (req, res) => {
    const productAgents = await ProductAgent.create(req.body);
    res.status(201).json(productAgents.toJSON());
  },

  removeProductAgentId: async (req, res) => {
    await ProductAgent.findByIdAndDelete(req.productAgentId).exec();
    res.status(202).json({
      message: 'sucess fully deleted',
    });
  },
  updateProductAgentById: async (req, res, next) => {
    const update = req.body;
    // eslint-disable-next-line no-return-await
    return await ProductAgent.findByIdAndUpdate(
      req.productAgentId,
      update,
      { new: true },
      (error, updatedProductAgent) => {
        if (error) {
          next(error);
        }
        res.status(204).json(updatedProductAgent);
      },
      { new: true },
    ).exec();
  },
  addManufactureToProductAgent: async (req, res) => {
    const manufacture = req.body;
    const productAgent = await ProductAgent.findByIdAndUpdate(
      req.productAgentId,
      {
        $push: {
          productAgent: {
            $each: manufacture,
          },
        },
      },
      // eslint-disable-next-line comma-dangle
      { new: true }
    ).exec();
    res.status(201).json(productAgent);
  },
  assignAdmin: async (req, res, next) => {
    const { companyId, adminId } = req.params;
    console.log(companyId);
    console.log(adminId);

    await ProductAgent.findByIdAndUpdate(
      companyId,
      { admin: adminId },
      { new: true, useFindAndModify: false }
    )
      .populate({
        path: 'admin',
        populate: [{ path: 'role', select: 'name' }],
      })
      .then((updatedAgentCompany) => res.status(201).json(updatedAgentCompany))
      .catch((err) => {
        console.log(err);
        next(err);
      });
  },
};
