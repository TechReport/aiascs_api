const Role = require('../../src/access_control/roles.model')
const Permission = require('../../src/access_control/permission.model')
const Users = require('../../src/users/user.modal')
const { createNewPermission, createNewRole } = require('../../src/access_control/access_controller.controller')
const { registerUser } = require('../../src/users/user.controller')
const permissionList = require('./permissionList')

module.exports = {
    init: async () => {
        const userCount = await Users.countDocuments()

        console.log('Seed check...')
        if (userCount === 0) {
            await module.exports.seedPermissions()

            await module.exports.seedRoles()

            await module.exports.seedAdministrator()
        }
        console.log('Seed check done ###')
    },
    seedPermissions: async () => {
        try {
            const count = await Permission.countDocuments();
            if (count === 0) {
                await createNewPermission(permissionList)
                console.log('seed permissions done')
            }
        } catch (e) {
            return {
                developerMessage: e.message
            };
        }
    },
    seedRoles: async () => {
        const roleCount = await Role.find().countDocuments();
        if (roleCount === 0) {
            console.log('seed roles start')
            const roles = [
                {
                    name: 'Administrator',
                    description: 'Role for an Admin',
                    type: 1,
                    approvalStatus: 1,
                    permissions: (await Permission.find({}, '_id')).map(item => item._id)
                },
                {
                    name: 'Operation Personnel',
                    description: 'Role for the operation personnel',
                    type: 1,
                    approvalStatus: 1,
                    permissions: []
                },
            ]
            roles.forEach(async role => {
                await createNewRole(role)
            })
            console.log('seed roles end')
        }
    },
    seedAdministrator: async () => {
        try {
            console.log('seed staff here')
            const admin = {
                firstName: 'Root',
                lastName: 'Admin',
                email: 'root@aiascsadmin.com',
                phoneNumber: '255713000000',
                gender: 'male',
                role: (await Role.findOne({ name: 'Administrator' }).select('_id'))._id
            }
            await registerUser(admin)
            console.log('seed staff done')
            return true
        } catch (e) {
            return {
                developerMessage: e.message
            };
        }
    },

    seedSettings: async () => {
        const settingsCount = await Settings.find().countDocuments();
        // console.log(settingsCount)
        if (settingsCount === 0) {
            console.log('seeding settings start')
            const settings = [
                { name: 'idleTime', value: 1000 * 60 * 5, description: 'minimum value to logout user upon being idle' },
                { name: 'fundAprovers', value: 1, description: 'minimum number of fund aprovers to aprove a request' },
                { name: 'notificationAutoDelete', value: 1000 * 60 * 60 * 24 * 14, description: 'minimum number of fund aprovers to aprove a request' },
            ]
            settings.forEach(async settingsValue => {
                await Settings.create(settingsValue)
            })
            console.log('seeding settings end')
        }
    },
    seedNotificationSubscribers: async () => {
        // const Subs = [{title:'new_request', role:}]
    },
}