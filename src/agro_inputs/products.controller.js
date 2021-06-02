/* eslint-disable no-param-reassign */
/* eslint-disable import/no-unresolved */
/* eslint-disable comma-dangle */
const Products = require('./products.modal');
const QRCodeModel = require('../qrCode/qrcode.model');
const QRCodeController = require('../qrCode/qrcode.controller');
const UnregisteredProducts = require('./unregisteredProducts.model');
const ManufacturerModel = require('../manufacturer/manufacture.model');

const qcModel = require('../quality_controller/quality_controller.modal');
const agentModel = require('../product_agent/product_agent.model');
const usersModel = require('../users/user.modal');

module.exports = {
  // eslint-disable-next-line consistent-return
  register: async (req, res) => {
    try {
      // eslint-disable-next-line no-inner-declarations
      async function saveProductData(qrcodeIds) {
        console.log('qrcodeIds', qrcodeIds);
        const productData = [];
        // eslint-disable-next-line no-plusplus
        for (
          let productIndex = 0;
          productIndex < req.body.newProduct.count;
          // eslint-disable-next-line no-plusplus
          productIndex++
        ) {
          productData.push({
            ...req.body.newProduct,
            qrcode: qrcodeIds[productIndex],
          });
        }
        // console.log('mark issued')
        qrcodeIds.forEach((id) => {
          QRCodeController.markIssued(id);
        });
        // console.log('this aint blocking')

        try {
          console.log('registering');
          const response = await Products.insertMany(productData, {
            rawResult: true,
          });
          return res.status(200).json({
            message: `'${response.insertedCount}' products have been created successfully`,
            data: {
              status: response.result.ok,
              productsCreatedCount: response.insertedCount,
              products: response.ops,
            },
          });
        } catch (error) {
          return res.status(500).json({
            message: error.message,
            developerMessage: error.message,
            stack: error,
          });
        }
      }
      const unusedQRCodes = await QRCodeModel.find({ status: 0 }, '_id', {
        limit: Number(req.body.newProduct.count),
      });
      if (unusedQRCodes.length < req.body.newProduct.count) {
        await QRCodeController.generateQRCode(
          req.body.newProduct.count - unusedQRCodes.length
          // eslint-disable-next-line no-shadow
        ).then((res) => {
          const idsForCreatedQRCode = Object.values(res);
          // eslint-disable-next-line no-underscore-dangle
          const previousPresentQRCodeIds = unusedQRCodes.map(
            // eslint-disable-next-line no-underscore-dangle
            (code) => code._id
          );
          const allQRCodes = idsForCreatedQRCode.concat(
            previousPresentQRCodeIds
          );
          saveProductData(allQRCodes);
        });
      } else {
        // eslint-disable-next-line no-underscore-dangle
        saveProductData(unusedQRCodes.map((code) => code._id));
      }
    } catch (error) {
      return res.status(500).json({
        message: error.message,
        developerMessage: error.message,
        stack: error,
      });
    }
  },
  // eslint-disable-next-line consistent-return
  getAll: async (req, res) => {
    try {
      const { filter } = req.query;
      const products = await Products.find(JSON.parse(filter))
        .select('+hasExpired +batchInfo')
        .populate('qrcode')
        .sort('-createdAt')
        .exec();
      res.status(200).json({
        message: 'Products loaded successfully',
        data: products,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
        developerMessage: error.message,
        stack: error,
      });
    }
  },
  getOne: async (req, res) => {
    await Products.findOne({ _id: req.params.productID })
      .then((product) => {
        res.json(product);
      })
      .catch((error) =>
        // eslint-disable-next-line implicit-arrow-linebreak
        res.status(500).json({
          message: error.message,
          developerMessage: error.message,
          stack: error,
          // eslint-disable-next-line prettier/prettier
        })
      );
  },

  getProductByToken: async (req, res, next) => {
    await Products.findOne({ token: req.params.token })
      .populate('companyId')
      .populate('productAgent')
      .lean()
      .exec()
      .then((product) => {
        res.status(200).json(product);
      })
      .catch((err) => {
        next(err);
      });
  },
  deleteOne: async (req, res) => {
    const { productID } = req.params;
    await Products.deleteOne({ _id: productID })
      // eslint-disable-next-line
      .then(() => res.status(201).json())
      .catch((err) => {
        console.log(err);
        next(err);
      });
  },
  getProductActivity: async (req, res) => {
    console.log('hellow here activityy');
    console.log(req.params);
    await Products.findById(req.params.productId, 'createdAt activity')
      .populate('activity.actor', 'firstName lastName companyId')
      .then((data) => {
        console.log(data);
        return res.status(200).json(data.activity);
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json(error);
      });
  },
  //   saveLogs(){
  //     let activity = {
  //         actor: req.body.userId,
  //         // position: req.body.roleGenericName,
  //         title: 'Verify Product',
  //         // descriptions: "",
  //         // descriptions: req.body.descriptions,
  //         issuedAt: Date.now(),
  //       };
  //     await Products.findOneAndUpdate(
  //         { token: req.params.token },
  //         { $push: { activity } },
  //         { new: true, useFindAndModify: false }
  //       );
  //   },
  revokeBatch: async (req, res) => {
    try {
      let activity = {
        actor: req.body.userId,
        position: req.body.roleGenericName,
        title: 'Revoke Batch',
        descriptions: req.body.descriptions,
        issuedAt: Date.now(),
      };
      await Products.updateMany(
        { 'batchInfoz.name': new Date(req.body.batch).toDateString() },
        { $push: { activity }, isRevoked: true },
        { useFindAndModify: false }
      );
      return res.status(201).json();
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  },
  revokeProduct: async (req, res) => {
    try {
      let activity = {
        actor: req.body.userId,
        position: req.body.roleGenericName,
        title: 'Revoke Product',
        descriptions: req.body.descriptions,
        issuedAt: Date.now(),
      };
      await Products.findOneAndUpdate(
        { _id: req.params.productID },
        { $push: { activity }, isRevoked: true },
        { new: true, useFindAndModify: false }
      );
      return res.status(201).json();
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
    // console.log(req.body);
    // // const { productID } = req.body.params;
    // // eslint-disable-next-line prefer-destructuring
    // const productID = req.params.productID;
    // await Products.findByIdAndUpdate(
    //   productID,
    //   { isRevoked: true },
    //   { new: true, useFindAndModify: false }
    // )
    //   .then((resp) => {
    //     console.log(resp);
    //     res.status(200).json(resp);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     next(err);
    //   });
  },
  reportUnregisteredProduct: async (req, res) => {
    console.log('entered register unregistered products');
    try {
      //   console.log(req.body);
      // eslint-disable-next-line global-require
      const formidable = require('formidable');
      const form = formidable({ multiples: true });
      // eslint-disable-next-line global-require
      const { cloudinary } = require('../../utils/Cloudinary');

      form.parse(req, async (err, fields, files) => {
        if (err) {
          //   console.log('formidable error', err);
          return res.status(500).json({
            message: 'At least one image is required',
            developerMessage: 'a product photo is required',
          });
        }
        // console.log(files);
        if (!files.photo) {
          return res.status(500).json({
            message: 'At least one image is required',
            developerMessage: 'a product photo is required',
          });
        }

        // const result = await cloudinary.uploader
        // .upload(file.tempFilePath, {
        //   public_id: `${Date.now()}`,
        //   resource_type: 'auto',
        // });
        console.log(files.photo.path);

        const uploadedResponse = await cloudinary.uploader
          .upload(files.photo.path, {
            upload_preset: 'aiascs',
          })
          .catch((error) => {
            console.log('cloudinary error ', error);
            return res.status(500).json({
              message: 'Connection to cloudinary failed',
              developerMessage: error,
            });
          });
        // console.log(uploadedResponse);
        fields.photo = uploadedResponse;
        const unregistered = await UnregisteredProducts.create(fields);
        // console.log(unregistered);
        return res.status(201).json({
          message: 'product added successfully',
          data: unregistered,
        });
      });
    } catch (error) {
      console.log('server error', error);
      return res.status(500).json({
        message: error.message,
        developerMessage: error.message,
        stack: error,
      });
    }
  },
  getUnregisteredProducts: async (req, res) => {
    await UnregisteredProducts.find()
      .then((response) => {
        res.status(200).json(response);
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          message: error.message,
          developerMessage: error.message,
          stack: error,
        });
      });
  },
  /**
   *
   * @param {req} mode [distinct, details]
   * @param {req} companyId
   * @returns
   */
  getBatches: async (req, res) => {
    console.log(req.params);
    let batches = [];

    // switch (req.params.mode) {
    //   case 'distinct':
    //     batches = await Products.distinct('batchInfoz.name', {
    //       companyId: req.params.companyId,
    //     });
    //     break;
    //   case 'details':
    //     batches = await Products.distinct('batchInfoz', {
    //       companyId: req.params.companyId,
    //     });

    //   default:
    //     break;
    // }

    // const batches = await Products.find(req.params);
    //   const batches = await Products.distinct('token')
    batches = await Products.find({ companyId: req.params.companyId }).distinct(
      'batchInfoz'
    );

    //   console.log(batches)
    return res.status(200).json(batches);
  },
  getVerifiedProductsVSUnverified: async (req, res) => {
    // try {
    //   const verified = await Products.find({}).countDocuments();
    //   const unverified = await UnregisteredProducts.countDocuments();
    //   return res.status(200).json({ registered, unregistered });
    // } catch (error) {
    //   console.log(error);
    //   return res.status(500).json(error);
    // }
  },
  getRegisteredProductsVSUnregistered: async (req, res) => {
    try {
      const registered = await Products.countDocuments();
      const unregistered = await UnregisteredProducts.countDocuments();
      return res.status(200).json({ registered, unregistered });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  },
  getProductsVSCompany: async (req, res) => {
    try {
      const ManufacturerModel = require('../manufacturer/manufacture.model');
      Products.aggregate([
        { $group: { _id: '$companyId', count: { $sum: 1 } } },
        {
          $project: { _id: 0, company: '$_id', count: '$count' },
        },
      ]).exec(function (err, products) {
        ManufacturerModel.populate(
          products,
          { path: 'company', select: '-_id name' },
          function (err, populatedTransactions) {
            const data = populatedTransactions.map((item) => {
              return { company: item.company.name, count: item.count };
            });
            return res.status(200).json(data);
          }
        );
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  },
  getProductStatsVSTime: async (req, res) => {
    try {
      console.log('in');
      // const aggregatorOpts = [
      //     {
      //         $group: {
      //             _id: "$companyId",
      //         }
      //     }
      // ]
      const data = await Products.aggregate([
        {
          $group: { _id: '$batchInfoz.name', count: { $sum: 1 } },
        },
        { $sort: { _id: 1 } },
      ]);

      // console.log(data)
      return res.status(200).json(data);

      // const datas = await Products.find()
      //     // .select('companyId createdAt')
      //     // .populate()
      //     .then(data => {
      //         console.log(data)
      //         return res.status(200).json(data)
      //     })
      // console.log(datas)
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  },
  getAdminStats: async (req, res) => {
    try {
      console.log('hhellow');
      // # of man companies
      const totalManufacturers = await ManufacturerModel.countDocuments();
      // # of qc companies
      const totalQCCompanies = await qcModel.countDocuments();
      // # of agents
      const totalAgentCompanies = await agentModel.countDocuments();
      // # of users
      const totalUsers = await usersModel.countDocuments();
      // # of batches
      const totalProducts = await Products.countDocuments();

      const unregisteredProducts = await UnregisteredProducts.countDocuments();

      return res.status(200).json({
        totalAgentCompanies,
        totalManufacturers,
        totalUsers,
        totalProducts,
        unregisteredProducts,
        totalQCCompanies,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  },
  //   getS,
};
