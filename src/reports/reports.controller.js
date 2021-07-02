const batchModel = require('../agro_inputs/batch.model');
const Products = require('../agro_inputs/products.modal');
const ManufacturerModel = require('../manufacturer/manufacture.model');
const mongoose = require('mongoose');

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
          $project: { _id: 0, batch: '$batch.name', count: '$count' },
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
};
