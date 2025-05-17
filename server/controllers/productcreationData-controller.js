import {
  addprojectcreationDataService,
  editProjectcreationDataService,
  getProductListService,
  getProductstockDataService,
  getProjectcreationDataService,
} from "../services/productcreationData-service.js";

export const addproductcreationController = async (req, res) => {
  const { product_code, create_date, quantity, stage } = req.body;
  if (!product_code || !create_date || !quantity || !stage) {
    return res.status(400).json({ error: "All data required!" });
  }
  try {
    const addprojectcreationDataResponse = await addprojectcreationDataService(
      product_code,
      create_date,
      quantity,
      stage
    );
    res.status(200).json(addprojectcreationDataResponse);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// get productcreation data
export const getproductcreationDataController = async (req, res) => {
  const { page, limit, product} = req.query;
  try {
    const productcreationData = await getProjectcreationDataService(
      page,
      limit,
      product
    );
    res.status(200).json(productcreationData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// edit productcreation data
export const editproductcreationDataController = async (req, res) => {
  const { product_code, updated_date, quantity, damage_count, stage } =
    req.body;
  const { id } = req.params;
  try {
    const editproductcreationDataResponse =
      await editProjectcreationDataService(
        product_code,
        updated_date,
        quantity,
        damage_count,
        stage,
        id
      );
    res.status(200).json(editproductcreationDataResponse);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export const getProductstockDataController = async (req, res) => {
  const { search } = req.query;
  try {
    const ProductData = await getProductstockDataService(search);
    res.status(200).json(ProductData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
// get product list
export const getProductListController = async (req, res) => {
  try {
    const productlist = await getProductListService();
    res.status(200).json(productlist);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
