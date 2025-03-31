import {
  getCardDataSerrvice,
  getMeterialPieChartService,
  getStrockPieChartService,
  getPast30DaysOrdersService
} from "../services/dashboard-service.js";

// get card data for dashboard
export const getCardDataController = async (req, res) => {
  try {
    const response = await getCardDataSerrvice();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get material pie chart data
export const getMeterialPieChartController = async (req, res) => {
  try {
    const response = await getMeterialPieChartService();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get stock pie chart data
export const getStrockPieChartController = async (req, res) => {
  try {
    const response = await getStrockPieChartService();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get past 30 days order data
export const getPast30DaysOrdersController = async (req, res) => {
  try {
    const response = await getPast30DaysOrdersService();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
