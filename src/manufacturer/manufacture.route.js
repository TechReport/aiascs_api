const Router = require('express')
const router = new Router();
const manufactureController = require("./manufacture.controller");



router.get('/:id',(req,res,next)=>{
    req.manufactureId = req.params.id;
},manufactureController.getManufuctureById);



module.exports = router;