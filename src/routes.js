/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
const AccessRoutes = require('./access_control/access_controller.routes');
const ProductRoutes = require('./agro_inputs/products.routes');
const UserRoutes = require('./users/user.routes');
const ManufactureRoutes = require('./manufacturer/manufacture.route');
const ProductAgentRoutes = require('./product_agent/product_agent.route');
const QualityControllerRoutes = require('./quality_controller/qualit_controller.routes');
const FeedbackRoute = require('./feedbacks/feedback_route');
const ReportRoutes = require('./reports/reports.routes');
const LocationRoutes = require('./location/location.routes');
const notificationRoutes = require('./notifications/notification.routes');

module.exports = (app) => {
  app.use('/api/v1/user', UserRoutes);
  app.use('/api/v1/acc', AccessRoutes);
  app.use('/api/v1/products', ProductRoutes);
  app.use('/api/v1/qualitycontrollers', QualityControllerRoutes);
  app.use('/api/v1/manufacture', ManufactureRoutes);

  app.use('/api/v1/agents', ProductAgentRoutes);
  app.use('/api/v1/feedback', FeedbackRoute);
  app.use('/api/v1/reports', ReportRoutes);
  app.use('/api/v1/location', LocationRoutes);
  app.use('/api/v1/notifications', notificationRoutes);

  app.use('/', (req, res) =>
    // eslint-disable-next-line implicit-arrow-linebreak
    // eslint-disable-next-line comma-dangle
    res.redirect('https://youthful-curie-26e419.netlify.app/')
  );
};
