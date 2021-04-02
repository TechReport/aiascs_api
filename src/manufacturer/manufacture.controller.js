const Manufacture = require('./manufacture.model');



module.exports = {
    getManufuctureById:(req,res,next)=>{
        return Manufacture.findById(req.manufactureId)
        .exec()
    },

    getAllManufacture: (req,res,next) => {
        return Manufacture.find({})
          .exec()
      },

      createManufacture: (req,res,next) => {
          let manufactureDetails = req.body;
        return Manufacture.create(manufactureDetails)
      },

      removeManufactureyId : (req,res,next) => {
          let id = req.params.id;
        return Manufacture.findByIdAndDelete(id).exec()
      },
      updateManufactureById :(req,res,next) => {
        let id = req.params.id;
        let update =req.body;        
        return Manufacture.findByIdAndUpdate(id, update, {new: true}).exec()
      }


}


