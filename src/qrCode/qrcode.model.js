const mongoose = require('mongoose')

let qrCodeSchema = mongoose.Schema({
    qrCodeImage: {
        type: mongoose.Schema.Types.Buffer,
        contentType: String,
        data: Buffer,
    },
    productToken: {
        type: String,
        trim: true,
        required: true,
        validator: (value) => {
            value.length === 16 ? true : false
        }
    },
    expiry: {
        type: mongoose.Schema.Types.Boolean,
    },

    // The company owninig the qrcode
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'manCompany'
    },

    /**
     * @param status 0 unused
     * @param status 1 issued
     * @param status 2 used
     */
    status: {
        type: String,
        enum: [0, 1, 2],
        default: 0
    }
},
    { timestamps: true }
)

module.exports = mongoose.model('qrcode', qrCodeSchema)