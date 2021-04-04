const AccessRoutes = require('./access_control/access_controller.routes')
const ProductRoutes = require('./agro_inputs/products.routes')
const UserRoutes = require('./users/user.routes')

module.exports = (app) => {
    app.use('/api/v1/user', UserRoutes)
    app.use('/api/v1/acc', AccessRoutes)
    app.use('/api/v1/products', ProductRoutes)
    // app.use('/route', middleware, <component routes>)
}