const mongoose = require("mongoose");
const manufacture = require("../manufacturer/manufacture.model");
const _ = require("lodash");

const productAgent = new mongoose.Schema({
    regno:{
        type:String,
        unique:true,
        required:true
    },

name:{
    type:String,
    min:5,
    unique:true,
    required:true
},

phonenumber:{
type:Number,
max:12,
min:12,
unique:true,
required:true
},
email:{
type:String,
required:true
},

location:{
    country: String,
    district: String,
    ward: String,
},
createdAt:{
    type:Date,
    required:true,
    default:Date.now()
},

manufacture:[
    {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'manufacture',
  
    }
]


});

productAgent.pre("save",function(next){
    if((this.email).contain("@"))
    {
        next();
    }
    next (new Error("Enter valid Email"));
});



productAgent.post("remove",async (doc,next)=>{
_.forEach(doc.manufacture,(singlemanufactureDoc)=>{
await manufacture.findOneAndUpdate({_id:singlemanufactureDoc._id},{$pullAll:{productAgent:[doc._id]}});

}).exec();

next();

});




module.exports = mongoose.model("productAgent",productAgent);