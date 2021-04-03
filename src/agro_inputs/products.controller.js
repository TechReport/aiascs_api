const Products = require('./products.modal');

module.exports = {
  register: async (req, res) => {
    console.log(req.body);

    // const newProduct = req.body.newProduct

    for (let i = 0; i <= req.body.newProduct.count; i++) {
      const newProduct = await Products.create(req.body.newProduct);
    }

    // res.render();

    res.status(200).json({
      message: 'successfully created',
      data: '',
    });
  },
};
