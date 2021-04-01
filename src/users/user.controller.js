const User = require('./user.modal')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

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
            let user = await User.findOne({ email: req.body.email }, '+password')
                .populate({
                    path: 'role',
                    populate: [
                        { path: 'permission', select: 'genericName moduleName' },
                    ],
                })

            if (!user) {
                return res.status(401).json({
                    status: false,
                    category: 'unauthorized',
                    message: 'Invalid credentials',
                    developerMessage: '',
                    stack: ''
                });
            } else {
                const pass = req.body.password.toUpperCase();
                let passwordIsValid = await bcrypt.compareSync(pass, user.password);
                console.log(passwordIsValid)
                if (!passwordIsValid) {
                    return res.status(401).json({
                        status: false,
                        category: 'unauthorized',
                        message: 'Invalid credentials',
                        developerMessage: '',
                        stack: ''
                    })
                }
                else {
                    const displayName = user.firstName + ' ' + user.lastName

                    if (user.firstTimeLoginStatus === 0) {
                        console.log('hi')
                        let tempToken = jwt.sign({ id: user._id, email: user.email, displayName: displayName }, process.env.JWT_SECRET, { expiresIn: 20 * 60 });
                        await User.updateOne({ email: req.body.email }, { authToken: tempToken }, { useFindAndModify: false })

                        return res.status(200).json({
                            data: {
                                tempToken,
                                target: 'firstTimeLoginStatus',
                            },
                            message: 'First time login',
                        })
                    } else {

                        // PREPARE USER AUTH TOKEN
                        const token = jwt.sign({ id: user._id, email: user.email, displayName: displayName, roleId: user.role._id }, process.env.JWT_SECRET, { expiresIn: 86400 });
                        // REMOVE PASSWORD FROM USER OBJECT, (dont return password to client)
                        let rawResponse = user.toObject()
                        delete rawResponse.password

                        // UPDATE USER AUTHTOKEN
                        await User.updateOne({ email: req.body.email }, { authToken: token }, { useFindAndModify: false })

                        return res.status(200).json({
                            message: "Logged in successfully",
                            data: {
                                target: 'authenticated',
                                token,
                                user: rawResponse
                            }
                        })
                    }
                }
            }
        } catch (e) {
            console.log(e)
            return res.status(500).json({
                status: false,
                category: 'fault',
                message: 'Whoops! Something went wrong',
                developerMessage: e.message,
                stack: e
            })
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
                .select('firstName lastName email phoneNumber role createdAt')
                .populate('role', 'name')
                .sort('-createdAt')
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
    },
    resetPassword: async (req, res) => {
        try {
            const { password, userId } = req.body
            let encryPassword = bcrypt.hashSync(password, 8);
            await User.updateOne({ _id: userId }, { password: encryPassword, firstTimeLoginStatus: 1, forgotPasswordToken: '' });
            res.status(201).json({
                message: 'you have successfully changed the password, Login to proceed',
                status: true,
                data: {}
            })
        } catch (e) {
            return res.status(500).json({
                userMessage: 'Whoops! Something went wrong.',
                developerMessage: e.message
            })
        }
    },
}