const Roles = require('./roles.model');
const Permission = require('./permission.model');

// const RolePermission = require('./role_permission.model')
const User = require('../users/user.modal');
// const mongoose = require('mongoose')

async function createNewRole({
  name,
  description,
  permissions,
  genericName,
  type = 0,
  approvalStatus = 0,
  target,
}) {
  try {
    const role = await Roles.create({
      name,
      description,
      permissions,
      genericName,
      target,
      approvalStatus,
      type,
    });

    return role;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createNewRole,
  createNewPermission: async (permissions) => {
    await Permission.insertMany(permissions)
      .then((res) => res)
      .catch((err) => {
        throw err;
      });
  },
  createRole: async (req, res) => {
    try {
      const { name, description, permissions } = req.body;

      const role = await createNewRole(name, description, permissions);
      return res.status(201).json({
        data: role,
        message: 'role created successfully',
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        developerMessage: e.message,
      });
    }
  },
  getRoles: async (req, res) => {
    const { filter, select } = req.query;
    await Roles.find(JSON.parse(filter))
      .select(select)
      .then((roles) => res.json(roles))
      .catch((error) => {
        return res.status(500).json({
          message: error.message,
          developerMessage: error.message,
          stack: error,
        });
      });
  },
  getRolesByRole: async (req, res) => {
    let filter = '';
    switch (req.body.roleName) {
      case 'ROLE_SUPER_ADMIN':
        filter = [
          'ROLE_MANUFACTURING_COMPANY_ADMIN',
          'ROLE_QUALITY_CONTROLLER_ADMIN',
          'ROLE_SUPER_ADMIN',
        ];
        break;
      case 'ROLE_MANUFACTURING_COMPANY_ADMIN':
        filter = [
          'ROLE_OPERATION_PERSONNEL_MAN',
          'ROLE_MANUFACTURING_COMPANY_ADMIN',
        ];
        break;
      case 'ROLE_QUALITY_CONTROLLER_ADMIN':
        filter = [
          'ROLE_OPERATION_PERSONNEL_QC',
          'ROLE_QUALITY_CONTROLLER_ADMIN',
        ];
        break;
      default:
        break;
    }
    await Roles.find({ genericName: filter })
      .select(req.query.select)
      .then((roles) => {
        console.log(roles);
        res.json(roles);
      })
      .catch((error) => {
        return res.status(500).json({
          message: error.message,
          developerMessage: error.message,
          stack: error,
        });
      });
  },
  getPermission: async (req, res) => {
    try {
      const permissions = await Permission.find({});

      return res.status(201).json({
        data: permissions,
        message: 'permission list',
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        message: e.message,
        developerMessage: e.message,
      });
    }
  },
  checkSession: async (req, res) => {
    try {
      if (req.body.userId) {
        const user = await User.findById(req.body.userId).populate({
          path: 'role',
          populate: [
            { path: 'permissions', select: 'genericName moduleName -_id' },
          ],
        });
        return res.status(201).json({
          status: 'authorized',
          user,
        });
      } else {
        return res.status(401).json({
          status: 'unauthorized',
          message: 'User is not authorized',
        });
      }
    } catch (error) {
      return res.status(401).json({
        status: 'unauthorized',
        message: `user is not authorized`,
        developerMessage: error.message,
      });
    }
  },
};
