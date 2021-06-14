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
};
