module.exports = {
  getCompanyId: (req, res, next) => {
    req.manufagetIdctureId = req.params.id;
    next();
  },
};
