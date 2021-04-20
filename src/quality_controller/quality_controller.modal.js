const mongoose = require('mongoose');

const qualityControllerSchema = mongoose.Schema(
    {
        regno: {
            type: String,
            unique: true,
            required: true,
        },
        name: {
            type: String,
            min: 5,
            unique: true,
            required: true,
        },

        phonenumber: {
            type: Number,
            unique: true,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please enter a valid email'],
        },

        location: {
            country: String,
            district: String,
            ward: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('qualityController', qualityControllerSchema);
