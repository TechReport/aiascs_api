// const User = require('../../src/users/user.modal');
const Role = require('../../src/access_control/roles.model');

module.exports = function checkPermision(moduleName, resource) {
    return async function (req, res, next) {
        const role = await Role.findById(req.body.roleId, 'genericName permissions').populate('permissions', 'moduleName genericName -_id')
        let hasAccess = false;
        role.permissions.forEach(permission => {
            if (permission.moduleName === moduleName) {
                role.permissions.forEach(permission => {
                    if (permission.genericName === resource) {
                        hasAccess = true;
                    }
                });
            }
        });
        if (hasAccess) {
            req.body.roleName = role.genericName
            next();
        } else {
            return res.status(403).json({ status: hasAccess, developerMessage: "You don't have access to this route" });
        }

    }

    // console.log(moduleName)
    // console.log(resource)
    // return function (req, res, next) {
    //     if (role !== req.user.role) res.redirect('/')
    //     else next();
    // }
    // return async function (req, res, next) {
    //     console.log(req.body)
    //     console.log(req.params)

    //     next()
    // }
}


// module.exports = function checkPermission(moduleName, route) {
//     return async function (req, res, next) {
//         const user = await User.findOne({ _id: req.body.userId }).populate('role');
//         if (user.staffApprovalStatus === 0) {
//             return res.status(403)
//                 .json({ status: false, developerMessage: "Your account is not approved" });
//         } else if (user.role.approvalStatus === 0) {
//             return res.status(403)
//                 .json({ status: false, developerMessage: "Your role is not approved" });
//         }
//         const permissions = await RolePermissions.find({ role: req.user.role }).populate("permission");
//         let hasAccess = false;
//         permissions.forEach(permission => {
//             if (permission.permission.moduleName === moduleName) {
//                 permissions.forEach(permission => {
//                     if (permission.permission.genericName === route) {
//                         hasAccess = true;
//                     }
//                 });
//             }
//         });
//         if (hasAccess) {
//             next();
//         } else {
//             return res.status(403).json({ status: hasAccess, developerMessage: "You don't have access to this route" });
//         }
//     }
// }