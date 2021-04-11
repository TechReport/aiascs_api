const Roles = require('./roles.model')
const Permission = require('./permission.model')

// const RolePermission = require('./role_permission.model')
// const User = require('../users/user.model')
// const mongoose = require('mongoose')


async function createNewRole({ name, description, permissions, type = 0, approvalStatus = 0 }) {
    try {
        const role = await Roles.create({
            name,
            description,
            permissions,
            approvalStatus,
            type
        });

        return role

    } catch (error) {
        throw error
    }
}



module.exports = {
    createNewRole,
    createNewPermission: async (permissions) => {
        await Permission.insertMany(permissions)
            .then(res => res)
            .catch(err => {
                throw err
            })
    },
    createRole: async (req, res) => {
        try {
            const {
                name,
                description,
                permissions
            } = req.body;

            const role = await createNewRole(name, description, permissions)
            return res.status(201).json({
                data: role,
                message: 'role created successfully'
            })
        } catch (e) {
            console.log(e)
            return res.status(500).json({
                developerMessage: e.message
            });
        }
    },
    getRoles: async (req, res) => {
        try {
            console.log(req.query)
            const roles = await Roles.find({}).select(req.query.select);
            return res.status(201).json({
                data: roles,
                message: 'roles list'
            })
        } catch (e) {
            console.log(e)
            return res.status(500).json({
                message: 'Unexpected Error occured',
                developerMessage: e.message,
                stack: e
            });
        }
    },
    getPermission: async (req, res) => {
        try {

            const permissions = await Permission.find({});

            return res.status(201).json({
                data: permissions,
                message: 'permission list'
            })
        } catch (e) {
            console.log(e)
            return res.status(500).json({
                developerMessage: e.message
            });
        }
    },
    checkSession: async (req, res) => {
        try {
            if (req.body.userId) {
                return res.status(201).json({
                    status: true,
                    category: 'authorized',
                    message: 'User is authorized'
                })
            } else {
                return res.status(401).json({
                    status: false,
                    category: 'unauthorized',
                    message: 'User is not authorized'
                })
            }
        } catch (error) {
            return res.status(401).json({
                status: false,
                category: 'unauthorized',
                message: `user is not authorized`,
                developerMessage: error.message,
                stack: error
            })
        }

        // console.log(auth)
    },
    //     updateRole: async (req, res) => {
    //         try {
    //             var query = {
    //                 "_id": req.params.id
    //             };
    //             var update = {
    //                 "name": req.body.name,
    //                 "description": req.body.description
    //             };
    //             var options = {
    //                 new: true
    //             };
    //             const role = await Role.findOneAndUpdate(query, update, options);
    //             // await logEvent({ request: req, action: `${req.user.displayName} Updated role ${role.name}`, item: role });
    //             // res.ok(role);
    //         } catch (e) {
    //             return res.status(HTTPStatus.BAD_REQUEST).json({
    //                 developerMessage: e.message
    //             });
    //         }
    //     },
    //     getRoles: async (req, res) => {
    //         try {
    //             var roles;
    //             if (typeof req.params.id === 'undefined') {
    //                 roles = await Role.aggregate([{
    //                     $match: {
    //                         "name": { $ne: "Root" },
    //                     },
    //                 },
    //                 {
    //                     $lookup: {
    //                         from: "rolepermissions",
    //                         localField: "_id",
    //                         foreignField: "role",
    //                         as: "rolePermissions"
    //                     }
    //                 },
    //                 {
    //                     $lookup: {
    //                         from: "permissions",
    //                         localField: "rolePermissions.permission",
    //                         foreignField: "_id",
    //                         as: "rolePermissions.permissions",
    //                     }
    //                 }
    //                 ]);
    //             } else {
    //                 console.log('get roles by roleid')
    //                 roles = (await Role.findById(req.params.id, 'permission')).permission
    //             }
    //             return res.status(201).json({
    //                 data: roles,
    //                 message: 'role list'
    //             })
    //         } catch (e) {
    //             console.log(e)
    //             return res.status(500).json({
    //                 developerMessage: e.message
    //             });
    //         }
    //     },
    //     updatePermission: async (req, res) => {
    //         try {
    //             const permission = await Permission.create(req.body.data)
    //             return res.status(201).json({
    //                 data: permission,
    //                 message: 'Permission created!!'
    //             })
    //         } catch (e) {
    //             console.log(e)
    //             return res.status(500).json({
    //                 developerMessage: e.message
    //             });
    //         }
    //     },
    //     getPermission: async (req, res) => {
    //         try {

    //             const permissions = await Permission.find({});

    //             return res.status(201).json({
    //                 data: permissions,
    //                 message: 'permission list'
    //             })
    //         } catch (e) {
    //             console.log(e)
    //             return res.status(500).json({
    //                 developerMessage: e.message
    //             });
    //         }
    //     },
    //     getRolesPermission: async (req, res) => {
    //         try {
    //             console.log('get roles permission')
    //             console.log(req.params)

    //             // const permissions = await Permission.find({});
    //             const rolePermissions = await Role.findOne({ role: req.params.role }, '_id')
    //             // .populate('modules.module', 'moduleName permissions')
    //             // .populate('modules.permissions.permissionId')
    //             // .populate('permissions.permissions.permissionId')
    //             console.log(rolePermissions)

    //             return res.status(201).json({
    //                 data: rolePermissions,
    //                 message: 'permission list'
    //             })
    //         } catch (e) {
    //             console.log(e)
    //             return res.status(500).json({
    //                 developerMessage: e.message
    //             });
    //         }
    //     },
    //     updateRolesPermission: async (req, res) => {
    //         try {
    //             console.log(req.body)
    //             console.log(req.params)
    //             // console.log(req.body)
    //             // const { module, permission } = req.body
    //             // const role = req.params.role

    //             // console.log(module)
    //             // console.log(permission)
    //             // console.log(role)
    //             const updatedRole = await Role.findByIdAndUpdate(req.params.role, { $set: { permission: req.body.permissions } }, { new: true, useFindAndModify: false },)
    //             // console.log(req.params.role)
    //             // const updatedRole = await Role.findByIdAndUpdate({ role: req.params.role })
    //             console.log(updatedRole)
    //             // data.modules.forEach(async module => {
    //             //     console.log(module)
    //             // })

    //             // console.log(req.query)

    //             console.log('update roles permission')
    //             return res.status(201).json({
    //                 data: updatedRole.permission,
    //                 message: 'role updated successfully'
    //             })
    //         } catch (e) {
    //             console.log(e)
    //             return res.status(500).json({
    //                 developerMessage: e.message
    //             });
    //         }
    //     },
    //     rolePermission: async (req, res) => {
    //         const body = req.bod;
    //         try {
    //             const {
    //                 role,
    //                 permissions
    //             } = req.body;
    //             // if (role.toString() === req.user.role.toString()) {
    //             //     return res.status(HTTPStatus.FORBIDDEN).json({
    //             //         userMessage: "Admin can't self-assign permissions",
    //             //         developerMessage: "Admin can't self-assign permissions."
    //             //     });
    //             // }
    //             const query = {
    //                 _id: role
    //             };
    //             const update = {
    //                 approvalStatus: 0
    //             };
    //             const options = {
    //                 new: true
    //             };
    //             const updatedRole = await Role.findOneAndUpdate(query, update, options);
    //             // const removed = await unassignRolePermission(role, permissions.removed);
    //             const rolePermissions = await assignRolePermission(role, permissions.added);
    //             // await logEvent({ request: req, action: `${req.user.displayName} Changed permissions of role ${updatedRole.name}`, item: updatedRole });
    //             if (rolePermissions.status) {
    //                 return res.status(200).json(rolePermissions);
    //             } else {
    //                 return res.status(HTTPStatus.BAD_REQUEST).json(rolePermissions);
    //             }

    //         } catch (e) {
    //             console.log(e.message);
    //             return res.status(HTTPStatus.BAD_REQUEST).json({
    //                 userMessage: e.message,
    //                 developerMessage: e.message
    //             });
    //         }
    //     },
    //     getStaffByRoleID: async (req, res) => {
    //         try {
    //             const staffs = await User.find({
    //                 role: req.params.id
    //             });
    //             res.ok(staffs);
    //         } catch (e) {
    //             return res.status(HTTPStatus.BAD_REQUEST).json({
    //                 developerMessage: e.message
    //             });
    //         }
    //     },
    //     deleteRole: async (req, res) => {
    //         try {
    //             console.log('delete role')
    //             const roleUsedCount = await User.find({ roleId: req.params.id }).countDocuments();
    //             console.log(roleUsedCount)

    //             if (roleUsedCount != 0) {
    //                 return res.status(401).json({
    //                     data: {},
    //                     userMessage: `Cant delete Role. It is being used ${roleUsedCount} times`
    //                 })
    //             }
    //             const role = await Role.findOneAndDelete({
    //                 _id: req.params.id, type: 0
    //             });
    //             // await logEvent({ request: req, action: `${req.user.displayName} Deleted role ${role.name}`, item: role });
    //             // res.ok(role);
    //             return res.status(201).json({
    //                 data: role,
    //                 message: 'role list'
    //             })
    //         } catch (e) {
    //             console.log(e)
    //             return res.status(500).json({
    //                 developerMessage: e.message
    //             });
    //         }
    //     },
    //     approveRole: async (req, res) => {
    //         try {
    //             const query = {
    //                 _id: req.params.id
    //             };
    //             const update = {
    //                 approvalStatus: 1
    //             };
    //             const options = {
    //                 new: true
    //             };
    //             const role = await Role.findOneAndUpdate(query, update, options);

    //             // await logEvent({ request: req, action: `${req.user.displayName} Approved role ${role.name}`, item: role });
    //             // return res.ok(role);
    //         } catch (e) {
    //             return res.status(HTTPStatus.BAD_REQUEST).json({
    //                 developerMessage: e.message
    //             });
    //         }
    //     }
    // }

    // // export async function createRole(req, res) {
    // //     try {
    // //         const {
    // //             name,
    // //             description,
    // //             permissions
    // //         } = req.body;
    // //         const role = await Role.create({
    // //             name,
    // //             description
    // //         });
    // //         const rolePermissions = await assignRolePermission(role._id, permissions);
    // //         // await logEvent({ request: req, action: `${req.user.displayName} Created role ${role.name}`, item: role });
    // //         // res.ok(role);
    // //     } catch (e) {
    // //         return res.status(HTTPStatus.BAD_REQUEST).json({
    // //             developerMessage: e.message
    // //         });
    // //     }
    // // }

    // // export async function updateRole(req, res) {
    // //     try {
    // //         var query = {
    // //             "_id": req.params.id
    // //         };
    // //         var update = {
    // //             "name": req.body.name,
    // //             "description": req.body.description
    // //         };
    // //         var options = {
    // //             new: true
    // //         };
    // //         const role = await Role.findOneAndUpdate(query, update, options);
    // //         // await logEvent({ request: req, action: `${req.user.displayName} Updated role ${role.name}`, item: role });
    // //         // res.ok(role);
    // //     } catch (e) {
    // //         return res.status(HTTPStatus.BAD_REQUEST).json({
    // //             developerMessage: e.message
    // //         });
    // //     }
    // // }

    // async function assignRolePermission(roleID, permissions) {
    //     try {
    //         const makerCheckerStatus = await makerChecker(roleID, permissions);
    //         /* console.log(makerCheckerStatus.status); */
    //         if (!makerCheckerStatus.status) {
    //             return makerCheckerStatus;
    //         }
    //         for (let i = 0; i < permissions.length; i++) {
    //             const rolePermission = {
    //                 role: roleID,
    //                 permission: permissions[i]
    //             };
    //             const access = await RolePermission.create(rolePermission);
    //         }
    //         //subscribe user to notifications
    //         // const users = await getUsersByRoleID(roleID);
    //         // users.forEach(user => {
    //         //     automaticSubscription(user);
    //         // });
    //         return {
    //             status: true,
    //             message: "Assigned successfully"
    //         };
    //     } catch (e) {
    //         console.log('Nomaa', e.message);
    //         return {
    //             status: false,
    //             developerMessage: e.message
    //         };
    //     }
    // }

    // async function unassignRolePermission(roleID, permissions) {
    //     try {

    //         for (let i = 0; i < permissions.length; i++) {
    //             const rolePermission = {
    //                 role: roleID,
    //                 permission: permissions[i]
    //             };
    //             const access = await RolePermission.deleteOne(rolePermission);
    //             const permission = await Permission.findOne({ '_id': permissions[i] });
    //             //   const users = await getUsersByRoleID(roleID);
    //             //   users.forEach(user => {
    //             //     unsubscribeNotifications(user, permission.genericName);
    //             //   });
    //         }

    //         return {
    //             status: "success"
    //         };
    //     } catch (e) {
    //         return {
    //             developerMessage: e.message
    //         };
    //     }
}

// async function getPermissionByroleID(roleID) {
//     const permissions = await RolePermission.find({
//         role: roleID
//     }).populate('permission');
//     return permissions;
// }