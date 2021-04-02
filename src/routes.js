const AccessRoutes = require('./access_control/access_controller.routes')
const ProductRoutes = require('./agro_inputs/products.routes')
const UserRoutes = require('./users/user.routes')

module.exports = (app) => {
    app.use('/user', UserRoutes)
    app.use('/acc', AccessRoutes)
    app.use('/products', ProductRoutes)
    // app.use('/route', middleware, <component routes>)
}