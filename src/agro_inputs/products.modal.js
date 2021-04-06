const mongoose = require('mongoose');

let productsSchema = mongoose.Schema({
    name: {
      type: String,
      trim: true,
      required: true,
    },
    photoInfo: {
        type: String,
        trim: true
    },
    isRevoked: {
        type: Boolean,
        default: false
    },
    qrcode: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'qrcode',
        unique: true
    },
    expiry: {
        type: mongoose.Schema.Types.Date,
        trim: true,
        required: true
    },
    companyId: {
        type: String,
        // type: mongoose.Schema.Types.ObjectId,
        // ref: 'manufacturingCompany',
    }
},
    { timestamps: true }
)

productsSchema.virtual('batchInfo').get(function () {
    console.log('i am called')
    return this.createdAt
})

productsSchema.virtual('hasExpired').get(function () {
    console.log('i am called')
    return this.expiry > Date.now() ? true : false
})


module.exports = mongoose.model('agroInputs', productsSchema)
