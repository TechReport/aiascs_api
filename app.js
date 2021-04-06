const express = require("express");
const { urlencoded, json } = require("body-parser");
const cors = require("cors");

const routes = require('./src/routes')
const seeder = require('./utils/seeder')
require('dotenv').config()


const app = express();

app.use(cors());

if (app.get('env') === 'production') {
  // app.use(logger('combined'));
} else {
  const logger = require("morgan");
  app.use(logger('dev'));
}

app.use(urlencoded({ extended: true }));
app.use(json());

// Set app routes
routes(app)

// Seed Initial Data
seeder.init()

// INITIALIZE CRON JOB
require('./utils/cronjobs/qrcode.cron')



//general app middelare for handle errors
app.use((err, req, res, next) => {
  if (err)
    return res.status(err.code ? err.code : 500).json(err)
});

module.exports = app;