const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./user.modal');
const Roles = require('../access_control/roles.model')

async function registerUser(userInfo) {
    let user = new User(userInfo)
    user.password = bcrypt.hashSync(userInfo.lastName.toUpperCase(), 8)

    return await user.save()
        .then(response => response.toJSON())
        .catch(error => { throw error })
}

module.exports = {
    registerUser,
    login: async (req, res, next) => {
        try {
            // CHECK IF USER EXISTS
            let user = await User.findOne({ email: req.body.email }, '+password')
                .populate({
                    path: 'role',
                    populate: [
                        { path: 'permission', select: 'genericName moduleName' },
                    ],
                })
            if (!user)
                return res.status(401).json({
                    status: false,
                    category: 'unauthorized',
                    message: 'Invalid credentials',
                    developerMessage: '',
                    stack: ''
                })

            let passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

            if (!passwordIsValid) {
                return res.status(401).json({
                    status: false,
                    category: 'unauthorized',
                    message: 'Invalid credentials',
                    developerMessage: '',
                    stack: ''
                })
            }

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
            }

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
        await registerUser(req.body.newUser, next)
            .then(newUser => {
                delete newUser.password
                return res.status(200).json({
                    message: 'Account created successfully',
                    data: newUser,
                    developerMessage: ''
                })
            })
            .catch(error => {
                if (error.code === 11000) {
                    const target = Object.keys(error.keyValue)[0] === 'phoneNumber' ? 'Phone number' : 'Email address'
                    return next({
                        code: 400,
                        status: false,
                        category: 'invalidInput',
                        message: `${target} '${Object.values(error.keyValue)[0]}' is already associated with an account`,
                        // [email / phone number ] '[email / phone number]' is already  associated with an account
                        developerMessage: error.message,
                        stack: error
                    })
                }
                return next({
                    code: 500,
                    status: false,
                    message: error.message,
                    developerMessage: error.message,
                    stack: error
                })
            })
    },
    signOut: async (req, res) => {
        console.log('sign out')
        await User.updateOne({ _id: req.body.userId }, { authToken: '' }, { useFindAndModify: false })
            .then(() => res.status(200).json({}))
            .catch(err => {
                console.log(err)
                return err
            })
    },
    getAll: async (req, res) => {
        try {
            console.log('viewUser')
            console.log(req.query)
            const user = await User.find().populate('role', 'name')
                // .select('firstName lastName email phoneNumber role createdAt')
                // .populate('role', 'name')
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
    getUsersByRole: async (req, res, next) => {
        try {
            const { role, select } = req.query;

            const adminRole = await Roles.findOne(JSON.parse(role), '_id')
            console.log(adminRole)
            const user = await User.find({ role: adminRole._id }, select)
            // const user = await User.find({ 'role': adminRole._id })
            return res.status(200).json(user)
        } catch (err) {
            next(err)
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
};
