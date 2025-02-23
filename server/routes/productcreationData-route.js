import express from "express";
import {
  addproductcreationController,
  getproductcreationDataController,
  getProductListController,
} from "../controllers/productcreationData-controller.js";

const router = express.Router();

router.get("/get", getproductcreationDataController);
router.get("/get/list", getProductListController);
router.post("/add/creation", addproductcreationController);

export default router;
