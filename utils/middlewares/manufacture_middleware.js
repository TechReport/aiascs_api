


module.exports ={


 getId: (req, res, next) => {
   req.manufactureId = req.params.id;
   next()
 }


}