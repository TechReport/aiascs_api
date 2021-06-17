const LocationModel = require('./location.modal')

module.exports = {
    create: async (req, res) => {
        await LocationModel.create(req.body)
            .then(data => res.status(200).json(data))
            .catch(error => res.status(500).json(error))
    },
    findByUserId: async (req, res) => {
        const { userId } = req.params
        await LocationModel.findOne({ userId })
            .then(data => res.status(200).json(data))
            .catch(error => res.status(500).json(error))
    },
    update: async (req, res) => {
        const { userId } = req.params
        const { lat, lng } = req.body
        await LocationModel.findOneAndUpdate({ userId }, { lat, lng }, { new: true, useFindAndModify: false })
            .then(data => res.status(200).json(data))
            .catch(error => res.status(500).json(error))
    }
}