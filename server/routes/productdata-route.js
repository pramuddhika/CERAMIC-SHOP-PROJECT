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
  updateSubCategoryDataController,
  getSubCategoryDataListController,
  addNewProductController,
  updateProductDataController,
  getCategoryListController,
  getCategoryController,
  getShopProductController
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

//get active product data
router.get("/get/shop/product", getShopProductController);
//get product data accoring to selected sun category
router.get("/get/product/:subcategory", getCategoryController);
// geta subcatory according to selected category
router.get("/get/category/:category", getCategoryListController);
//get subcategory data list 
router.get("/get/subcategoryList", getSubCategoryDataListController);
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
//add new product
router.post("/add/product", upload.single('image'), addNewProductController);
//edit product data
router.put("/update/product/:code", upload.single('image'), updateProductDataController);

export default router;