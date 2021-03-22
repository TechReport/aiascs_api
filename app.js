const express = require("express");
const app =express();
const morgan =require("morgan");
const {urlencoded,json} = require("body-parser");
const cors =require("cors");
const qroc = require("./utils/qrcode_generator");

app.use(cors());
app.use(morgan('dev'));
app.use(urlencoded({extended:true}));
app.use(json());

// qroc("jhkjhfkdjf","kija")
///hare attache routes,middlware for rsourcess 
app.use('/aiascs',//rotest +middleware
);






//general app middelare for handle errors
app.use((err, req, res, next) => {
    if (err) {
      console.log(err);
    }
  });
  0
module.exports = app;