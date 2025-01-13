import express from "express";
import { generateMaterialIDController } from "../controllers/materialData-controller.js";

const router = express.Router();

//generate material ID
router.get("/get/ID", generateMaterialIDController);


export default router;