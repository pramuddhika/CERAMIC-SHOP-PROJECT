import express from "express";
import {
  getMasterDataController,
  addMasterDataController,
} from "../controllers/masterData-controller.js";

const router = express.Router();

//get data from db
router.get("/get/:tname", getMasterDataController);
//add data to db
router.post("/add/:tname", addMasterDataController);

export default router;
