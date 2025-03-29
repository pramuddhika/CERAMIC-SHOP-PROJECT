import express from "express";
import {
  addCartDataController,
  addAddressDataController,
  getAddressDataController,
  getCartDataController,
} from "../controllers/shop-controller.js";

const router = express.Router();

//add caert data
router.post("/addCartData", addCartDataController);
//add address data
router.post("/addAddressData", addAddressDataController);
//get address data
router.get('/getAddressData/:userId', getAddressDataController);
//get cart data
router.get('/getCartData/:userId', getCartDataController);

export default router;
