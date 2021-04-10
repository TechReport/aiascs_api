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
  }).populate("manufacture").
  sort('-createdAt').
  lean().
  exec();
  },

  createProductAgent: async (req, res, next) => {
    const productAgents = await ProductAgent.create(req.body)
    res.status(201).json(productAgents.toJSON())
  },


  removeProductAgentId: async (req, res, next) => {
   await  ProductAgent.findByIdAndDelete(req.productAgentId).exec();
   res.status(202).json({
    "message":"sucess fully deleted"
   });
  },
  updateProductAgentById:async (req, res, next) => {
    const update = req.body;
    return await ProductAgent.findByIdAndUpdate(req.productAgentId, update, { new: true },(error,updatedProductAgent)=>{
      if(error)
      {
        next(error)
      }
      res.status(204).json(updatedProductAgent);
    }, { new: true }).exec();
  },
  addManufactureToProductAgent:async (req, res, next) => {
    const manufacture = req.body;
    let productAgent = await ProductAgent.findByIdAndUpdate( req.productAgentId,{
      $push:{
        productAgent:{
          $each:manufacture
        }
      }
    }, { new: true }).exec();
    res.status(201).json(productAgent);
  },
};

