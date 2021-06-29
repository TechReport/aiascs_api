const Manufacture = require('./manufacture.model');
const alphanuminc = require('alphanum-increment');

module.exports = {
  getManufuctureById: async (req, res, next) => {
    -(await Manufacture.findById(req.manufactureId, (error, doc) => {
      if (error) {
        next(error);
      }
      res.status(200).json(doc);
    }).populate('productAgent')),
      exec();
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
