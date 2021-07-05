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
      .populate('admin')
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
  updateLogo: async (req, res) => {
    try {
      console.log('am here');
      const { companyId } = req.params;
      const formidable = require('formidable');
      const form = formidable();
      // eslint-disable-next-line global-require
      const { cloudinary } = require('../../utils/Cloudinary');

      form.parse(req, async (err, fields, files) => {
        if (err) {
          return res.status(500).json({
            message: 'At least one image is required',
            developerMessage: 'a product photo is required',
          });
        }

        if (!files.file) {
          return res.status(500).json({
            message: 'At least one image is required',
            developerMessage: 'a product photo is required',
          });
        }

        const uploadedResponse = await cloudinary.uploader
          .upload(files.file.path, {
            upload_preset: 'aiascs',
            folder: 'logos',
          })
          .catch((error) => {
            console.log('cloudinary error ', error);
            return res.status(500).json({
              message: 'Connection to cloudinary failed',
              developerMessage: error,
            });
          });
        // console.log(uploadedResponse);
        const mongoose = require('mongoose');
        //   fields.photo = uploadedResponse;
        const updatedLogo = await QualityController.findOneAndUpdate(
          { _id: mongoose.Types.ObjectId(companyId) },
          { logo: uploadedResponse.url },
          { new: true, useFindAndModify: false }
        );
        console.log(updatedLogo);
        //   const unregistered = await UnregisteredProducts.create(fields);
        // console.log(unregistered);
        return res.status(200).json({
          message: 'logo added successfully',
          data: updatedLogo,
        });
      });
    } catch (error) {
      console.log(error);
    }
  },
  updatePostalAddress: async (req, res) => {
    const { companyId } = req.params;
    const { postalDetails } = req.body;
    // console.log(postalDetails);
    // console.log(req.body);
    await QualityController.findByIdAndUpdate(
      { _id: companyId },
      { postalBox: postalDetails },
      { new: true, useFindAndModify: false }
    ).then((response) => {
      console.log(response);
      return res.status(200).json(response);
    });
  },
};
