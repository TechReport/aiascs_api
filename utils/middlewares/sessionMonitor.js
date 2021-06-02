const jwt = require('jsonwebtoken');
const UserModel = require('../../src/users/user.modal');
const UserController = require('../../src/users/user.controller');

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

module.exports = async function validateToken(req, res, next) {
  console.log('enter sesssioin monitor');
  // Check if the Authorization Header is present
  if (typeof req.headers.authorization === 'undefined') {
    return res.status(401).json({
      message: 'Authentication error',
      developerMessage: 'Authorization type not specified',
    });
  }

  // Obtain and verify the copy of token from Authorization Header
  const token = req.headers.authorization.split(' ')[1];
  console.log('token', token);
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err)
      return res.status(401).json({
        message: 'Authentication error',
        developerMessage: err.message,
      });

    try {
      const userToAuth = await UserModel.findById(
        decoded.id,
        'token role'
      ).populate('role', 'genericName');
      //   console.log(userToAuth);

      //   If userToAuth is null or if userToAuth exists and the tokens aint equal
      if (!userToAuth || (userToAuth && userToAuth.token !== token))
        return res.status(401).json({
          message: 'Authentication error',
          developerMessage: 'invalid token',
        });

      console.log('userToAuth', userToAuth);

      //   if (userToAuth && userToAuth.token !== token) {
      //     return res.status(401).json({
      //       message: 'Authentication error',
      //       developerMessage: `Token mismatch:::: ${token}}`,
      //     });
      //   }

      req.body.userId = decoded.id;
      req.body.roleId = decoded.roleId;
      req.body.roleGenericName = userToAuth.role.genericName;

      //   if (decoded.accept === 'resetPassword') {
      //     return UserController.resetPassword(req, res);
      //   }

      next();
    } catch (err) {
      console.log('err', err);
      return res.status(401).json({
        message: 'Authentication error',
        developerMessage: err.message,
      });
    }
  });
};

// Query authToken stored in db, issued when user logged in
// const authToken = await (
//     await UserModel.findById(decoded.id, '+authToken authToken tokenStatus')
//     // await UserModel.findOne({ _id: decoded.id, tokenStatus: 1 }, '+authToken authToken tokenStatus')
// ).authToken;

// Check if the two tokens match
// if (authToken !== token) {
//     return res.status(401).json({
//         // status: false,
//         // category: 'unauthorized',
//         message: 'Authentication error',
//         developerMessage: `Token mismatch:::: ${token}}`,
//         // stack: '',
//         // src: 'sessionCheck',
//     });
// }

// Pass userId and roleId to body object
// req.body.userId = decoded.id;
// req.body.roleId = decoded.roleId;
// next();

// } catch (err) {
//     return res.status(401).json({
//         // status: false,
//         // category: 'unauthorized',
//         message: 'Authentication error',
//         developerMessage: err.message,
//         // stack: err,
//         // src: 'sessionCheck',
//     });
// }
//     });
// };
