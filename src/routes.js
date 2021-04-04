const AccessRoutes = require('./access_control/access_controller.routes');
const ProductRoutes = require('./agro_inputs/products.routes');
const UserRoutes = require('./users/user.routes');
const ManufactureRoutes = require('./manufacturer/manufacture.route');
const ProductAgentRoutes = require("../src/product_agent/product_agent.route");


module.exports = (app) => {

  app.use('/user', UserRoutes);
  app.use('/acc', AccessRoutes);
  app.use('/products', ProductRoutes);
  app.use('/manufacture',ManufactureRoutes);
  app.use('/productAgent',ProductAgentRoutes);

};

