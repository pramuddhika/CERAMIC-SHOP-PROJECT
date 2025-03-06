import {
  getLastMaterialIDService,
  addMaterialDataService,
  getMaterialDataService,
  editMaterialDataService,
  getMaterialListService,
  getMaterialStockService,
  addMaterialReceivedDataService,
  getMaterialReceivedDataService,
  qualityUpdateService,
  addMaterialUsageDataService,
  getMaterialUsageDataService,
  getPaymentDataService,
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
  const { page, limit, material, supplier} = req.query;
  try {
    const materialReceivedData = await getMaterialReceivedDataService(page, limit ,material, supplier);
    res.status(200).json(materialReceivedData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// quality update
export const qualityUpdateController = async (req, res) => {
  const { materialId, date, supplierId, quality, quantity } = req.body;
  console.log(req.body)
  if (!materialId ||!date ||!supplierId ||!quality ||!quantity) {
    return res.status(400).json({ error: "All data required!" });
  }
  try {
    const qualityUpdateResponse = await qualityUpdateService(materialId, date, supplierId,quality , quantity);
    res.status(200).json(qualityUpdateResponse);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// add meteral usage data
export const addMaterialUsageDataController = async (req, res) => {
  const { materialId, date, quantity } = req.body;
  if (!materialId || !date || !quantity ) {
    return res.status(400).json({ error: "All data required!" });
  }
  try {
    const addMaterialUsageDataResponse = await addMaterialUsageDataService(materialId, date, quantity);
    res.status(200).json(addMaterialUsageDataResponse);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//get meterial usage data
export const getMaterialUsageDataController = async (req, res) => {
  const { page, limit, material } = req.query;
  try {
    const materialUsageData = await getMaterialUsageDataService(page, limit, material);
    res.status(200).json(materialUsageData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//GET payment data
export const getPaymentDataController = async (req, res) => {
  const { page, limit, material, supplier } = req.query;
  try {
    const paymentData = await getPaymentDataService(page, limit , material, supplier);
    res.status(200).json(paymentData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};