import {
  addCartDataService,
  getCartDataService,
  addAddressDataService,
  getAddressDataService,
  deleteCartDataService,
  getAddressTagsService,
  getAddressDataByTagService,
  getOrderIdService
} from "../services/shop-service.js";

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
  const {
    userId,
    city,
    district,
    line1,
    line2,
    phoneNumber,
    state,
    tag,
    zipCode,
  } = req.body;
  if (
    !userId ||
    !city ||
    !district ||
    !line1 ||
    !line2 ||
    !phoneNumber ||
    !state ||
    !tag ||
    !zipCode
  ) {
    return res.status(400).json({ error: "All data required!" });
  }
  try {
    const addressItem = await addAddressDataService(
      userId,
      city,
      district,
      line1,
      line2,
      phoneNumber,
      state,
      tag,
      zipCode
    );
    res.status(200).json(addressItem);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//get address data
export const getAddressDataController = async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).json({ error: "Something went wrong!" });
  }
  try {
    const addressData = await getAddressDataService(userId);
    res.status(200).json(addressData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//get cart data
export const getCartDataController = async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).json({ error: "Something went wrong!" });
  }
  try {
    const cartData = await getCartDataService(userId);
    res.status(200).json(cartData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//delete cart data
export const deleteCartDataController = async (req, res) => {
  const { userId, productCode } = req.body;
  if (!userId || !productCode) {
    return res.status(400).json({ error: "Something went wrong!" });
  }
  try {
    const cartData = await deleteCartDataService(userId, productCode);
    res.status(200).json(cartData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//get address tags
export const getAddressTagController = async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).json({ error: "Something went wrong!" });
  }
  try {
    const addressTagData = await getAddressTagsService(userId);
    res.status(200).json(addressTagData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//get address data by tag
export const getAddressDataByTagController = async (req, res) => {
  const { userId, tag } = req.params;
  if (!userId || !tag) {
    return res.status(400).json({ error: "Something went wrong!" });
  }
  try {
    const addressData = await getAddressDataByTagService(userId, tag);
    res.status(200).json(addressData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//get order id
export const getorderIdController = async (req, res) => {
  try {
    const orderId = await getOrderIdService();
    res.status(200).json(orderId);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
