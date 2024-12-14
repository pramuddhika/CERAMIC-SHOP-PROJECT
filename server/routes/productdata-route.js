import express from 'express';
import { generateIDController } from '../controllers/productdata-controller.js';

const router = express.Router();

//get category-subcategoty-product ID
router.get("/get/:tname", generateIDController);


export default router;