import {
  getLastMaterialIDService,
  addMaterialDataService,
  getMaterialDataService,
  editMaterialDataService,
  getMaterialListService,
  getMaterialStockService,
  addMaterialReceivedDataService,
  getMaterialReceivedDataService,
} from "../services/materialData-service.js";

// generate material ID
export const generateMaterialIDController = async (req, res) => {
  try {
    const lastID = await getLastMaterialIDService();
    res.status(200).json(lastID);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// add material data
export const addMaterialDataController = async (req, res) => { 
  const { code, name, description, status } = req.body;
  if (!code || !name || !description || !status) {
    return res.status(400).json({ error: "All data required!" });
  }
  try {
    const addMaterialDataResponse = await addMaterialDataService(code, name, description, status);
    res.status(200).json(addMaterialDataResponse);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// get material data
export const getMaterialDataController = async (req, res) => {
  const { page, limit } = req.query;
  try {
    const materialData = await getMaterialDataService(page , limit);
    res.status(200).json(materialData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// edit material data
export const editMaterialDataController = async (req, res) => {
  const { code, name, description, status } = req.body;
  if (!code || !name || !description || !status) {
    return res.status(400).json({ error: "All data required!" });
  }
  try {
    const editMaterialDataResponse = await editMaterialDataService(code, name, description, status);
    res.status(200).json(editMaterialDataResponse);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//get material data list
export const getMaterialListController = async (req, res) => {
  try {
    const materialList = await getMaterialListService();
    res.status(200).json(materialList);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//get meterila stock data
export const getMaterialStockController = async (req, res) => {
  const { search } = req.query;
  try {
    const materialStock = await getMaterialStockService(search);
    res.status(200).json(materialStock);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//add material received note data
export const addMaterialReceivedDataController = async (req, res) => {
  const { materialId, supplierId, date, quantity, value } = req.body;
  if (!materialId || !supplierId || !date || !quantity || !value) {
    return res.status(400).json({ error: "All data required!" });
  }
  try {
    const addMaterialReceivedDataResponse = await addMaterialReceivedDataService(materialId, supplierId, date, quantity, value);
    res.status(200).json(addMaterialReceivedDataResponse);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//get meteril recied note data
export const getMaterialReceivedDataController = async (req, res) => {
  const { page, limit } = req.query;
  try {
    const materialReceivedData = await getMaterialReceivedDataService(page, limit);
    res.status(200).json(materialReceivedData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};