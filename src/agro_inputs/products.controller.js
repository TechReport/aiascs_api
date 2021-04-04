const Products = require('./products.modal')
const QRCodeModel = require('../qrCode/qrcode.model')
const QRCodeController = require('../qrCode/qrcode.controller')


module.exports = {
    register: async (req, res) => {
        async function saveProductData(qrcodeIds) {
            console.log('qrcodeIds', qrcodeIds)
            let productData = []
            for (var i = 0; i < req.body.newProduct.count; i++) {
                productData.push({
                    ...req.body.newProduct,
                    companyId: req.body.companyId,
                    qrcode: qrcodeIds[i]
                })
            }
            // console.log('mark issued')
            qrcodeIds.forEach(id => {
                QRCodeController.markIssued(id)
            })
            // console.log('this aint blocking')

            await Products.insertMany(productData, { rawResult: true })
                .then(response => {
                    console.log(response)
                    console.log('products created')
                    res.status(200).json({
                        message: `'${response.insertedCount}' products have been created successfully`,
                        data: {
                            status: response.result.ok,
                            productsCreatedCount: response.insertedCount,
                            products: response.ops
                        }
                    })
                })
                .catch(error => {
                    console.log(error)
                })
        }
        var unusedQRCodes = await QRCodeModel.find({ status: 0 }, '_id', { limit: Number(req.body.newProduct.count) })

        if (unusedQRCodes.length < req.body.newProduct.count) {
            await QRCodeController.generateQRCode(req.body.newProduct.count - unusedQRCodes.length)
                .then(res => {
                    let idsForCreatedQRCode = Object.values(res)
                    let previousPresentQRCodeIds = unusedQRCodes.map(code => code._id)

                    let allQRCodes = idsForCreatedQRCode.concat(previousPresentQRCodeIds)
                    saveProductData(allQRCodes)
                })
        } else {
            saveProductData(unusedQRCodes.map(code => code._id))
        }
    },
    getAll: async (req, res, next) => {
        try {
            const products = await Products.find().populate('qrcode').sort('-createdAt').exec()
            res.status(200).json({
                message: 'Products loaded successfully',
                data: products
            })
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
}