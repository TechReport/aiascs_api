// Be careful executing this function
const { dropPermissionCollection, dropRoleCollection, dropUsersCollection } = require('./terminate')

const exec = () => {
    try {
        console.log('START')
        dropPermissionCollection()
        dropRoleCollection()
        dropUsersCollection()
        console.log('DONE')
    } catch (error) {
        console.log(error)
    }
}

// exec()