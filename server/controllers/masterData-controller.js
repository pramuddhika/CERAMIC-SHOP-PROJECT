import {
  getMasterDataService,
  addMasterDataService,
  updateMasterDataService,
} from "../services/masterData-service.js";

//get data from db
export const getMasterDataController = async (req, res) => {
  const { tname } = req.params;
  if (!tname) {
    return res.status(400).json({ error: "Missing required data" });
  }
  try {
    const masterDataResponse = await getMasterDataService(tname);
    res.status(200).json(masterDataResponse);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//add data to db
export const addMasterDataController = async (req, res) => {
  const { tname } = req.params;
  const { tag, description, status } = req.body;

  if (!tname || !tag || !description || !status) {
    return res.status(400).json({ error: "Missing required data!" });
  }

  try {
    const masterDataAddResponse = await addMasterDataService(
      tname,
      tag,
      description,
      status
    );
    res.status(200).json(masterDataAddResponse);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//update data in db
export const updateMasterDataController = async (req, res) => {
  const { tname } = req.params;
  const { tag, description, status } = req.body;

  if (!tname || !tag || !description) {
    return res.status(400).json({ error: "Missing required data!" });
  }

  try {
    const masterDataUpdateResponse = await updateMasterDataService(
      tname,
      tag,
      description,
      status
    );
    res.status(200).json(masterDataUpdateResponse);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
