const Manufacture = require('./manufacture.model');
const alphanuminc = require('alphanum-increment');

module.exports = {
  getManufuctureById: async (req, res, next) => {
    await Manufacture.findById(req.manufactureId)
      .populate('admin')
      .then((doc) => res.status(200).json(doc))
      .catch((error) => {
        console.log(error);
        next(error);
      });
  },

  getAllManufacture: async (req, res, next) => {
    try {
      const manufactures = await Manufacture.find()
        .populate({
          path: 'admin',
          populate: [{ path: 'role', select: 'name' }],
        })
        .populate('productAgent')
        .sort('-createdAt')
        .lean()
        .exec();
      res.status(200).json(manufactures);
    } catch (err) {
      console.log(err);
      next(err);
    }
  },
  getAssociatedAgents: async (req, res) => {
    console.log(req.params);
    console.log(req.query);

    await Manufacture.findById(req.params.companyId, 'productAgent')
      .populate('productAgent', 'name email phoneNumber createdAt')
      .then((data) => res.status(200).json(data.productAgent))
      .catch((error) => {
        console.log(error);
        res.status(500).json(error);
      });
  },
  createManufacture: async (req, res, next) => {
    console.log(req.body);
    const increment = alphanuminc.increment;

    let lastCode = await Manufacture.findOne({}, 'code createdAt').sort({
      createdAt: -1,
    });

    let newCode = '00';
    if (lastCode) newCode = increment(lastCode.code);

    const manufactures = await Manufacture.create({
      ...req.body,
      code: newCode,
    });
    res.status(201).json(manufactures.toJSON());
  },

  /**
   * @deprecated
   */
  updateManufacturePostalBox: async (req, res) => {
    const { manufactureId } = req.params;

    await Manufacture.updateOne({ _id: req });
  },
  /**
   * @deprecated
   */
  updateManufactureLogo: async (req, res) => {
    try {
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
        console.log(uploadedResponse);
        const mongoose = require('mongoose');
        //   fields.photo = uploadedResponse;
        const updatedLogo = await Manufacture.findOneAndUpdate(
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
  removeManufactureyId: async (req, res, next) => {
    await Manufacture.deleteOne({ _id: req.manufactureId }).exec();
    res.status(202).json({
      message: 'sucess fully deleted',
    });
  },
  updateManufactureById: async (req, res, next) => {
    const update = req.body;
    return await Manufacture.findByIdAndUpdate(
      req.manufactureId,
      update,
      { new: true },
      (error, updatedManufacture) => {
        if (error) {
          next(error);
        }
        res.status(200).json(updatedManufacture);
      },
      { new: true }
    ).exec();
  },
  addProductAgentToManufacture: async (req, res, next) => {
    const productAgents = req.body;

    let manufactures = await Manufacture.findByIdAndUpdate(
      req.manufactureId,
      {
        $push: {
          productAgent: {
            $each: productAgents,
          },
        },
      },
      { new: true }
    ).exec();

    res.status(201).json(manufactures);
  },
  assignAdmin: async (req, res, next) => {
    const { companyId, adminId } = req.params;
    console.log(companyId);
    console.log(adminId);

    await Manufacture.findByIdAndUpdate(
      companyId,
      { admin: adminId },
      { new: true, useFindAndModify: false }
    )
      .populate({
        path: 'admin',
        populate: [{ path: 'role', select: 'name' }],
      })
      .then((updatedManufacturer) => res.status(201).json(updatedManufacturer))
      .catch((err) => {
        console.log(err);
        next(err);
      });
  },
};
