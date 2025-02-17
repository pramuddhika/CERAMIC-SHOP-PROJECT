import express from "express";
import {
  generateMaterialIDController,
  addMaterialDataController,
  getMaterialDataController,
  editMaterialDataController,
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


export default router;
