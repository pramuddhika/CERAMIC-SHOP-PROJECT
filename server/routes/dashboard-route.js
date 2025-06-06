import express from "express";
import {
  getCardDataController,
  getMeterialPieChartController,
  getStrockPieChartController,
  getPast30DaysOrdersController,
  getMonthlyIncomeExpenseController
} from "../controllers/dashboard-controller.js";

const router = express.Router();

//get dashboard card data
router.get("/cardData", getCardDataController);
//get material pie chart data
router.get("/materialPieChart", getMeterialPieChartController);
//get stock pie chart data
router.get("/stockPieChart", getStrockPieChartController);
//past 30 day order
router.get("/past30DaysOrder", getPast30DaysOrdersController);
//monthly income and expense
router.get("/monthlyIncomeExpense", getMonthlyIncomeExpenseController);

export default router;
