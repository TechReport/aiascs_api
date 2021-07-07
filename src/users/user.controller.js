/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
/* eslint-disable prettier/prettier */
/* eslint-disable semi */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./user.modal');
const Roles = require('../access_control/roles.model');

async function registerUser(userInfo) {
  let user = new User(userInfo);
  user.password = bcrypt.hashSync(userInfo.lastName.toUpperCase(), 8);

  return await user
    .save()
    .then((response) => response.toJSON())
    .catch((error) => {
      throw error;
    });
}

module.exports = {
  registerUser,
  login: async (req, res, next) => {
    try {
      // CHECK IF USER EXISTS
      let user = await User.findOne({ email: req.body.email }, '+password');
      if (!user)
        return res.status(406).json({
          message: 'Invalid credentials',
        });
      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(406).json({
          message: 'Invalid credentials',
        });
      }

      const displayName = user.firstName + ' ' + user.lastName;

      //   if (user.firstTimeLoginStatus === 0) {
      //     console.log('hi');
      //     let authToken = jwt.sign(
      //       {
      //         id: user._id,
      //         email: user.email,
      //         displayName,
      //         accept: 'resetPassword',
      //       },
      //       process.env.JWT_SECRET,
      //       { expiresIn: 20 * 60 }
      //     );
      //     const authenticatedUser = await User.findOneAndUpdate(
      //       { email: req.body.email },
      //       { token: authToken },
      //       { useFindAndModify: false, new: true }
      //     );

      //     return res.status(200).json({
      //       user: authenticatedUser,
      //       status: 'firstTimeLogin',
      //       message: 'First time login',
      //     });
      //   }

      // PREPARE USER AUTH TOKEN
      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
          displayName: displayName,
          roleId: user.role._id,
        },
        process.env.JWT_SECRET,
        { expiresIn: '2 days' }
      );

      // UPDATE USER AUTHTOKEN
      const authenticatedUser = await User.findOneAndUpdate(
        { email: req.body.email },
        { token },
        { useFindAndModify: false, new: true }
      )
        .populate('companyId')
        .populate({
          path: 'role',
          populate: [{ path: 'permission', select: 'genericName moduleName' }],
        });

      return res
        .status(200)
        .json({ user: authenticatedUser, status: 'authenticated' });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        message: 'Whoops! Something went wrong',
        developerMessage: e.message,
        stack: e,
      });
    }
  },
  register: async (req, res, next) => {
    await registerUser(req.body.newUser)
      .then((newUser) => {
        delete newUser.password;
        return res.status(200).json({
          message: 'Account created successfully',
          data: newUser,
          developerMessage: '',
        });
      })
      .catch((error) => {
        if (error.code === 11000) {
          const target =
            Object.keys(error.keyValue)[0] === 'phoneNumber'
              ? 'Phone number'
              : 'Email address';
          return next({
            code: 400,
            status: false,
            category: 'invalidInput',
            message: `${target} '${
              Object.values(error.keyValue)[0]
            }' is already associated with an account`,
            // [email / phone number ] '[email / phone number]' is already  associated with an account
            developerMessage: error.message,
            stack: error,
          });
        }
        return next({
          code: 500,
          status: false,
          message: error.message,
          developerMessage: error.message,
          stack: error,
        });
      });
  },
  updateUser: async (req, res) => {
    console.log(req.body);
    const update = req.body.userDetails;
    return await User.findByIdAndUpdate(
      req.params.userId,
      update,
      { new: true },
      (error, updatedUser) => {
        if (error) {
          return res.status(500).json({
            message: error.message,
            developerMessage: error.message,
            stack: error,
          });
        }
        res.status(200).json(updatedUser);
      },
      { new: true }
    )
      .populate('companyId', 'name')
      .populate('role', 'name')
      .exec();
  },
  signOut: async (req, res) => {
    console.log('sign out');
    await User.updateOne(
      { _id: req.body.userId },
      { authToken: '' },
      { useFindAndModify: false }
    )
      .then(() => res.status(200).json({}))
      .catch((err) => {
        console.log(err);
        return err;
      });
  },
  getAll: async (req, res) => {
    const { filter } = req.query;
    await User.find(JSON.parse(filter))
      .populate('role', 'name')
      .populate('companyId', 'name')
      .sort('-createdAt')
      .then((users) => res.status(200).json(users))
      .catch((err) => {
        return res.status(500).json({
          message: err.message,
          developerMessage: err.message,
          stack: err,
        });
      });
  },
  getById: async (req, res) => {
    await User.findById(req.params.id)
      .populate('role', 'name')
      .then((user) => res.status(200).json(user))
      .catch((err) => {
        return res.status(500).json({
          message: err.message,
          developerMessage: err.message,
          stack: err,
        });
      });
  },
  getUsersByRole: async (req, res, next) => {
    try {
      const { role, select, companyId } = req.query;
      console.log(req.query);
      const adminRole = await Roles.findOne(JSON.parse(role), '_id');
      const user = await User.find({ role: adminRole._id, companyId }, select);
      return res.status(200).json(user);
    } catch (err) {
      return res.status(500).json({
        message: err.message,
        developerMessage: err.message,
        stack: err,
      });
    }
  },
  getCompanyUserByRole: async (req, res) => {
    try {
      const { filter, select } = req.query;
      const { role, companyId } = JSON.parse(filter);
      const roleId = await Roles.findOne(role, '_id');
      const user = await User.find({ role: roleId._id, companyId }, select);
      return res.status(200).json(user);
    } catch (err) {
      return res.status(500).json({
        message: err.message,
        developerMessage: err.message,
        stack: err,
      });
    }
  },
  deleteUser: async (req, res) => {
    await User.deleteOne({ _id: req.params.userId }).exec();
    res.status(202).json({
      message: 'sucess fully deleted',
    });
  },
  resetPassword: async (req, res) => {
    try {
      const { password, userId } = req.body;
      let encryPassword = bcrypt.hashSync(password, 8);
      await User.updateOne(
        { _id: userId },
        { password: encryPassword, firstTimeLoginStatus: 1, token: '' }
      );
      res.status(201).json({
        message: 'you have successfully changed the password, Login to proceed',
        status: true,
        data: {},
      });
    } catch (err) {
      return res.status(500).json({
        message: err.message,
        developerMessage: err.message,
        stack: err,
      });
    }
  },
  changePassword: async (req, res) => {
    try {
      const { password, userId, newPassword, oldPassword } = req.body;
      console.log(req.body);

      let user = await User.findById(userId, 'password');
      let isPasswordCorrect = bcrypt.compareSync(oldPassword, user.password);

      if (isPasswordCorrect) {
        let encryPassword = bcrypt.hashSync(newPassword, 8);

        await User.updateOne({ _id: userId }, { password: encryPassword }).then(
          () =>
            res.status(201).json({
              message: 'Password Successfully changed',
            })
        );
      } else {
        return res.status(405).json({
          message: 'Password change failed. Password does not Match',
        });
      }
      //   res.status(201).json({
      //     message: 'Password Successfully changed',
      //   });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: err.message,
        developerMessage: err.message,
        stack: err,
      });
    }
  },
};
