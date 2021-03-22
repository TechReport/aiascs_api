const QRCode = require("qrcode");
const base64Img = require('base64-img');

async function qrcodeGenerator (agroInputID,picName){
  await   QRCode.toDataURL(agroInputID,(err,url) =>{ 
        base64Img.img(url, 'dist', picName, function(err, filepath) {
            console.log(filepath);
        });
    })
}



module.exports = qrcodeGenerator;