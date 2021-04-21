const AccessRoutes = require('./access_control/access_controller.routes');
const ProductRoutes = require('./agro_inputs/products.routes');
const UserRoutes = require('./users/user.routes');
const ManufactureRoutes = require('./manufacturer/manufacture.route');
const ProductAgentRoutes = require("../src/product_agent/product_agent.route");
const QualityControllerRoutes = require('./quality_controller/qualit_controller.routes');


module.exports = (app) => {

    app.use('/api/v1/user', UserRoutes)
    app.use('/api/v1/acc', AccessRoutes)
    app.use('/api/v1/products', ProductRoutes)
    app.use('/api/v1/qualitycontrollers', QualityControllerRoutes)
    app.use('/products', ProductRoutes)
    app.use('/api/v1/manufacture',ManufactureRoutes);
    app.use('/api/v1/productAgent',ProductAgentRoutes);
  
    app.use("/", (req, res) => {
        return res.redirect("https://youthful-curie-26e419.netlify.app/");
    })
}
