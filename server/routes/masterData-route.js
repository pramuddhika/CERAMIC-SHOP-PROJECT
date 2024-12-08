import express from "express";
import {
  getMasterDataController,
  addMasterDataController,
  updateMasterDataController,
} from "../controllers/masterData-controller.js";

const router = express.Router();

//get data from db
router.get("/get/:tname", getMasterDataController);
//add data to db
router.post("/add/:tname", addMasterDataController);
//update data in db
router.put("/update/:tname", updateMasterDataController);

export default router;
