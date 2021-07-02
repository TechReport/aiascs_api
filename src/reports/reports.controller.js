const Products = require('../agro_inputs/products.modal');
const ManufacturerModel = require('../manufacturer/manufacture.model');

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
      let pipelineStages = [];

      if (from) {
        pipelineStages = [
          {
            $match: {
              createdAt: {
                $gte: new Date(from),
                $lt: new Date(to),
              },
            },
          },
          { $group: { _id: '$companyId', count: { $sum: 1 } } },
          {
            $project: { _id: 0, company: '$_id', count: '$count' },
          },
        ];
      } else {
        pipelineStages = [
          { $group: { _id: '$companyId', count: { $sum: 1 } } },
          {
            $project: { _id: 0, company: '$_id', count: '$count' },
          },
        ];
      }

      Products.aggregate(pipelineStages).exec(function (err, products) {
        ManufacturerModel.populate(
          products,
          { path: 'company', select: '-_id name' },
          function (err, populatedTransactions) {
            const data = populatedTransactions.map((item) => {
              return { company: item.company.name, count: item.count };
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
};
