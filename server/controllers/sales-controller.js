import {
  getPaymentDataService,
  updatePaymentDataService,
  getOrderDataService,
} from "../services/sales-service.js";

//get payment data
export const getPaymentDataController = async (req, res) => {
  const { page, limit, search } = req.query;
  try {
    const paymentData = await getPaymentDataService(page, limit, search);
    res.status(200).json(paymentData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//update payment data
export const updatePaymentDataController = async (req, res) => {
  const { newPayment, orderId, paymentStatus } = req.body;
  try {
    const paymentData = await updatePaymentDataService(
      newPayment,
      orderId,
      paymentStatus
    );
    res.status(200).json(paymentData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//get order data
export const getOrderDataController = async (req, res) => {
  const { page, limit, search } = req.query;
  try {
    const orderData = await getOrderDataService(page, limit, search);
    res.status(200).json(orderData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
