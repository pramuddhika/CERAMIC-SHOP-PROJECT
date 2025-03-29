import { addCartDataService } from "../services/shop-service.js";
import { addAddressDataService } from "../services/shop-service.js";

export const addCartDataController = async (req, res) => {
  const { productCode, quantity, userId } = req.body;
  if (!productCode || !quantity || !userId) {
    return res.status(400).json({ error: "All data required!" });
  }
  try {
    const cartItem = await addCartDataService(productCode, quantity, userId);
    res.status(200).json(cartItem);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//add address data
export const addAddressDataController = async (req, res) => {
  const { userId, city, district, line1, line2, phoneNumber, state, tag, zipCode} = req.body;
  if (!userId || !city || !district || !line1 || !line2 || !phoneNumber || !state || !tag || !zipCode) {
    return res.status(400).json({ error: "All data required!" });
  }
  try {
    const addressItem = await addAddressDataService(userId, city, district, line1, line2, phoneNumber, state, tag, zipCode);
    res.status(200).json(addressItem);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
