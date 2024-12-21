import express from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";
import {
  generateIDController,
  addNewCategoryController,
  getCategoryDataController,
} from "../controllers/productdata-controller.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "images";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage: storage,
});

//get category-subcategoty-product ID
router.get("/get/:tname", generateIDController);
//add new category
router.post("/add/category", upload.single('image'), addNewCategoryController);
//get paginated product data
router.get("/get/tableData/:tname", getCategoryDataController);

export default router;