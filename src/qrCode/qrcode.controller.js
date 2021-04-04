const QRCodeModel = require('./qrcode.model')
const moment = require('moment')
const qrcode = require("qrcode");

const base64Img = require('base64-img')
const path = require('path')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid');

module.exports = {
    generateManyQRCodes: async (count) => {
        // function completeRegistrationCb() {
        //     console.log('all is completed')
        //     return cb()
        // }

        for (i = 0; i < count; i++) {
            console.log('##Registering ', i, 'th qrcode##')

            await module.exports.generateQRCode()
            // .then(response => {
            //     console.log('QR CREATED IN BULKY')
            // }).catch(error => {
            //     console.log(error)
            // })
        }
    },
    generateQRCode: async (count) => {
        console.log('issue generate qr code')
        var qrCodeData = []
        for (var i = 0; i < count; i++) {
            const token = uuidv4()
            // const token = _generateProductToken({
            //     country: 'Tanzania',
            //     region: 'Kilimanjaro', district: 'Mwanga',
            //     companyID: 'G181022-3550',
            //     expiryDate: '2021-04-01T19:46:43.688Z'
            // })

            const base64QRCodeData = await qrcode.toDataURL(token, { errorCorrectionLevel: 'H' })

            const pathToQRCode = base64Img.imgSync(base64QRCodeData, 'dist', token)

            qrCodeData.push({ pathToQRCode, token })
        }

        const qrs = qrCodeData.map(data => {
            let datas = {
                qrCodeImage: fs.readFileSync(path.join(__dirname, `../../${data.pathToQRCode}`)),
                productToken: data.token,
                // qrcodeRef: '/home/dae54/Projects/final_year_project/aiascs_api/dist/TaKM-2104-3550-1479-7WJ3.png',
                expiry: false
            }
            // Delete QR Image
            fs.unlinkSync(path.join(__dirname, `../../${data.pathToQRCode}`))
            return datas
        })

        let resp = await (await QRCodeModel.insertMany(qrs, { rawResult: true })).insertedIds

        // console.log(resp)
        return resp
    },

    // generateQRCode2: async () => {
    //     console.log('############# ISSUE GENERATE QRCODE ####################')
    //     console.log(1)
    //     const token = _generateProductToken({
    //         country: 'Tanzania',
    //         region: 'Kilimanjaro', district: 'Mwanga',
    //         companyID: 'G181022-3550',
    //         expiryDate: '2021-04-01T19:46:43.688Z'
    //     })
    //     console.log(2)

    //     qrcode.toDataURL(token, { errorCorrectionLevel: 'H' }, async (err, url) => {
    //         if (err) {
    //             console.log(err)
    //             return
    //         }
    //         console.log(3)
    //         // Store the qr code on a /dist folder
    //         base64Img.imgSync(url, 'dist', token)

    //         // var qrCodeModel = new QRCodeModel({
    //         //     qrCodeImage: fs.readFileSync(path.join(__dirname, `../../dist/${token}.png`)),
    //         //     productToken: token,
    //         //     qrcodeRef: '/home/dae54/Projects/final_year_project/aiascs_api/dist/TaKM-2104-3550-1479-7WJ3.png',
    //         //     expiry: false
    //         // });

    //         // const resp = await qrCodeModel.save()
    //         console.log(4)

    //         await QRCodeModel.create({
    //             qrCodeImage: fs.readFileSync(path.join(__dirname, `../../dist/${token}.png`)),
    //             productToken: token,
    //             qrcodeRef: '/home/dae54/Projects/final_year_project/aiascs_api/dist/TaKM-2104-3550-1479-7WJ3.png',
    //             expiry: false
    //         }).then(data => {
    //             console.log(5)

    //             console.log('################# QRCODE CREATED #######################')

    //             // Delete QR Image
    //             fs.unlinkSync(path.join(__dirname, `../../dist/${token}.png`))
    //             // cb()
    //         }).catch(error => {
    //             console.log(error)
    //         })

    //         // console.log(resp)
    //         // console.log(resp._id)
    //         // Delete the generated QRCode from the /dist folder
    //         // fs.unlinkSync(path.join(__dirname, `../../dist/${token}.png`))
    //         // console.log('resp ', resp)
    //         // generatedQRCodes.push(resp)
    //         // console.log('just before callback *#*#*#*#*#*#*#*#*#*#*#*#*#')
    //         // cb()
    //         // console.log('################# QRCODE CREATED #######################')
    //         // return resp
    //     })
    //     // console.log('*************OVER*************')
    //     // return generatedQRCodes
    //     return
    // },
    markIssued: async (id) => {
        try {
            const resp = await QRCodeModel.updateOne({ _id: id }, { status: 1 }, { useFindAndModify: true ,})
            return resp
        } catch (error) {
            console.log(error)
        }
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
function _generateProductToken({ country, region, district, companyID, expiryDate }) {
    // const countryCode = country.substring(0, 2)
    // const regionDistrictCode = region.substring(0, 1) + district.substring(0, 1)
    // const expiryDateCode = moment(expiryDate).format('YYMM')
    // const companyIdCode = companyID.substring(companyID.length - 4)

    let randomId1
    while (true) {
        randomId1 = Math.ceil(Math.random() * 10000)
        if (randomId1.toString().length === 4) {
            break
        }
    }
    // let randomId2 = _makeid('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789')
    const productCode = `${country.substring(0, 2)}
        ${region.substring(0, 1) + district.substring(0, 1)}-
        ${companyID.substring(companyID.length - 4)}-
        ${_makeid('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789')}-
        ${randomId1}`

    // TaKM-3550-Jq8r-9701

    // const productCode = `${country.substring(0, 2)}
    // ${region.substring(0, 1) + district.substring(0, 1)}-
    // ${moment(expiryDate).format('YYMM')}-
    // ${companyID.substring(companyID.length - 4)}-
    // ${_makeid('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789')}-
    // ${randomId1}`

    // TaKM-2104-3550-Jq8r-9701


    // const productCode = `
    //     ${country.substring(0, 2)}
    //     ${region.substring(0, 1) + district.substring(0, 1)}-
    //     ${moment(expiryDate).format('YYMM')}-
    //     ${companyID.substring(companyID.length - 4)}-
    //     ${randomId1}-
    //     ${_makeid('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789')}`


    // Remove trailing spaces and new line characters
    const finalProductCode = productCode.replace(/[\r\n/\s]+/gm, "")

    // console.log(finalProductCode)
    return finalProductCode
}