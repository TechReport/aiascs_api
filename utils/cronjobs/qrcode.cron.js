var cron = require('node-cron');
const Users = require('../../src/users/user.modal')
const QRCodeModel = require('../../src/qrCode/qrcode.model')
const QRCodeController = require('../../src/qrCode/qrcode.controller')

module.exports = cron.schedule('* * * * *', async (d) => {
    console.log(d)
    // console.log('running a task every minute');
    let qrCodesCount = await QRCodeModel.countDocuments({ status: 0 })

    if (qrCodesCount < 3) {
        const token = QRCodeController.generateQRCode(3)

        // const token = QRCodeController.generateQRCode({
        //     country: 'Tanzania',
        //     region: 'Kilimanjaro', district: 'Mwanga',
        //     companyID: 'G181022-3550',
        //     expiryDate: '2021-04-01T19:46:43.688Z'
        // },()=>{
        //     console.log('done')
        // })
        // QRCodeController.generate()
    }

    // if(userList)
    // console.log(qrCodes)
});