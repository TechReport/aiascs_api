const QRCodeModel = require('./qrcode.model');
const ProductsModel = require('../agro_inputs/products.modal');
const BatchModel = require('../agro_inputs/batch.model');
const alphanuminc = require('alphanum-increment');

const qrcode = require('qrcode');

const base64Img = require('base64-img');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const manufactureModel = require('../manufacturer/manufacture.model');

module.exports = {
  generateQRCode: async (count, { batchId }) => {
    try {
      console.log('issue generate qr code');
      var qrCodeData = [];

      let batchInfo = await BatchModel.findById(batchId).populate(
        'companyId',
        'code'
      );

      let lastProduct = await ProductsModel.findOne(
        { batch: batchId },
        'token createdAt'
      ).sort({
        createdAt: -1,
      });
      //   console.log(lastProduct);

      let prodRegYearSubStr = new Date().getFullYear().toString().slice(2); // 2 chars
      let companyCode = batchInfo.companyId.code; // 2 chars
      let batchCode = batchInfo.code; // 2 chars
      let prodCode = '0000'; // 4 chars
      const increment = alphanuminc.increment;

      if (lastProduct) prodCode = lastProduct.token.split('-').pop();

      //   console.log(productCode);
      // const increment = alphanuminc.increment;
      //   let newCode = increment(productCode, { dashes: false });
      //   console.log(newCode);
      //   prodCode = productCode;
      //   }

      for (var i = 0; i < count; i++) {
        prodCode = increment(prodCode, { dashes: false }).toUpperCase();
        let token = `${prodRegYearSubStr}${companyCode}-${batchCode}-${prodCode}`;

        const base64QRCodeData = await qrcode.toDataURL(token, {
          errorCorrectionLevel: 'H',
        });

        const pathToQRCode = base64Img.imgSync(base64QRCodeData, 'dist', token);

        qrCodeData.push({ pathToQRCode, token });
      }

      // let batchInfo = await manufactureModel.findByI({batchId}, 'code');

      // batchCode = '';
      // console.log(batchCode);
      // let name = '06958e06-921f-48e7-af3f-8af352627dbf';

      // console.log(name.split('-').pop());

      // for (var i = 0; i < count; i++) {
      //   const token = uuidv4();

      //   /**
      //    * company id [000]
      //    * batch id   [000]
      //    * product id [000]
      //    * 111-aa4-a1a4
      //    * 2021-a9-a1a4
      //    *
      //    */
      //   // const token = _generateProductToken({
      //   //     country: 'Tanzania',
      //   //     region: 'Kilimanjaro', district: 'Mwanga',
      //   //     companyID: 'G181022-3550',
      //   // })

      //   const base64QRCodeData = await qrcode.toDataURL(token, {
      //     errorCorrectionLevel: 'H',
      //   });

      //   const pathToQRCode = base64Img.imgSync(base64QRCodeData, 'dist', token);

      //   qrCodeData.push({ pathToQRCode, token });
      // }

      const qrs = qrCodeData.map((data) => {
        let datas = {
          qrCodeImage: fs.readFileSync(
            path.join(__dirname, `../../${data.pathToQRCode}`)
          ),
          productToken: data.token,
          expiry: false,
        };
        // Delete QR Image
        fs.unlinkSync(path.join(__dirname, `../../${data.pathToQRCode}`));
        return datas;
      });

      let insertedIds = await (
        await QRCodeModel.insertMany(qrs, { rawResult: true })
      ).insertedIds;

      return insertedIds;
    } catch (error) {
      console.log(error);
    }
  },
  markIssued: async (id) => {
    console.log('mark issued');
    await QRCodeModel.updateOne(
      { _id: id },
      { status: 1 },
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
function _makeid(characters) {
  var randomStr = '';
  var charactersLength = characters.length;
  for (var i = 0; i < 4; i++) {
    randomStr += characters.charAt(
      Math.floor(Math.random() * charactersLength)
    );
  }
  return randomStr;
}

/**
 * Accepts @param { country, region, destrict, companyId, expiryDate}
 * @returns {String finalProductCode}, a random shuffled product identifier
 */
function _generateProductToken({ country, region, district, companyID }) {
  let randomId1;
  while (true) {
    randomId1 = Math.ceil(Math.random() * 10000);
    if (randomId1.toString().length === 4) {
      break;
    }
  }
  const productCode = `${country.substring(0, 2)}
        ${region.substring(0, 1) + district.substring(0, 1)}-
        ${companyID.substring(companyID.length - 4)}-
        ${_makeid(
          'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        )}-
        ${randomId1}`;

  // Remove trailing spaces and new line characters
  const finalProductCode = productCode.replace(/[\r\n/\s]+/gm, '');

  // console.log(finalProductCode)
  return finalProductCode;
}
