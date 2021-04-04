const express = require("express");
const app = express();
const morgan = require("morgan");
const { urlencoded, json } = require("body-parser");
const cors = require("cors");
const routes = require('./src/routes')
const seeder = require('./utils/seeder')
require('dotenv').config()


app.use(cors());
app.use(morgan('dev'));
app.use(urlencoded({ extended: true }));
app.use(json());

// Set app routes
routes(app)

// Seed Initial Data
seeder.init()


// INITIALIZE CRON JOB
const cron = require('./utils/cronjobs/qrcode.cron')



//general app middelare for handle errors
app.use((err, req, res, next) => {
  console.log('object')

  if (err) {
    return res.status(500).json({
      userMessage: 'Whoops! Something went wrong.',
      developerMessage: err.message
    })
  }
});

module.exports = app;