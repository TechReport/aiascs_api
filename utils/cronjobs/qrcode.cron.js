var cron = require('node-cron');
// const Users = require('../../src/users/user.modal')
const QRCodeModel = require('../../src/qrCode/qrcode.model')
const QRCodeController = require('../../src/qrCode/qrcode.controller')

module.exports = cron.schedule('* * * * *', async (d) => {
    console.log(d)
    let qrCodesCount = await QRCodeModel.countDocuments({ status: 0 })

    if (qrCodesCount < 3) {
        const token = QRCodeController.generateQRCode(3)
    }
});