import express from "express";
import {
  getPaymentDataController,
  updatePaymentDataController,
  getOrderDataController,
  updateOrderDataController,
} from "../controllers/sales-controller.js";

const router = express.Router();

//get payment data
router.post("/getPaymentData", getPaymentDataController);
//update payment data
router.post("/updatePaymentData", updatePaymentDataController);

//get order data
router.post("/getOrderData", getOrderDataController);
//update order data
router.post("/updateOrderData", updateOrderDataController);

export default router;
