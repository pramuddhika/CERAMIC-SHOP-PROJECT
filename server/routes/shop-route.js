import express from 'express';
import { addCartDataController } from '../controllers/shop-controller.js';

const router = express.Router();

//add caert data
router.post('/addCartData',  addCartDataController);

export default router;