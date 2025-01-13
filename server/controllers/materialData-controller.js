import { getLastMaterialIDService } from "../services/materialData-service.js";

// generate material ID
export const generateMaterialIDController = async (req, res) => {
  try {
    const lastID = await getLastMaterialIDService();
    res.status(200).json(lastID);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};