import express from "express";
import {
  generateMaterialIDController,
  addMaterialDataController,
} from "../controllers/materialData-controller.js";

const router = express.Router();

//generate material ID
router.get("/get/ID", generateMaterialIDController);
// add material data
router.post("/add", addMaterialDataController);

export default router;
