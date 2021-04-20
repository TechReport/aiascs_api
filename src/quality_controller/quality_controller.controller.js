const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const QualityController = require('./quality_controller.modal');


module.exports = {
    register: async (req, res, next) => {
        console.log('create qc')
        console.log(req.body)
        await QualityController.create(req.body).then(response => {
            console.log(response)
            return res.status(200).json(response.toJSON())
        }).catch(err => {
            console.log(err)
            return next(err)
        })
    },

    getAll: async (req, res, next) => {
        await QualityController.find()
            .sort('-createdAt')
            .then(response => {
                console.log(response)
                return res.status(200).json(response)
            })
            .catch(err => {
                return next(err)
            })
    },

    getById: async (req, res, next) => {
        console.log(req.params)
        console.log(req.body)
        await QualityController.findById(req.params.id)
            .then(response => {
                console.log(response)
                return res.status(200).json(response.toJSON())
            })
            .catch(err => {
                return next(err)
            })
    },
    delete: async (req, res, next) => {
        await QualityController.deleteOne({ _id: req.params.id })
            .then(response => {
                console.log(response)
                return res.status(200).json(response.toJSON())
            })
            .catch(err => {
                return next(err)
            })
    },
    update: async (req, res, next) => {
        console.log(req.body)

        await QualityController.findByIdAndUpdate('id', req.body, { rawResult: true })
            .then(response => {
                console.log(response)
                return res.status(200).json(response.toJSON())
            }).catch(err => {
                return next(err)
            })
    },
};
