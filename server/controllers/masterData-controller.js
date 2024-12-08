import { getMasterDataService } from "../services/masterData-service.js";

//get data from db
export const getMasterDataController = async (req, res) => {
  const { tname } = req.params;
  if (!tname) {
    return res.status(400).json({ error: "Prameters are missing" });
  }
  try {
    const masterDataResponse = await getMasterDataService(tname);
    res.status(200).json(masterDataResponse);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
