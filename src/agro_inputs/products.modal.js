const mongoose = require('mongoose')

let agroInputsSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    batchId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    qrCodeRef: {
        type: String,
        unique: true,
    },
    qrCodeData: {
        type: Object,
        // unique: true,
        // required: true,
    },
    expiry: {
        type: mongoose.Schema.Types.Date,
        trim: true,
    },
},
    { timestamps: true }
)

module.exports = mongoose.model('agroInputs', agroInputsSchema)