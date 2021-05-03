const QRCodeModel = require('./qrcode.model')
const qrcode = require("qrcode");

const base64Img = require('base64-img')
const path = require('path')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid');

module.exports = {
    generateQRCode: async (count) => {
        console.log('issue generate qr code')
        var qrCodeData = []
        for (var i = 0; i < count; i++) {
            const token = uuidv4()
            // const token = _generateProductToken({
            //     country: 'Tanzania',
            //     region: 'Kilimanjaro', district: 'Mwanga',
            //     companyID: 'G181022-3550',
            // })

            const base64QRCodeData = await qrcode.toDataURL(token, { errorCorrectionLevel: 'H' })

            const pathToQRCode = base64Img.imgSync(base64QRCodeData, 'dist', token)

            qrCodeData.push({ pathToQRCode, token })
        }

        const qrs = qrCodeData.map(data => {
            let datas = {
                qrCodeImage: fs.readFileSync(path.join(__dirname, `../../${data.pathToQRCode}`)),
                productToken: data.token,
                expiry: false
            }
            // Delete QR Image
            fs.unlinkSync(path.join(__dirname, `../../${data.pathToQRCode}`))
            return datas
        })

        let insertedIds = await (await QRCodeModel.insertMany(qrs, { rawResult: true })).insertedIds

        return insertedIds
    },
    markIssued: async (id) => {
        console.log('mark issued')
        await QRCodeModel.updateOne({ _id: id }, { status: 1 }, { useFindAndModify: true, })
            .then(response => response.ok)
            .catch(error => error)
    }

}



/**
 * @param {String} characters 
 * @returns [randomStr], shuffled string of 4 characters 
 */
function _makeid(characters) {
    var randomStr = '';
    var charactersLength = characters.length;
    for (var i = 0; i < 4; i++) {
        randomStr += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return randomStr;
}


/**
 * Accepts @param { country, region, destrict, companyId, expiryDate}
 * @returns {String finalProductCode}, a random shuffled product identifier
 */
function _generateProductToken({ country, region, district, companyID }) {
      let randomId1
    while (true) {
        randomId1 = Math.ceil(Math.random() * 10000)
        if (randomId1.toString().length === 4) {
            break
        }
    }
    const productCode = `${country.substring(0, 2)}
        ${region.substring(0, 1) + district.substring(0, 1)}-
        ${companyID.substring(companyID.length - 4)}-
        ${_makeid('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789')}-
        ${randomId1}`

    // Remove trailing spaces and new line characters
    const finalProductCode = productCode.replace(/[\r\n/\s]+/gm, "")

    // console.log(finalProductCode)
    return finalProductCode
}