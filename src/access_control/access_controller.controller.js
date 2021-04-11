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
    }
}