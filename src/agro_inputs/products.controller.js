/* eslint-disable no-param-reassign */
/* eslint-disable import/no-unresolved */
/* eslint-disable comma-dangle */
const Products = require('./products.modal');
const QRCodeModel = require('../qrCode/qrcode.model');
const QRCodeController = require('../qrCode/qrcode.controller');
const UnregisteredProducts = require('./unregisteredProducts.model');

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
    console.log(req.params);
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
        }));
  },

  getProductByToken: async (req, res, next) => {
    await (await Products.findOne({ token: req.params.token }))
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
  deleteOne: async () => {
    // console.log(req.params);
    // await Products.deleteOne({ _id: req.params.productID })
    //   // eslint-disable-next-line
    //   .then((response) => res.status(200).json({
    //       // eslint-disable-next-line prettier/prettier
    //     status: true,
    //     data: {
    //         deletedCount: response.deletedCount,
    //       deletedProduct: req.params.productID,
    //       },
    //     })
    //   )
    //   .catch((err) => {
    //     console.log(err);
    //     next(err);
    //   });
  },
  revokeProduct: async (req, res, next) => {
    console.log(req.body);
    const { productID } = req.body.params;

    await Products.findByIdAndUpdate(
      productID,
      { isRevoked: true },
      { new: true, useFindAndModify: false }
    )
      .then((resp) => {
        console.log(resp);
        res.status(204).json(resp);
      })
      .catch((err) => {
        console.log(err);
        next(err);
      });
  },
  reportUnregisteredProduct: async (req, res) => {
    try {
      // eslint-disable-next-line global-require
      const formidable = require('formidable');
      const form = formidable({ multiples: true });
      // eslint-disable-next-line global-require
      const { cloudinary } = require('../../utils/Cloudinary');

      form.parse(req, async (err, fields, files) => {
        console.log(files.photo.path);
        const uploadedResponse = await cloudinary.uploader.upload(
          files.photo.path,
          {
            upload_preset: 'aiascs',
          }
        );

        console.log(uploadedResponse);
        fields.photo = uploadedResponse;
        const unregistered = await UnregisteredProducts.create(fields);
        console.log(unregistered);
        return res.status(201).json({
          message: 'product added successfully',
        });
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
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
};
