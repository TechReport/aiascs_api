
const Role = require('../../src/access_control/roles.model');
const Permission = require('../../src/access_control/permission.model');
const Users = require('../../src/users/user.modal');
const Manufacture = require("../../src/manufacturer/manufacture.model");
const ProductAgent = require("../../src/product_agent/product_agent.model");

const {
    createNewPermission,
    createNewRole,
} = require('../../src/access_control/access_controller.controller');
const { registerUser } = require('../../src/users/user.controller');
const productsController = require('../../src/agro_inputs/products.controller');
const permissionList = require('./permissionList')


module.exports = {
    init: async () => {
        const userCount = await Users.countDocuments();

        console.log('Seed check...');
        if (userCount === 0) {
            await module.exports.seedPermissions();

            await module.exports.seedRoles();

            await module.exports.seedAdministrator();

        }
        await module.exports.manafuctureCompany();
        await module.exports.productAgent();
        console.log('Seed check done ###');
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
            console.log('seed roles start');
            const roles = [
                {
                    name: 'Super Admin',
                    description: 'Role for a Super Admin',
                    genericName:'ROLE_SUPER_ADMIN',
                    type: 1,
                    approvalStatus: 1,
                    permissions: (await Permission.find({}, '_id')).map(
                        (item) => item._id
                    ),
                },
                {
                    name: 'Manufacturer Admin',
                    description: 'Role for an Admin',
                    genericName:'ROLE_MANUFACTURING_COMPANY_ADMIN',
                    type: 1,
                    approvalStatus: 1,
                    permissions: (await Permission.find({}, '_id')).map(
                        (item) => item._id
                    ),
                },
                {
                    name: 'Q. C. Admin',
                    description: 'Role for a Quality Controller Admin',
                    genericName:'ROLE_QUALITY_CONTROLLER_ADMIN',
                    type: 1,
                    approvalStatus: 1,
                    permissions: (await Permission.find({}, '_id')).map(
                        (item) => item._id
                    ),
                },
                
                // {
                //     name: 'Operation Personnel',
                //     description: 'Role for the operation personnel',
                //     type: 1,
                //     genericName:'ROLE_OPERATION_PERSONNEL',
                //     approvalStatus: 1,
                //     permissions: [],
                // },
                // {
                //     name: 'Manufacturer',
                //     description: 'Role for the Manufacture',
                //     type: 1,
                //     genericName:'ROLE_OPERATION_MANUFACTURER',
                //     approvalStatus: 1,
                //     permissions: [],
                // },
            ];
            roles.forEach(async (role) => {
                await createNewRole(role);
            });
            console.log('seed roles end');
        }
    },
    seedAdministrator: async () => {
        try {
            console.log('seed staff here');
            const admin = {
                firstName: 'Root',
                lastName: 'Admin',
                email: 'root@aiascsadmin.com',
                phoneNumber: '255713000000',
                gender: 'male',
                role: (await Role.findOne({ genericName: 'ROLE_SUPER_ADMIN' }).select('_id'))._id,
            };
            await registerUser(admin);
            console.log('seed staff done');
            return true;
        } catch (e) {
            return {
                developerMessage: e.message,
            };
        }
    },

    // {
    //     name: 'Super Admin',
    //     description: 'Role for a Super Admin',
    //     genericName:'ROLE_SUPER_ADMIN',
    //     type: 1,
    //     approvalStatus: 1,
    //     permissions: (await Permission.find({}, '_id')).map(
    //         (item) => item._id
    //     ),
    // },
    // {
    //     name: 'Company Administrator',
    //     description: 'Role for the Manufacturing Company Administrator',
    //     genericName:'ROLE_MANUFACTURING_COMPANY_ADMIN',
    //     type: 1,
    //     approvalStatus: 1,
    //     permissions: (await Permission.find({}, '_id')).map(
    //         (item) => item._id
    //     ),
    // },
    // {
    //     name: 'Operation Personnel',
    //     description: 'Role for the operation personnel',
    //     type: 1,
    //     genericName:'ROLE_OPERATION_PERSONNEL',
    //     approvalStatus: 1,
    //     permissions: [],
    // },
    // {
    //     name: 'Manufacturer Personnel',
    //     description: 'Role for the Manufacture',
    //     type: 1,
    //     genericName:'ROLE_MANUFACTURER_OPERATOR',
    //     approvalStatus: 1,
    //     permissions: [],
    // },

    seedSettings: async () => {
        const settingsCount = await Settings.find().countDocuments();
        // console.log(settingsCount)
        if (settingsCount === 0) {
            console.log('seeding settings start');
            const settings = [
                {
                    name: 'idleTime',
                    value: 1000 * 60 * 5,
                    description: 'minimum value to logout user upon being idle',
                },
                {
                    name: 'fundAprovers',
                    value: 1,
                    description: 'minimum number of fund aprovers to aprove a request',
                },
                {
                    name: 'notificationAutoDelete',
                    value: 1000 * 60 * 60 * 24 * 14,
                    description: 'minimum number of fund aprovers to aprove a request',
                },
            ];
            settings.forEach(async (settingsValue) => {
                await Settings.create(settingsValue);
            });
            console.log('seeding settings end');
        }
    },
    seedNotificationSubscribers: async () => {
        // const Subs = [{title:'new_request', role:}]
    },
    manafuctureCompany: async () => {

        const manufacture = await Manufacture.find({}).exec();
        if (manufacture.length == 0) {
            const manafuctureCompanies = [
                {
                    regno: "0898393845",
                    name: "KILIPO POA",
                    phonenumber: 255623419226,
                    email: "kja@gmail.com",
                    location: {
                        country: "Tanzania",
                        district: "Kinondoni",
                        ward: "Sayansi"

                    }
                },
                {
                    regno: "0898091845",
                    name: "Seedco",
                    phonenumber: 295620419226,
                    email: "ka@gmail.com",
                    location: {
                        country: "Tanzania",
                        district: "Kinondoni",
                        ward: "Sayansi"

                    }
                },
                {
                    regno: "0898093805",
                    name: "AgroBot",
                    phonenumber: 255620419296,
                    email: "botTz@gmail.com",
                    location: {
                        country: "Tanznkaai",
                        district: "Kinondoni",

                    }
                }
            ];
            manafuctureCompanies.forEach(async (manufactureCompany) => {
                await Manufacture.create(manufactureCompany);
            })
        }
    },


    productAgent: async () => {

        const productAgents = await ProductAgent.find({}).exec();
        if (productAgents.length == 0) {
            const productAgnties = [
                {
                    regno: "08983343845",
                    name: "TFDA",
                    phonenumber: 655623419226,
                    email: "kj0a@gmail.com",
                    location: {
                        country: "Tanzania",
                        district: "Kinondoni",
                        ward: "Sayansi"

                    }
                },
                {
                    regno: "0892091845",
                    name: "BIRWARO Seed",
                    phonenumber: 295620410226,
                    email: "birraro@gmail.com",
                    location: {
                        country: "Tanzania",
                        district: "Kinondoni",
                        ward: "Sayansi"

                    }
                },
                {
                    regno: "0898093835",
                    name: "Swaswa Hill",
                    phonenumber: 255620410296,
                    email: "hillswalso@gmail.com",
                    location: {
                        country: "Tanznkaai",
                        district: "Kinondoni",

                    }
                }
            ];
            productAgnties.forEach(async (product_Agent) => {
                await ProductAgent.create(product_Agent);
            })
        }



    }

};
