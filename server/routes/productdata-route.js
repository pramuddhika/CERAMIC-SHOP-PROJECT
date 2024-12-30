import express from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";
import {
  generateIDController,
  addNewCategoryController,
  getCategoryDataController,
  updateCategoryController,
  getCategoryDataListController,
  addNewSubCategoryController,
  updateSubCategoryDataController
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

//get category data list
router.get("/get/categoryList", getCategoryDataListController);
//get category-subcategoty-product ID
router.get("/get/:tname", generateIDController);
//add new category
router.post("/add/category", upload.single('image'), addNewCategoryController);
//get paginated product data
router.get("/get/tableData/:tname", getCategoryDataController);
//edit category
router.put("/update/category/:code", upload.single('image'), updateCategoryController);
//add new subcategory
router.post("/add/subcategory", upload.single('image'), addNewSubCategoryController);
//edit subcategory data
router.put("/update/subcategory/:code", upload.single('image'), updateSubCategoryDataController);

export default router;