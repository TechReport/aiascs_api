


module.exports ={


    getId: (req, res, next) => {
      req.productAgentId = req.params.id;
      next()
    }
   
   
   }