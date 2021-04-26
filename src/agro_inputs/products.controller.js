/* eslint-disable comma-dangle */
const Products = require('./products.modal');
const QRCodeModel = require('../qrCode/qrcode.model');
const QRCodeController = require('../qrCode/qrcode.controller');

module.exports = {
  register: async (req, res) => {
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
          companyId: req.body.companyId,
          qrcode: qrcodeIds[productIndex],
        });
      }
      // console.log('mark issued')
      qrcodeIds.forEach((id) => {
        QRCodeController.markIssued(id);
      });
      // console.log('this aint blocking')

      await Products.insertMany(productData, { rawResult: true })
        .then((response) => {
          console.log(response);
          console.log('products created');
          res.status(200).json({
            message: `'${response.insertedCount}' products have been created successfully`,
            data: {
              status: response.result.ok,
              productsCreatedCount: response.insertedCount,
              products: response.ops,
            },
          });
        })
        .catch((error) => {
          console.log(error);
        });
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
        const previousPresentQRCodeIds = unusedQRCodes.map((code) => code._id);

        const allQRCodes = idsForCreatedQRCode.concat(previousPresentQRCodeIds);
        saveProductData(allQRCodes);
      });
    } else {
      // eslint-disable-next-line no-underscore-dangle
      saveProductData(unusedQRCodes.map((code) => code._id));
    }
  },
  getAll: async (req, res, next) => {
    try {
      const products = await Products.find()
        .select('+hasExpired +batchInfo')
        .populate('qrcode')
        .sort('-createdAt')
        .exec();
      res.status(200).json({
        message: 'Products loaded successfully',
        data: products,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  getOne: async (req, res, next) => {
    console.log(req.params);
    await Products.findOne({ _id: req.params.productID })
      .then((product) => {
        res.json(product);
      })
      .catch((err) => {
        next(err);
      });
  },

  getProductByToken: async (req, res, next) => {
    console.log(req.params);
    await Products.findOne({ token: req.params.token })
      .then((product) => {
        res.json(product);
      })
      .catch((err) => {
        next(err);
      });
  },
  // deleteOne: async (req, res, next) => {
  //   console.log(req.params);
  //   await Products.deleteOne({ _id: req.params.productID })
  //     // eslint-disable-next-line
  //     .then((response) => res.status(200).json({
  //         // eslint-disable-next-line prettier/prettier
  //       status: true,
  //         data: {
  //           deletedCount: response.deletedCount,
  //           deletedProduct: req.params.productID,
  //         },
  //       })
  //     )
  //     .catch((err) => {
  //       console.log(err);
  //       next(err);
  //     });
  // },
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
};
