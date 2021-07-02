const Products = require('./products.modal');

module.exports = {
  getCompanyId: (req, res, next) => {
    req.manufagetIdctureId = req.params.id;
    next();
  },
  logEventToProduct: async (req, res, next) => {
    let position = '';

    switch (req.body.roleGenericName) {
      case 'ROLE_QUALITY_CONTROLLER_ADMIN':
        position = 'Quality Controller';
        break;
      case 'ROLE_OPERATION_PERSONNEL_QC':
        position = 'Quality Controller';
        break;
      case 'ROLE_MANUFACTURING_COMPANY_ADMIN':
        position = 'Manufacturer';
        break;
      case 'ROLE_OPERATION_PERSONNEL_MAN':
        position = 'Quality Controller';
        break;
      case 'ROLE_AGENT_COMPANY_ADMIN':
        position = 'Agent';
        break;
      case 'ROLE_OP_AGENT':
        position = 'Agent';
        break;
      default:
        position = '';
        break;
    }
    let activity = {
      actor: req.body.userId,
      position,
      title: req.body.title,
      //title => scanned product, verified product, revoke batch, revoke product
      descriptions: req.body.descriptions,
      //   location:{req.body.location},
      location: {
        region: req.body.location.region,
        district: req.body.location.district,
        ward: req.body.location.ward,
      },
      issuedAt: Date.now(),
    };
    //   let activity = {
    //     actor: req.body.userId,
    //     position: req.body.roleGenericName,
    //     title: 'Revoke Batch',
    //     descriptions: req.body.descriptions,
    //     issuedAt: Date.now(),
    //   };
    await Products.updateOne(
      { token: req.params.token },
      { $push: { activity } },
      { new: true, useFindAndModify: false }
    );
    next();
  },
};
