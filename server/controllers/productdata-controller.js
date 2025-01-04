import {
  getLastIDService,
  addNewCategoryService,
  getCategoryDataService,
  updateCategoryService,
  getCategoryDataListService,
  addSubNewCategoryService,
  updateSubCategoryService,
  getSubCategoryDataListService,
  addNewProductService,
  updateProductService,
  getCategoryListService,
  getProductService
} from "../services/productdata-service.js";

//generate categoty-subcategory-product id
export const generateIDController = async (req, res) => {
  const { tname } = req.params;
  if (!tname) {
    return res.status(400).json({ error: "Missing required data" });
  }
  //get last id from db
  try {
    const lastID = await getLastIDService(tname);
    res.status(200).json(lastID);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//add new category
export const addNewCategoryController = async (req, res) => {
  const { code, name, description, status } = req.body;
  const image = req.file ? req.file.filename : null;
  if (!code || !name || !description || !status || !image) {
    return res.status(400).json({ error: "All data required!" });
  }
  try {
    const addNewCatergoryResponse = await addNewCategoryService(code, name, description, image, status);
    res.status(200).json(addNewCatergoryResponse);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//get paginated product data
export const getCategoryDataController = async (req, res) => {
  const { tname } = req.params;
  const { page, limit } = req.query;
  try {
    const categoryData = await getCategoryDataService(tname,page,limit);
    res.status(200).json(categoryData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//edit category
export const updateCategoryController = async (req, res) => {
  const { code } = req.params;
  const { name, description, status } = req.body;
  const image = req.file ? req.file.filename : null;
  if (!code || !name || !description || !status) {
    return res.status(400).json({ error: "All data required!" });
  }
  try {
    const updateCategoryResponse = await updateCategoryService(code, name, description, image, status);
    res.status(200).json(updateCategoryResponse);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//get category data list
export const getCategoryDataListController = async (req, res) => {
  try {
    const categoryData = await getCategoryDataListService();
    res.status(200).json(categoryData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//add new subcategory
export const addNewSubCategoryController = async (req, res) => {
  const { code,category, name, description, status } = req.body;
  const image = req.file ? req.file.filename : null;
  if (!code || !name || !description || !status || !image) {
    return res.status(400).json({ error: "All data required!" });
  }
  try {
    const addNewCatergoryResponse = await addSubNewCategoryService(code,category, name, description, image, status);
    res.status(200).json(addNewCatergoryResponse);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//update subcategory data
export const updateSubCategoryDataController = async (req, res) => {
  const { code } = req.params;
  const { name, description, status, category } = req.body;
  const image = req.file ? req.file.filename : null;
  if (!code || !name || !description || !status || !category) {
    return res.status(400).json({ error: "All data required!" });
  }
  try {
    const updateSubCategoryResponse = await updateSubCategoryService(code, name, description, image, status , category);
    res.status(200).json(updateSubCategoryResponse);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//get subcategory data list
export const getSubCategoryDataListController = async (req, res) => {
  try {
    const categoryData = await getSubCategoryDataListService();
    res.status(200).json(categoryData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//add new product
export const addNewProductController = async (req, res) => {
  const { code,category,subcategory, name, description, status, price } = req.body;
  const image = req.file ? req.file.filename : null;
  if (!code || !name || !description || !status || !image || !category || !subcategory || !price) {
    return res.status(400).json({ error: "All data required!" });
  }
  try {
    const addNewCatergoryResponse = await addNewProductService(code,category,subcategory, name, description, image, status, price);
    res.status(200).json(addNewCatergoryResponse);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//edit product data
export const updateProductDataController = async (req, res) => {
  const { code } = req.params;
  const { name, description, status, category, subcategory, price } = req.body;
  const image = req.file ? req.file.filename : null;
  if (!code || !name || !description || !status || !category || !subcategory || !price) {
    return res.status(400).json({ error: "All data required!" });
  }
  try {
    const updateProductResponse = await updateProductService(code, name, description, image, status , category, subcategory, price);
    res.status(200).json(updateProductResponse);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//get subcategory according to selected category
export const getCategoryListController = async (req, res) => {
  const { category } = req.params;
  if (!category) {
    return res.status(400).json({ error: "Missing required data" });
  }
  try {
    const categoryList = await getCategoryListService(category);
    res.status(200).json(categoryList);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//get product data according to selected sub category
export const getCategoryController = async (req, res) => {
  const { subcategory } = req.params;
  if (!subcategory) {
    return res.status(400).json({ error: "Missing required data" });
  }
  try {
    const categoryList = await getProductService(subcategory);
    res.status(200).json(categoryList);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};