import express from "express";
import {
  generateMaterialIDController,
  addMaterialDataController,
  getMaterialDataController,
  editMaterialDataController,
  getMaterialListController,
  getMaterialStockController,
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


export default router;
