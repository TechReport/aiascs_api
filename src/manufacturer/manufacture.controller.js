const Manufacture = require('./manufacture.model');

module.exports = {
  getManufuctureById:async (req, res, next) =>{
    let manufacture = await Manufacture.findById(req.manufactureId).exec();
    if(typeof(manufacture) == undefined || manufacture.length <0)
    {
      next(new Error("No manufacture in database"));
    }
    res.status(200).json(manufacture);
    },
  
  getAllManufacture :async (req, res, next) => {
  let manufacture = await   Manufacture.find({}).
  sort('-createdAt').
  lean().
  exec();
  if(typeof(manufacture) == undefined || manufacture.length <0)
  {
    next(new Error("No manufacture in database"));
  }
  res.status(200).json(manufacture);
  },

  createManufacture: async (req, res, next) => {
    const manufactures = await Manufacture.create(req.body)
    res.status(201).json(manufactures.toJSON())
  },


  removeManufactureyId: (req, res, next) => {
    return Manufacture.findByIdAndDelete(req.manufactureId).exec();
  },
  updateManufactureById: (req, res, next) => {
    const update = req.body;
    return Manufacture.findByIdAndUpdate(req.manufactureId, update, { new: true }).exec();
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

