import express from 'express';
import { getPaymentDataController } from '../controllers/sales-controller.js';

const router = express.Router();

//get payment data
router.post('/getPaymentData' , getPaymentDataController);

export default router;