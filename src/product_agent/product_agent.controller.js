/* eslint-disable prettier/prettier */
// const ProductAgent = require('./product_agent.model');
const manufactureModel = require('../manufacturer/manufacture.model');
const ProductAgent = require('./product_agent.model');

const alphanuminc = require('alphanum-increment');
const ProductsModal = require('../agro_inputs/products.modal');

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
    //   const ProdAgents = await ProductAgent.find().

    // const prods = await product_agentModel.

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
      //   .populate({
      //     path: 'manufacture',
      //     populate: [{ path: 'role', select: 'name' }],
      //   })
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
        res.status(200).json(updatedProductAgent);
      },
      { new: true }
    ).exec();
  },
  /** Endpoint to associate product agent to the manufacturer
   *  It adds entries to two models, manufacturer model and product agent moodel
   */
  associateManufacturer: async (req, res, next) => {
    const { agentId, manufId } = req.params;
    await ProductAgent.findByIdAndUpdate(
      agentId,
      { $push: { manufacture: manufId } },
      { new: true, useFindAndModify: false }
    );
    await manufactureModel
      .findByIdAndUpdate(
        manufId,
        { $push: { productAgent: agentId } },
        { new: true, useFindAndModify: false }
      )
      .then((data) => {
        console.log(data);
        res.status(200).json();
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json(error);
      });
  },
  addManufactureToProductAgent: async (req, res) => {
    // const manufacture = req.body;
    console.log(req.body);
    console.log(req.params);
    // const productAgent = await ProductAgent.findByIdAndUpdate(
    //   req.productAgentId,
    //   {
    //     $push: {
    //       productAgent: {
    //         $each: manufacture,
    //       },
    //     },
    //   },
    //   // eslint-disable-next-line comma-dangle
    //   { new: true }
    // ).exec();
    // res.status(201).json(productAgent);
  },
  assignAdmin: async (req, res, next) => {
    const { companyId, adminId } = req.params;
    console.log(companyId);
    console.log(adminId);

    await ProductAgent.findByIdAndUpdate(
      companyId,
      { admin: adminId },
      // eslint-disable-next-line comma-dangle
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
  assignProductsRange: async (req, res) => {
    try {
      console.log(req.body);
      const { productsRange, manCompanyId } = req.body;
      const { companyId } = req.params;
      //   console.log(companyId);
      // agentCompanyID
      // manCompanyID
      //   let ls = await ProductAgent.find({ _id: companyId });
      //   console.log(ls);
      //   console.log(productsRange);
      await ProductAgent.updateOne(
        { _id: companyId },
        {
          $push: {
            productsRange: { ...productsRange, manufacture: manCompanyId },
          },
        }
      );

      // START MARKING PRODUCT TOKEN AS ASSIGNED TO AGENTS
      const increment = alphanuminc.increment;
      let currentProduct = productsRange.from;
      let to = increment(productsRange.to).toUpperCase();
      //   console.log(currentProduct);
      //   console.log(to);

      while (currentProduct !== to) {
        await ProductsModal.updateOne(
          { token: currentProduct },
          { assignedToAgent: true }
        );
        currentProduct = increment(currentProduct).toUpperCase();
      }
      //   END MARKING PRODUCT TOKEN AS ASSIGNED TO AGENTS
      return res.status(200).json();
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  assignedProducts: async (req, res) => {
    try {
      const prods = req.body;
      console.log(req.query);
      const { manCompanyId } = req.query;
      console.log(manCompanyId);
      let data = await ProductAgent.findOne(
        {
          _id: req.params.companyId,
          'productsRange.manufacture': manCompanyId,
        },
        'productsRange'
      );
      console.log(data);
      return res.status(200).json(data);
    } catch (error) {}
  },
};
