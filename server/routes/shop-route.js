import express from "express";
import {
  addCartDataController,
  addAddressDataController,
  getAddressDataController,
  getCartDataController,
  deleteCartDataController,
  getAddressTagController,
  getAddressDataByTagController
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
// cart data delete
router.put('/deleteCartData', deleteCartDataController);
// get address tags
router.get('/getAddressTags/:userId', getAddressTagController);
// get address data
router.get('/getAddressData/:userId/:tag', getAddressDataByTagController);

export default router;
