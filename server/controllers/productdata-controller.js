import { getLastIDService } from "../services/productdata-service.js";

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