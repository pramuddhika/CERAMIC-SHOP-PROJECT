import { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
} from "chart.js";
import { Doughnut, Line, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement
);

const DashBoard = () => {
  const [cardsData, setCardsData] = useState([]);
  const [materialPieChartData, setMaterialPieChartData] = useState([]);
  const [stockPieChartData, setStockPieChartData] = useState([]);
  const [past30DaysOrderData, setPast30DaysOrderData] = useState([]);
  const [monthlyIncomeExpenseData, setMonthlyIncomeExpenseData] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem("User"));

  const fecthCardsData = async () => {
    try {
      const cardData = await axios.get("/api/dashboard/cardData");
      setCardsData(cardData.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fecthMaterialPieChartData = async () => {
    try {
      const materialPieChartData = await axios.get(
        "/api/dashboard/materialPieChart"
      );
      setMaterialPieChartData(materialPieChartData.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fecthStockPieChartData = async () => {
    try {
      const stockPieChartData = await axios.get("/api/dashboard/stockPieChart");
      setStockPieChartData(stockPieChartData.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fecthPast30DaysOrderData = async () => {
    try {
      const past30DaysOrderData = await axios.get(
        "/api/dashboard/past30DaysOrder"
      );
      setPast30DaysOrderData(past30DaysOrderData.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fecthMonthlyIncomeExpenseData = async () => {
    try {
      const monthlyIncomeExpenseData = await axios.get(
        "/api/dashboard/monthlyIncomeExpense"
      );
      setMonthlyIncomeExpenseData(monthlyIncomeExpenseData.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fecthCardsData();
    fecthMaterialPieChartData();
    fecthStockPieChartData();
    fecthPast30DaysOrderData();
    fecthMonthlyIncomeExpenseData();
  }, []);

  return (
    <div className="flex flex-col">
      {currentUser.role !== "Stock Manager" && (
        <>
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg p-4 transition-all hover:shadow-xl hover:scale-[1.02]">
              <div className="h-full flex flex-col justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    Total Income
                  </h1>
                  <p className="text-sm text-gray-600">Last 30 Days</p>
                </div>
                <div className="text-3xl font-bold text-blue-600 mt-2">
                  Rs.{cardsData.totalIncome30}
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl shadow-lg p-4 transition-all hover:shadow-xl hover:scale-[1.02]">
              <div className="h-full flex flex-col justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    Total Expense
                  </h1>
                  <p className="text-sm text-gray-600">Last 30 Days</p>
                </div>
                <div className="text-3xl font-bold text-red-600 mt-2">
                  Rs.{cardsData.totalExpense30}
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-lg p-4 transition-all hover:shadow-xl hover:scale-[1.02]">
              <div className="h-full flex flex-col justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    Total Order
                  </h1>
                  <p className="text-sm text-gray-600">Last 30 Days</p>
                </div>
                <div className="text-3xl font-bold text-green-600 mt-2">
                  {cardsData.totalOrderCount30}
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-lg p-4 transition-all hover:shadow-xl hover:scale-[1.02]">
              <div className="h-full flex flex-col justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    Total Active Customer
                  </h1>
                  <p className="text-sm text-gray-600">Last 30 Days</p>
                </div>
                <div className="text-3xl font-bold text-purple-600 mt-2">
                  {cardsData.activeCustomer30}
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl shadow-lg p-4 transition-all hover:shadow-xl hover:scale-[1.02]">
              <div className="h-full flex flex-col justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    Pending Income
                  </h1>
                  <p className="text-sm text-gray-600">Last 30 Days</p>
                </div>
                <div className="text-3xl font-bold text-yellow-600 mt-2">
                  Rs.{cardsData.pendingIncome}
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-lg p-4 transition-all hover:shadow-xl hover:scale-[1.02]">
              <div className="h-full flex flex-col justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    Pending Expense
                  </h1>
                  <p className="text-sm text-gray-600">Last 30 Days</p>
                </div>
                <div className="text-3xl font-bold text-orange-600 mt-2">
                  Rs.{cardsData.pendingExpense}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {currentUser.role !== "Sales Manager" && (
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 h-[400px] transition-all hover:shadow-xl relative">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Material Distribution
            </h2>
            <div className="h-[320px]">
              {materialPieChartData.materialNames && (
                <Doughnut
                  data={{
                    labels: materialPieChartData.materialNames,
                    datasets: [
                      {
                        data: materialPieChartData.materialQuantities,
                        backgroundColor: [
                          "#FF6384",
                          "#36A2EB",
                          "#FFCE56",
                          "#4BC0C0",
                          "#9966FF",
                          "#FF9F40",
                        ],
                        borderColor: [
                          "#FF6384",
                          "#36A2EB",
                          "#FFCE56",
                          "#4BC0C0",
                          "#9966FF",
                          "#FF9F40",
                        ],
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "left",
                      },
                    },
                  }}
                />
              )}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 h-[400px] transition-all hover:shadow-xl relative">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Product Stock Distribution
            </h2>
            <div className="h-[320px]">
              {stockPieChartData.productNames && (
                <Doughnut
                  data={{
                    labels: stockPieChartData.productNames,
                    datasets: [
                      {
                        data: stockPieChartData.productQuantities,
                        backgroundColor: [
                          "#FF6384",
                          "#36A2EB",
                          "#FFCE56",
                          "#4BC0C0",
                          "#9966FF",
                          "#FF9F40",
                          "#4CAF50",
                          "#9C27B0",
                        ],
                        borderColor: [
                          "#FF6384",
                          "#36A2EB",
                          "#FFCE56",
                          "#4BC0C0",
                          "#9966FF",
                          "#FF9F40",
                          "#4CAF50",
                          "#9C27B0",
                        ],
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "left",
                      },
                    },
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6 mb-6 mt-3">
        {currentUser.role !== "Stock Manager" && (
          <div className="bg-white rounded-xl shadow-lg p-6 h-[400px] transition-all hover:shadow-xl relative">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Orders Last 30 Days
            </h2>
            <div className="h-[320px]">
              {past30DaysOrderData.dates && (
                <Line
                  data={{
                    labels: past30DaysOrderData.dates,
                    datasets: [
                      {
                        label: "Daily Orders",
                        data: past30DaysOrderData.orderCounts,
                        borderColor: "#FF6384",
                        backgroundColor: "rgba(255, 99, 132, 0.5)",
                        tension: 0.4,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          stepSize: 1,
                        },
                      },
                    },
                  }}
                />
              )}
            </div>
          </div>
        )}
        {currentUser.role === "Admin" && (
          <div className="bg-white rounded-xl shadow-lg p-6 h-[400px] transition-all hover:shadow-xl relative">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Monthly Income vs Expense
            </h2>
            <div className="h-[320px]">
              {monthlyIncomeExpenseData.months && (
                <Bar
                  data={{
                    labels: monthlyIncomeExpenseData.months,
                    datasets: [
                      {
                        label: "Income",
                        data: monthlyIncomeExpenseData.income,
                        backgroundColor: "rgba(75, 192, 192, 0.7)",
                        borderColor: "rgb(75, 192, 192)",
                        borderWidth: 1,
                      },
                      {
                        label: "Expense",
                        data: monthlyIncomeExpenseData.expense,
                        backgroundColor: "rgba(255, 99, 132, 0.7)",
                        borderColor: "rgb(255, 99, 132)",
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          callback: function (value) {
                            return "Rs." + value;
                          },
                        },
                      },
                    },
                  }}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashBoard;
