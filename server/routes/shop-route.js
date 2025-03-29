import express from "express";
import {
  addCartDataController,
  addAddressDataController,
} from "../controllers/shop-controller.js";

const router = express.Router();

//add caert data
router.post("/addCartData", addCartDataController);
//add address data
router.post("/addAddressData", addAddressDataController);

export default router;
