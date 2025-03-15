import express from "express";
import {
  generateMaterialIDController,
  addMaterialDataController,
  getMaterialDataController,
  editMaterialDataController,
  getMaterialListController,
  getMaterialStockController,
  addMaterialReceivedDataController,
  getMaterialReceivedDataController,
  qualityUpdateController,
  addMaterialUsageDataController,
  getMaterialUsageDataController,
  getPaymentDataController,
  addPaymentDataController,
} from "../controllers/materialData-controller.js";

const router = express.Router();

//generate material ID
router.get("/get/ID", generateMaterialIDController);
// add material data
router.post("/add", addMaterialDataController);
// get material data
router.get("/get", getMaterialDataController);
// edit material data
router.put("/edit", editMaterialDataController);
//get material data list
router.get("/get/list", getMaterialListController);
//get meterila stock data
router.get("/get/stock", getMaterialStockController);
//add material received note data
router.post("/add/received", addMaterialReceivedDataController);
//get meteril recied note data
router.get("/get/received", getMaterialReceivedDataController);
// quality update
router.put("/quality/update", qualityUpdateController);
// add meteral usage data 
router.post("/add/usage", addMaterialUsageDataController);
//get meterial usage data
router.get("/get/usage", getMaterialUsageDataController);
//GET payment data
router.get("/get/payment", getPaymentDataController);
// add payment data
router.post("/add/payment", addPaymentDataController);

export default router;
