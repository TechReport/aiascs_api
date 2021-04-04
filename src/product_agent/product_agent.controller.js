const ProductAgent = require('./product_agent.model');

module.exports = {
  getProductAgentById:async (req, res, next) =>{
    let productAgent = await ProductAgent.findById(req.productAgentId).exec();
    if(typeof(productAgent) == undefined || productAgent.length <0)
    {
      next(new Error("No productAgent in database"));
    }
    res.status(200).json(productAgent);
    },
  
  getAllProductAgent :async (req, res, next) => {
  let productAgent = await   ProductAgent.find({}).
  sort('-createdAt').
  lean().
  exec();
  if(typeof(productAgent) == undefined || productAgent.length <0)
  {
    next(new Error("No ProductAgent in database"));
  }
  res.status(200).json(productAgent);
  },

  createProductAgent: async (req, res, next) => {
    const productAgents = await ProductAgent.create(req.body)
    res.status(201).json(productAgents.toJSON())
  },


  removeProductAgentId: (req, res, next) => {
    return ProductAgent.findByIdAndDelete(req.productAgentId).exec();
  },
  updateProductAgentById: (req, res, next) => {
    const update = req.body;
    return ProductAgent.findByIdAndUpdate(req.productAgentId, update, { new: true }).exec();
  },
  addManufactureToProductAgent: (req, res, next) => {
    const manufacture = req.body;
    return ProductAgent.findByIdAndUpdate( req.productAgentId,{
      $push:{
        productAgent:{
          $each:manufacture
        }
      }
    }, { new: true }).exec();
  },
};

