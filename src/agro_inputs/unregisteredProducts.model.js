const mongoose = require('mongoose');

let unregisteredProductsSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    photo: [
        {
            type: String,
            trim: true
        }
    ],
    isRevoked: {
        type: Boolean,
        default: false
    },
    expiry: {
        type: mongoose.Schema.Types.Date,
        trim: true,
        required: true
    },
    companyName: {
        type: String,
    },
    descriptions: {
        type: String,
    }

},
    { timestamps: true }
)

// productsSchema.virtual('batchInfo').get(function () {
//     console.log('i am called')
//     return this.createdAt
// })

// productsSchema.virtual('hasExpired').get(function () {
//     console.log('i am called')
//     return this.expiry > Date.now() ? true : false
// })


module.exports = mongoose.model('unregisteredProducts', unregisteredProductsSchema)
