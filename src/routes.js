const AccessRoutes = require('./access_control/access_controller.routes')
const ProductRoutes = require('./agro_inputs/products.routes')
const UserRoutes = require('./users/user.routes')

module.exports = (app) => {
    app.use("/", (req, res) => {
        return res.redirect("https://youthful-curie-26e419.netlify.app/");
    })
    app.use('/api/v1/user', UserRoutes)
    app.use('/api/v1/acc', AccessRoutes)
    app.use('/api/v1/products', ProductRoutes)
    app.use('/user', UserRoutes)
    app.use('/acc', AccessRoutes)
    app.use('/products', ProductRoutes)
}