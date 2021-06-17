const mongoose = require('mongoose');

const locationSchema = mongoose.Schema(
    {
        lng: {
            type: Number,
            required: true,
        },
        lat: {
            type: Number,
            trim: true,
            required: true,
        },
        userId: {
            type: Number,
            required: true,
            unique: true
        },
    },
);


module.exports = mongoose.model('location', locationSchema);
