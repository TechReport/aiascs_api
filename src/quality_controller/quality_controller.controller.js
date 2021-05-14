const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const QualityController = require('./quality_controller.modal');

module.exports = {
  register: async (req, res, next) => {
    console.log('create qc');
    console.log(req.body);
    await QualityController.create(req.body)
      .then((response) => {
        console.log(response);
        return res.status(200).json(response.toJSON());
      })
      .catch((err) => {
        console.log(err);
        return next(err);
      });
  },

  getAll: async (req, res, next) => {
    await QualityController.find()
      .populate({
        path: 'admin',
        populate: [{ path: 'role', select: 'name' }],
      })
      .sort('-createdAt')
      .then((response) => {
        console.log(response);
        return res.status(200).json(response);
      })
      .catch((err) => {
        return next(err);
      });
  },

  getById: async (req, res, next) => {
    console.log(req.params);
    console.log(req.body);
    await QualityController.findById(req.params.id)
      .then((response) => {
        console.log(response);
        return res.status(200).json(response.toJSON());
      })
      .catch((err) => {
        return next(err);
      });
  },
  delete: async (req, res, next) => {
    await QualityController.deleteOne({ _id: req.params.id })
      .then((response) => {
        console.log(response);
        return res.status(200).json(response.toJSON());
      })
      .catch((err) => {
        return next(err);
      });
  },
  updateOneById: async (req, res, next) => {
    await QualityController.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
      .then((response) => {
        return res.status(200).json(response);
      })
      .catch((err) => {
        return next(err);
      });
  },
  assignAdmin: async (req, res, next) => {
    console.log(req.body);
    console.log(req.params);
    const { companyId, adminId } = req.params;

    await QualityController.findByIdAndUpdate(
      companyId,
      { admin: adminId },
      { new: true, useFindAndModify: false }
    )
      .populate({
        path: 'admin',
        populate: [{ path: 'role', select: 'name' }],
      })
      .then((resp) => {
        console.log(resp);
        res.status(201).json(resp);
      })
      .catch((err) => {
        console.log(err);
        next(err);
      });
  },
};
