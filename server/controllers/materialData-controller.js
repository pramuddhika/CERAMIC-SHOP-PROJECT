import {
  getLastMaterialIDService,
  addMaterialDataService,
  getMaterialDataService,
  editMaterialDataService,
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