const jwt = require('jsonwebtoken');
const UserModel = require('../../src/users/user.modal');

/**
 * *** Parameters are issued by express middleware ***
 * @param {any} req http request object
 * @param {any} res http response object
 * @callback next callback by express  
 * 
 * @returns {object} {userId} and {roleId} in req.body
 * 
 * @example
 * // Access the passed parameters as follows 
 * const userId = req.body.userId;
 * const userRoleId = req.body.roleId;
 * 
 */

module.exports = async function resetPasswordValidator(req, res, next) {

    // Check if the Authorization Header is present
    if (typeof req.headers.authorization === 'undefined') {
        return res.status(401).json({
            status: false,
            category: 'unauthorized',
            message: 'user not authorized',
            developerMessage: 'Authorization type not specified',
            stack: '',
            src: 'sessionCheck',
        });
    }

    // Obtain and verifyy the copy of token from Authorization Header
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            return res.status(401).json({
                status: false,
                category: 'unauthorized',
                message: 'user not authorized',
                developerMessage: err.message,
                stack: err,
                src: 'sessionCheck',
            });
        }
        try {
            // Query authToken stored in db, issued when user logged in
            const authToken = await (
                // await UserModel.findById(decoded.id, '+authToken authToken tokenStatus')
                await UserModel.findOne({ _id: decoded.id, tokenStatus: 0 }, '+authToken authToken tokenStatus')
            ).authToken;

            // Check if the two tokens match
            if (authToken !== token) {
                return res.status(401).json({
                    status: false,
                    category: 'unauthorized',
                    message: 'user is not authorized',
                    developerMessage: `Token mismatch:::: ${token}}`,
                    stack: '',
                    src: 'sessionCheck',
                });
            }

            // Pass userId and roleId to body object
            req.body.userId = decoded.id;
            req.body.roleId = decoded.roleId;
            next();

        } catch (err) {
            return res.status(401).json({
                status: false,
                category: 'unauthorized',
                message: 'user not authorized',
                developerMessage: err.message,
                stack: err,
                src: 'sessionCheck',
            });
        }
    });
};