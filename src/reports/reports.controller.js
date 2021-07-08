const batchModel = require('../agro_inputs/batch.model');
const Products = require('../agro_inputs/products.modal');
const ManufacturerModel = require('../manufacturer/manufacture.model');
const mongoose = require('mongoose');
const productsModal = require('../agro_inputs/products.modal');

async function generateReportFn() {
  console.log('generate report');
}

module.exports = {
  generateReport: async (req, res) => {
    console.log('generate report');

    return res.status(200).json();
  },
  viewReports: async (req, res) => {
    console.log('view report');

    return res.status(200).json();
  },
  viewReport: async (req, res) => {
    console.log('view report by id');

    return res.status(200).json();
  },
  getProductVSCompany: async (req, res) => {
    const { from, to } = req.query;
    try {
      let pipelineStages = [
        { $group: { _id: '$companyId', count: { $sum: 1 } } },
        {
          $project: { _id: 0, company: '$_id', count: '$count' },
        },
      ];

      if (from)
        pipelineStages.unshift({
          $match: {
            createdAt: {
              $gte: new Date(from),
              $lt: new Date(to),
            },
          },
        });
      Products.aggregate(pipelineStages).exec(function (err, products) {
        ManufacturerModel.populate(
          products,
          { path: 'company', select: 'name' },
          function (err, populatedTransactions) {
            const data = populatedTransactions.map((item) => {
              return {
                company: item.company.name,
                count: item.count,
                companyId: item.company._id,
              };
            });
            console.log(data);
            return res.status(200).json(data);
          }
        );
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  },
  productsVSBatch: async (req, res) => {
    try {
      const { from, to } = req.query;
      const { companyId } = req.params;
      let pipelineStages = [
        { $match: { companyId: mongoose.Types.ObjectId(companyId) } },
        { $group: { _id: '$batch', count: { $sum: 1 } } },
        {
          $lookup: {
            from: 'batches',
            localField: '_id',
            foreignField: '_id',
            as: 'batch',
          },
        },
        { $unwind: '$batch' },
        {
          $project: {
            _id: 0,
            batch: '$batch.name',
            batchId: '$batch._id',
            count: '$count',
          },
        },
      ];
      if (from) {
        pipelineStages.unshift({
          $match: {
            createdAt: {
              $gte: new Date(from),
              $lt: new Date(to),
            },
          },
        });
      }
      Products.aggregate(pipelineStages).then((batches) => {
        return res.status(200).json(batches);
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  },
  batchSummary: async (req, res) => {
    try {
      const { companyId, batchId, from, to } = req.query;
      //   console.log('companyId', companyId);
      //   console.log('batchId', batchId);
      //getting total products pipeline stages

      let pipelineStages = [
        // { $match: { companyId: mongoose.Types.ObjectId(companyId) } },
        { $match: { batch: mongoose.Types.ObjectId(batchId) } },

        { $group: { _id: '$batch', count: { $sum: 1 } } },
        {
          $lookup: {
            from: 'batches',
            localField: '_id',
            foreignField: '_id',
            as: 'batch',
          },
        },
        { $unwind: '$batch' },
        {
          $lookup: {
            from: 'manufactures',
            localField: 'batch.companyId',
            foreignField: '_id',
            as: 'company',
          },
        },
        { $unwind: '$company' },

        {
          $project: {
            _id: 0,
            batchName: '$batch.name',
            companyName: '$company.name',
            batchId: '$batch._id',
            total: '$count',
          },
        },
      ];
      let pipelineStageFake = [
        // { $match: { companyId: mongoose.Types.ObjectId(companyId) } },
        { $match: { batch: mongoose.Types.ObjectId(batchId) } },
        { $match: { isRevoked: true } },
        { $group: { _id: '$batch', count: { $sum: 1 } } },
      ];

      let pipelineStageActivities = [
        { $match: { batch: mongoose.Types.ObjectId(batchId) } },
        // { $match: { activity: { $exists: true, $not: { $size: 0 } } } },
        {
          $match: {
            'activity.title': { $regex: 'scan product', $options: 'g' },
          },
        },
        { $group: { _id: '$batch', count: { $sum: 1 } } },
      ];

      if (from) {
        const dateFilter = {
          $match: {
            createdAt: {
              $gte: new Date(from),
              $lt: new Date(to),
            },
          },
        };
        pipelineStages.unshift(dateFilter);
        pipelineStageFake.unshift(dateFilter);
        pipelineStageActivities.unshift(dateFilter);
      }

      let batchInfo = await Products.aggregate(pipelineStages);
      let activity = await Products.aggregate(pipelineStageActivities);
      let fake = await Products.aggregate(pipelineStageFake);

      //   console.log(batchInfo);
      //   console.log(activity);
      //   console.log(fake);

      const batchSummary = {
        ...batchInfo[0],
        scannedProducts: activity[0] ? activity[0].count : 0,
        flaggedProducts: fake[0] ? fake[0].count : 0,
      };

      return res.status(200).json(batchSummary);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  },
  companiesWithRevokedProducts: async (req, res) => {
    try {
      console.log('wlco');
      //   console.log(req.body);
      //   console.log(req.query);
      //   const { companyId, batchId, from, to } = req.query;
      //   console.log(from);
      //   console.log(to);
      //   console.log();
      const { from, to } = JSON.parse(req.query.filter);
      console.log(from);
      //   await productsModal.find
      let pipelineStages = [
        { $match: { isRevoked: true } },
        { $group: { _id: '$companyId', count: { $sum: 1 } } },
        {
          $lookup: {
            from: 'manufactures',
            localField: '_id',
            // localField: 'batch.companyId',
            foreignField: '_id',
            as: 'company',
          },
        },
        { $unwind: '$company' },
        {
          $project: {
            _id: 0,
            // batchName: '$batch.name',
            companyName: '$company.name',
            companyId: '$company._id',
            // batchId: '$companbatch._id',
            total: '$count',
          },
        },
      ];
      if (from) {
        const dateFilter = {
          $match: {
            createdAt: {
              $gte: new Date(from),
              $lt: new Date(to),
            },
          },
        };
        pipelineStages.unshift(dateFilter);
      }
      let resp = await productsModal.aggregate(pipelineStages);
      console.log(resp);
      return res.status(200).json(resp);
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  batchesWithCounterfeitProducts: async (req, res) => {
    try {
      console.log(req.body);
      console.log(req.query.companyId);
      const { from, to } = JSON.parse(req.query.filter);
      console.log(from);
      let pipelineStages = [
        { $match: { companyId: mongoose.Types.ObjectId(req.query.companyId) } },
        { $match: { isRevoked: true } },
        { $group: { _id: '$batch', count: { $sum: 1 } } },
        {
          $lookup: {
            from: 'batches',
            localField: '_id',
            foreignField: '_id',
            as: 'batch',
          },
        },
        { $unwind: '$batch' },
        {
          $project: {
            _id: 0,
            batchName: '$batch.name',
            batchId: '$batch._id',
            total: '$count',
          },
        },
      ];

      if (from) {
        const dateFilter = {
          $match: {
            createdAt: {
              $gte: new Date(from),
              $lt: new Date(to),
            },
          },
        };
        pipelineStages.unshift(dateFilter);
      }

      let resp = await productsModal.aggregate(pipelineStages);
      console.log(resp);
      return res.status(200).json(resp);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};
