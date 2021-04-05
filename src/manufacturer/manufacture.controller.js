const { isNull } = require('lodash');
const Manufacture = require('./manufacture.model');

module.exports = {
  getManufuctureById:async (req, res, next) =>{
  - await Manufacture.findById(req.manufactureId,(error,doc)=>{
      if(error)
      {
        next(error)
      }
    res.status(200).json(doc);
    }).exec();
     

    },
  
  getAllManufacture :async (req, res, next) => {
  await   Manufacture.find({},(error,doc)=>{
    if(error)
    {
      next(error)
    }
  res.status(200).json(doc);
  }).
  sort('-createdAt').
  lean().
  exec();
 
  },

  createManufacture: async (req, res, next) => {
    const manufactures = await Manufacture.create(req.body)
    res.status(201).json(manufactures.toJSON())
  },


  removeManufactureyId: async (req, res, next) => {
   await Manufacture.findByIdAndDelete(req.manufactureId).exec();
   res.status(202).json({
    "message":"sucess fully deleted"
   });
  },
  updateManufactureById: (req, res, next) => {
    const update = req.body;
    return Manufacture.findByIdAndUpdate(req.manufactureId, update, { new: true },(error,doc)=>{
      res.status(204).json({
        "message":"sucess fully updated"
       })
    }).exec();
  },
  addProductAgentToManufacture: (req, res, next) => {
    const productAgents = req.body;
    return Manufacture.findByIdAndUpdate( req.manufactureId,{
      $push:{
        productAgent:{
          $each:productAgents
        }
      }
    }, { new: true }).exec();
  },
};

