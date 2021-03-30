const express = require("express");
const app = express();
const morgan = require("morgan");
const { urlencoded, json } = require("body-parser");
const cors = require("cors");
require('dotenv').config()


app.use(cors());
app.use(morgan('dev'));
app.use(urlencoded({ extended: true }));
app.use(json());


///hare attache routes,middlware for rsourcess 
// app.use('/aiascs',//rotest +middleware
// );
const routes = require('./src/routes')
routes(app)


//init seeder
const seeder = require('./utils/seeder')
seeder.init()






//general app middelare for handle errors
app.use((err, req, res, next) => {
  if (err) {
    console.log('global', err);
  }
});
0
module.exports = app;