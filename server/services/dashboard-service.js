import { db } from "../env.js";

//get card data for dashboard
export const getCardDataSerrvice = async () => {
  return new Promise((resolve, reject) => {
    const past30DaysIncomequery = `SELECT SUM(PAID_VALUE) AS TOTAL_INCOME FROM payment WHERE DATE >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)`;
    const past30DaysExpensequery = `SELECT SUM(PAID_VALUE) AS TOTAL_EXPENSE FROM material_received_note WHERE DATE >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)`;
    const psdt30OrderCountquery = `SELECT COUNT(*) AS TOTAL_ORDER FROM orders WHERE DATE >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)`;
    const past30DaysActiveCustomerquery = `SELECT COUNT(DISTINCT USER_ID) AS TOTAL_CUSTOMER FROM orders WHERE DATE >= DATE_SUB(CURDATE(), INTERVAL 30 DAY);`;
    const pengingTotalIncomequery = `SELECT (SELECT SUM(VALUE) FROM orders) - (SELECT SUM(PAID_VALUE) FROM payment) AS TOTAL_PENDING_INCOME;`;
    const pendingTotalExpensequery = `SELECT (SELECT SUM(MATERIAL_VALUE) FROM material_received_note) - (SELECT SUM(PAID_VALUE) FROM material_received_note) AS TOTAL_PENDING_EXPENSE;`;

    db.query(past30DaysIncomequery, (err, incomeResult) => {
      if (err) {
        reject({ message: "Something went wrong, Please try again!" });
        return;
      }
      db.query(past30DaysExpensequery, (err, expenseResult) => {
        if (err) {
          reject({ message: "Something went wrong, Please try again!" });
          return;
        }
        db.query(psdt30OrderCountquery, (err, orderResult) => {
          if (err) {
            reject({ message: "Something went wrong, Please try again!" });
            return;
          }
          db.query(past30DaysActiveCustomerquery, (err, customerResult) => {
            if (err) {
              reject({ message: "Something went wrong, Please try again!" });
              return;
            }
            db.query(pengingTotalIncomequery, (err, pendingResult) => {
              if (err) {
                reject({ message: "Something went wrong, Please try again!" });
                return;
              }
              db.query(
                pendingTotalExpensequery,
                (err, pendingExpenseResult) => {
                  if (err) {
                    reject({
                      message: "Something went wrong, Please try again!",
                    });
                    return;
                  }
                  const pendingExpense =
                    pendingExpenseResult[0].TOTAL_PENDING_EXPENSE || 0;
                  const pendingIncome =
                    pendingResult[0].TOTAL_PENDING_INCOME || 0;
                  const activeCustomer30 =
                    customerResult[0].TOTAL_CUSTOMER || 0;
                  const totalOrderCount30 = orderResult[0].TOTAL_ORDER || 0;
                  const totalIncome30 = incomeResult[0].TOTAL_INCOME || 0;
                  const totalExpense30 = expenseResult[0].TOTAL_EXPENSE || 0;

                  resolve({
                    totalIncome30,
                    totalExpense30,
                    totalOrderCount30,
                    activeCustomer30,
                    pendingIncome,
                    pendingExpense,
                  });
                }
              );
            });
          });
        });
      });
    });
  });
};

//get material pie chart data
export const getMeterialPieChartService = async () => {
  return new Promise((resolve, reject) => {
    const query = `SELECT material.NAME AS MATERIAL_NAME, material_stock.QUANTITY AS MATERIAL_QUANTITY
      FROM material_stock
      JOIN material ON material_stock.MATERIAL_ID = material.MATERIAL_ID
      GROUP BY material.NAME, material_stock.QUANTITY`;
    db.query(query, (err, result) => {
      if (err) {
        reject({ message: "Something went wrong, Please try again!" });
        return;
      }

      const materialNames = result.map((item) => item.MATERIAL_NAME);
      const materialQuantities = result.map((item) =>
        parseFloat(item.MATERIAL_QUANTITY)
      );

      resolve({
        materialNames,
        materialQuantities,
      });
    });
  });
};

//get stock pie chart data
export const getStrockPieChartService = async () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT product.NAME AS PRODUCT_NAME, SUM(production.QUANTITY) AS PRODUCT_QUANTITY
      FROM production
      JOIN product ON product.PRODUCT_CODE = production.PRODUCT_CODE
      GROUP BY product.NAME
    `;

    db.query(query, (err, result) => {
      if (err) {
        reject({ message: "Something went wrong, Please try again!" });
        return;
      }

      const productNames = result.map((item) => item.PRODUCT_NAME);
      const productQuantities = result.map((item) =>
        parseFloat(item.PRODUCT_QUANTITY)
      );

      resolve({
        productNames,
        productQuantities,
      });
    });
  });
};

//get past 30 days order data
export const getPast30DaysOrdersService = async () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT DATE_FORMAT(DATE, '%Y-%m-%d') AS ORDER_DATE, COUNT(*) AS ORDER_COUNT
      FROM orders
      WHERE DATE >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
      GROUP BY ORDER_DATE
      ORDER BY ORDER_DATE
    `;

    db.query(query, (err, result) => {
      if (err) {
        reject({ message: "Something went wrong, Please try again!" });
        return;
      }

      // Generate an array of past 30 days
      const datesMap = new Map();
      const today = new Date();
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        const formattedDate = date.toISOString().split("T")[0]; // Format: YYYY-MM-DD
        datesMap.set(formattedDate, 0); // Default to 0
      }

      // Fill in actual data from the database
      result.forEach((item) => {
        datesMap.set(item.ORDER_DATE, parseInt(item.ORDER_COUNT, 10));
      });

      // Extract final arrays
      const dates = [...datesMap.keys()];
      const orderCounts = [...datesMap.values()];

      resolve({
        dates,
        orderCounts,
      });
    });
  });
};


