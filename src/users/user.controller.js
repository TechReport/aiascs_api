const User = require('./user.modal')
const bcrypt = require('bcrypt')


async function registerUser({ firstName, lastName, email, phoneNumber, country, region, district, ward, gender, role }) {
    try {
        var user = new User({
            firstName, lastName,
            email, phoneNumber,
            country, region,
            district, ward,
            gender, role,
            password: bcrypt.hashSync(lastName.toUpperCase(), 8)
        })
        var newUser = await user.save()
        return newUser
    } catch (error) {
        console.log(error)
        throw error
    }
}


module.exports = {
    registerUser,
    login: async (req, res, next) => {
        try {
            console.log('login')
            res.status(200).json({ message: 'cool' })
        } catch (error) {

        }
    },
    register: async (req, res, next) => {
        try {
            console.log(req.body)
            var newUser = await registerUser(req.body.newUser)

            newUser = newUser.toObject()
            delete newUser.password

            return res.status(200).json({
                message: 'Account created successfully',
                data: newUser,
                developerMessage: ''
            })
        } catch (e) {
            console.log(e)
            console.log(e.code)
            if (e.code === 11000) {
                const target = Object.keys(e.keyValue)[0] === 'phoneNumber' ? 'Phone number' : 'Email address'
                console.log(Object.values(e.keyValue)[0])
                return res.status(400).json({
                    status: false,
                    category: 'invalidInput',
                    message: `${target} '${Object.values(e.keyValue)[0]}' is already associated with an account`,
                    // email '' is already  associated with ac account
                    // Phone Number '' is already  associated with ac account
                    developerMessage: e.message,
                    stack: e
                })
            }
            return res.status(500).json({
                status: false,
                message: e.message,
                developerMessage: e.message,
                stack: e
            })
        }
    }, getAll: async (req, res) => {
        try {
            console.log('viewUser')
            console.log(req.query)
            const user = await User.find().populate('roleId', 'name')
                .select('firstName lastName email phoneNumber role')
                .populate('role', 'name')
            return res.status(200).json({
                message: 'done',
                status: true,
                data: user
            })
        } catch (e) {
            return res.status(500).json({
                userMessage: 'Whoops! Something went wrong.',
                developerMessage: e.message
            })
        }
    }
}