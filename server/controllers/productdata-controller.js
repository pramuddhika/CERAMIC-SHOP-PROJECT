import {
    getLastIDService,
    addNewCategoryService,
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
    const image = req.file.filename;
    console.log("body",req.body);
    console.log("666",req.file.filename);
  
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