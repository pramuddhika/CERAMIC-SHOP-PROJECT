import express from "express";
import {
  addproductcreationController,
  editproductcreationDataController,
  getproductcreationDataController,
  getProductListController,
  getProductstockDataController,
} from "../controllers/productcreationData-controller.js";

const router = express.Router();

router.post("/get", getproductcreationDataController);
router.get("/get/list", getProductListController);
router.post("/add/creation", addproductcreationController);
router.put("/update/creation/:id", editproductcreationDataController);
router.get("/get/product", getProductstockDataController);

export default router;
