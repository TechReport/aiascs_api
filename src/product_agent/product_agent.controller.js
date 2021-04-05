const ProductAgent = require('./product_agent.model');

module.exports = {
  getProductAgentById:async (req, res, next) =>{
 await ProductAgent.findById(req.productAgentId,(error,productAgent)=>{
      if(error)
      {
        next(error)
      }
    res.status(200).json(productAgent);
    }).exec();
    },
  
  getAllProductAgent :async (req, res, next) => {
 await   ProductAgent.find({},(error,productAgent)=>{
    if(error)
    {
      next(error)
    }
  res.status(200).json(productAgent);
  }).
  sort('-createdAt').
  lean().
  exec();
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

