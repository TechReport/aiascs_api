const mongoose = require('mongoose')

const PermissionSchema = new mongoose.Schema({
    displayName: {
        type: String,
        required: true,
    },
    genericName: {
        type: String,
        required: true,
        unique: true
    },
    moduleName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        trim: true
    }
},
    { timestamps: true }
);

module.exports = mongoose.model('permission', PermissionSchema);
