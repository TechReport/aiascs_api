const mongoose = require("mongoose");
const Manufacture = require("../manufacturer/manufacture.model");
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
unique:true,
required:true
},
email:{
type:String,
required:true ,
unique:true,
match: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please enter a valid email'],
 

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
        ref: 'manufacture',
  
    }
]


});

productAgent.pre("save",function(next){
    if(true)
    {
        next();
    }
    next (new Error("Enter valid Email"));
});



productAgent.post("remove",async (doc,next)=>{
_.forEach(doc.manufacture,(singlemanufactureDoc)=>{
await Manufacture.findOneAndUpdate({_id:singlemanufactureDoc._id},{$pullAll:{productAgent:[doc._id]}});

}).exec();

next();

});




module.exports = mongoose.model("productAgent",productAgent);