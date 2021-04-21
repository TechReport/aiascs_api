const mongoose = require("mongoose");
const _ = require("lodash");
const ProductAgent = require("../product_agent/product_agent.model");
const Product = require("../agro_inputs/products.modal");

const manufacture = new mongoose.Schema(
  {
    regno: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      min: 5,
      unique: true,
      required: true,
    },

    phonenumber: {
      type: Number,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please enter a valid email",
      ],
    },

    location: {
      country: String,
      district: String,
      ward: String,
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now(),
    },

    productAgent: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "productAgent",
      },
    ],
  },
  { timestamps: true }
);

manufacture.pre("save", function (next) {
  if (true) {
    next();
  }
  next(new Error("Enter valid Email"));
});

manufacture.post("remove", async (doc, next) => {
  _.forEach(doc.productAgent, (singlemanufactureDoc) => {
    ProductAgent.findOneAndUpdate(
      { _id: singlemanufactureDoc._id },
      { $pullAll: { manufacture: [doc._id] } }
    );
  }).exec();

  next();
});

manufacture.post("remove", async (doc, next) => {
  Product.deleteMany({ manufacture: doc._id }, (error, response) => {
    if (error) {
      next(error);
    }
    console.log(response);
    next();
  });
});

module.exports = mongoose.model("manufacture", manufacture);
