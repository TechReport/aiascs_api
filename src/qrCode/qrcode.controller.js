/* eslint-disable no-unused-vars */
/* eslint-disable object-curly-newline */
const qrcode = require('qrcode');

const base64Img = require('base64-img');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const QRCodeModel = require('./qrcode.model');

module.exports = {
  generateQRCode: async (count) => {
    console.log('issue generate qr code');
    const qrCodeData = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < count; i++) {
      const token = uuidv4();
      // const token = _generateProductToken({
      //     country: 'Tanzania',
      //     region: 'Kilimanjaro', district: 'Mwanga',
      //     companyID: 'G181022-3550',
      // })

      // eslint-disable-next-line no-await-in-loop
      const base64QRCodeData = await qrcode.toDataURL(token, {
        errorCorrectionLevel: 'H',
      });

      const pathToQRCode = base64Img.imgSync(base64QRCodeData, 'dist', token);

      qrCodeData.push({ pathToQRCode, token });
    }

    const qrs = qrCodeData.map((data) => {
      const datas = {
        qrCodeImage: fs.readFileSync(
          // eslint-disable-next-line comma-dangle
          path.join(__dirname, `../../${data.pathToQRCode}`)
        ),
        productToken: data.token,
        expiry: false,
      };
      // Delete QR Image
      fs.unlinkSync(path.join(__dirname, `../../${data.pathToQRCode}`));
      return datas;
    });

    const insertedIds = await (
      await QRCodeModel.insertMany(qrs, { rawResult: true })
    ).insertedIds;

    return insertedIds;
  },
  markIssued: async (id) => {
    await QRCodeModel.updateOne(
      { _id: id },
      { status: 1 },
      // eslint-disable-next-line comma-dangle
      { useFindAndModify: true }
    )
      .then((response) => response.ok)
      .catch((error) => error);
  },
};

/**
 * @param {String} characters
 * @returns [randomStr], shuffled string of 4 characters
 */
// eslint-disable-next-line no-underscore-dangle
function _makeid(characters) {
  let randomStr = '';
  const charactersLength = characters.length;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 4; i++) {
    randomStr += characters.charAt(
      // eslint-disable-next-line comma-dangle
      Math.floor(Math.random() * charactersLength)
    );
  }
  return randomStr;
}

/**
 * Accepts @param { country, region, destrict, companyId, expiryDate}
 * @returns {String finalProductCode}, a random shuffled product identifier
 */
// eslint-disable-next-line no-underscore-dangle
function _generateProductToken({ country, region, district, companyID }) {
  let randomId1;
  while (true) {
    randomId1 = Math.ceil(Math.random() * 10000);
    if (randomId1.toString().length === 4) {
      break;
    }
  }
  const dab = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const productCode = `${country.substring(0, 2)}
        ${region.substring(0, 1) + district.substring(0, 1)}-
        ${companyID.substring(companyID.length - 4)}-
        ${_makeid(dab)}-
        ${randomId1}`;

  // Remove trailing spaces and new line characters
  const finalProductCode = productCode.replace(/[\r\n/\s]+/gm, '');

  // console.log(finalProductCode)
  return finalProductCode;
}
