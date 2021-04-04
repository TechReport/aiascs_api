const jwt = require('jsonwebtoken')
const UserModel = require('../../src/users/user.modal')
// root@aiascsadmin.com

module.exports = async function validateToken(req, res, next) {
    console.log('SESSION CHECK START')

    if (typeof req.headers.authorization === 'undefined') {
        return res.status(401).json({
            status: false,
            category: 'unauthorized',
            message: `user not authorized`,
            developerMessage: 'Authorization type not specified',
            stack: '',
            src: 'sessionCheck'
        })
    }
    var token = req.headers.authorization.split(' ')[1]
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            return res.status(401).json({
                status: false,
                category: 'unauthorized',
                message: `session has expired`,
                developerMessage: err.message,
                stack: err,
                src: 'sessionCheck'
            })
        }
        let authToken = await (await UserModel.findById(decoded.id, '+authToken authToken')).authToken

        if (authToken !== token) {
            return res.status(401).json({
                status: false,
                category: 'unauthorized',
                message: `user is not authorized`,
                developerMessage: `Token mismatch:::: ${token}}`,
                stack: '',
                src: 'sessionCheck'
            })
        }
        req.body.userId = decoded.id
        req.body.roleId = decoded.roleId
        req.body.companyId = decoded.companyId
        console.log('SESSION CHECK COMPLETED')
        next()
    })
}

// module.exports = { validateToken }