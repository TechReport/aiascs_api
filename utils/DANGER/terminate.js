const mongoose = require('mongoose')

module.exports = {
    dropUsersCollection: () => {
        mongoose.connection.collections['users']
            .drop(() => {
                console.log('collection dropped successfully')
            })
    },
    dropRoleCollection: () => {
        mongoose.connection.collections['roles']
            .drop(() => {
                console.log('collection dropped successfully')
            })
    },
    dropPermissionCollection: () => {
        mongoose.connection.collections['permissions']
            .drop(() => {
                console.log('collection dropped successfully')
            })
    }
}