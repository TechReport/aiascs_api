const express = require('express');

const app = express();
const logger = require('morgan');
const { urlencoded, json } = require('body-parser');
const cors = require('cors');
const routes = require('./src/routes');
const seeder = require('./utils/seeder');

app.use(cors());
if (app.get('env') === 'production') {
  app.use(logger('combined'));
} else {
  app.use(logger('dev'));
}
app.use(urlencoded({ extended: true }));

app.use(json());
/// hare attache routes,middlware for rsourcess
routes(app);
// init seeder
seeder.init();

// general app middelare for handle errors
app.use((err, req, res, next) => {
  if (err) {
    console.log('global', err);
  }
});

module.exports = app;
