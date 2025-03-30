import { getPaymentDataService } from "../services/sales-service.js";

//get payment data
export const getPaymentDataController = async (req, res) => {
    const { page, limit } = req.query;
    console.log("page", page, "limit", limit);
    try {
        const paymentData = await getPaymentDataService(page, limit);
        res.status(200).json(paymentData);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

