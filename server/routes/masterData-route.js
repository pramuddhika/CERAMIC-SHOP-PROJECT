import express from 'express';
import { getMasterDataController } from '../controllers/masterData-controller.js';

const router = express.Router();

//get data from db
router.get("/get/:tname", getMasterDataController);

export default router;