const express = require("express");
const router = express.Router();
const manufactureController = require("./manufacture.controller");
const manufactureMiddlware = require("../../utils/middlewares/manufacture_middleware");

router.get("/all", manufactureController.getAllManufacture);
router.get(
  "/:id",
  manufactureMiddlware.getId,
  manufactureController.getManufuctureById
);
router.post("/register", manufactureController.createManufacture);
router.delete(
  "/:id",
  manufactureMiddlware.getId,
  manufactureController.removeManufactureyId
);
router.put(
  "/update/:id",
  manufactureMiddlware.getId,
  manufactureController.updateManufactureById
);
router.post(
  "/addproductAgent/:id",
  manufactureMiddlware.getId,
  manufactureController.addProductAgentToManufacture
);

module.exports = router;
