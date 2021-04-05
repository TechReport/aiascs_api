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
    }).populate("productAgent"),exec();
     

    },
  
  getAllManufacture :async (req, res, next) => {
  await   Manufacture.find({},(error,doc)=>{
    if(error)
    {
      next(error)
    }
  res.status(200).json(doc);
  }).populate("productAgent").
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
    return Manufacture.findByIdAndUpdate(req.manufactureId, update, { new: true },(error,updatedManufacture)=>{
      if(error)
      {
        next(error)
      }
      res.status(204).json(updatedManufacture);
    },{ new: true }).exec();
  },
  addProductAgentToManufacture: (req, res, next) => {
    const productAgents = req.body;
    console.log(productAgents);
  let manufactures =  Manufacture.findByIdAndUpdate( req.manufactureId,{
      $push:{
        productAgent:{
          $each:productAgents
        }
      }
    } , { new: true }).exec();

    res.status(201).json(manufactures);
  },
};

