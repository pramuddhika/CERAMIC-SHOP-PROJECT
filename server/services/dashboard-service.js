import { db } from "../env.js";

//get card data for dashboard
export const getCardDataSerrvice = async () => {
  return new Promise((resolve, reject) => {
    const past30DaysIncomequery = `SELECT SUM(PAID_VALUE) AS TOTAL_INCOME FROM payment WHERE DATE >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)`;
    const past30DaysExpensequery = `SELECT SUM(PAID_VALUE) AS TOTAL_EXPENSE FROM material_received_note WHERE DATE >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)`;
    const psdt30OrderCountquery = `SELECT COUNT(*) AS TOTAL_ORDER FROM orders WHERE DATE >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)`;
    const past30DaysActiveCustomerquery = `SELECT COUNT(DISTINCT USER_ID) AS TOTAL_CUSTOMER FROM orders WHERE DATE >= DATE_SUB(CURDATE(), INTERVAL 30 DAY);`;
    const pengingTotalIncomequery = `SELECT (SELECT SUM(VALUE) FROM orders) - (SELECT SUM(PAID_VALUE) FROM payment) AS TOTAL_PENDING_INCOME;`;
    const pendingTotalExpensequery = `SELECT (SELECT SUM(MATERIAL_VALUE) FROM material_received_note WHERE QUALITY = 'passed') - (SELECT SUM(PAID_VALUE) FROM material_received_note WHERE QUALITY = 'passed') AS TOTAL_PENDING_EXPENSE;`;

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
      SELECT DATE_FORMAT(DATE, '%m-%d') AS ORDER_DATE, COUNT(*) AS ORDER_COUNT
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

      // Generate an array of past 30 days in MM-DD format
      const datesMap = new Map();
      const today = new Date();
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        const formattedDate = date
          .toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
          })
          .replace("/", "-"); // Convert MM/DD to MM-DD
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

//get monthly income and expense data
export const getMonthlyIncomeExpenseService = async () => {
  return new Promise((resolve, reject) => {
    const query = `
      WITH RECURSIVE months AS (
        SELECT 1 AS month_num
        UNION ALL
        SELECT month_num + 1
        FROM months
        WHERE month_num < 12
      ),
      last_12_months AS (
        SELECT 
          DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL m.month_num-1 MONTH), '%Y-%m-01') AS start_date,
          DATE_FORMAT(LAST_DAY(DATE_SUB(CURDATE(), INTERVAL m.month_num-1 MONTH)), '%Y-%m-%d') AS end_date,
          DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL m.month_num-1 MONTH), '%M') AS month_name
        FROM months m
        ORDER BY start_date ASC -- Changed from DESC to ASC
      ),
      income_data AS (
        SELECT 
          DATE_FORMAT(orders.DATE, '%Y-%m-01') AS month_date,
          COALESCE(SUM(payment.PAID_VALUE), 0) AS monthly_income
        FROM payment
        JOIN orders ON payment.ORDER_ID = orders.ORDER_ID
        WHERE orders.DATE >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
        GROUP BY month_date
      ),
      expense_data AS (
        SELECT 
          DATE_FORMAT(DATE, '%Y-%m-01') AS month_date,
          COALESCE(SUM(MATERIAL_VALUE), 0) AS monthly_expense
        FROM material_received_note
        WHERE DATE >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
        GROUP BY month_date
      )
      SELECT 
        m.month_name,
        COALESCE(i.monthly_income, 0) AS income,
        COALESCE(e.monthly_expense, 0) AS expense
      FROM last_12_months m
      LEFT JOIN income_data i ON m.start_date = i.month_date
      LEFT JOIN expense_data e ON m.start_date = e.month_date
      ORDER BY m.start_date ASC -- Changed from DESC to ASC
    `;

    db.query(query, (err, result) => {
      if (err) {
        reject({ message: "Something went wrong, Please try again!" });
        return;
      }

      const months = result.map(row => row.month_name);
      const income = result.map(row => parseFloat(row.income || 0));
      const expense = result.map(row => parseFloat(row.expense || 0));

      resolve({
        months,
        income,
        expense
      });
    });
  });
};

