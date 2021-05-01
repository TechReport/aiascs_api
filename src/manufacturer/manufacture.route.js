const express = require("express");
const router = express.Router();
const manufactureController = require("./manufacture.controller");
const manufactureMiddlware = require("../../utils/middlewares/manufacture_middleware");
const sessionMonitor = require('../../utils/middlewares/sessionMonitor')

router.get("/all", sessionMonitor, manufactureController.getAllManufacture);
router.get(
    "/:id",
    manufactureMiddlware.getId,
    sessionMonitor,
    manufactureController.getManufuctureById
);
router.post("/register", sessionMonitor, manufactureController.createManufacture);
router.delete(
    "/:id",
    sessionMonitor,
    manufactureMiddlware.getId,
    manufactureController.removeManufactureyId
);
router.put(
    "/update/:id",
    sessionMonitor,
    manufactureMiddlware.getId,
    manufactureController.updateManufactureById
);
router.post(
    "/addproductAgent/:id",
    sessionMonitor,
    manufactureMiddlware.getId,
    manufactureController.addProductAgentToManufacture
);

// router.get('/users/:companyId', sessionMonitor, manufactureController.getUsers)
router.put('/assignAdmin/:companyId/:adminId', sessionMonitor, manufactureController.assignAdmin)
// router.put('/addUser', sessionMonitor, manufactureController.addUser)

module.exports = router;
