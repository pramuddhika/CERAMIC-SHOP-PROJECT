import express from "express";
import {
  addproductcreationController,
  editproductcreationDataController,
  getproductcreationDataController,
  getProductListController,
} from "../controllers/productcreationData-controller.js";

const router = express.Router();

router.get("/get", getproductcreationDataController);
router.get("/get/list", getProductListController);
router.post("/add/creation", addproductcreationController);
router.put("/update/creation/:id", editproductcreationDataController);

export default router;
