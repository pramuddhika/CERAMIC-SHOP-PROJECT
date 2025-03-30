import express from "express";
import {
  getPaymentDataController,
  updatePaymentDataController,
} from "../controllers/sales-controller.js";

const router = express.Router();

//get payment data
router.post("/getPaymentData", getPaymentDataController);
//update payment data
router.post("/updatePaymentData", updatePaymentDataController);

export default router;
