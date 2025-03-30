import { db } from "../env.js";

//get payment data
export const getPaymentDataService = async (page = 1, limit = 5, searchQuery = "") => {
  return new Promise((resolve, reject) => {
    const offset = (page - 1) * limit;

    let query = `SELECT 
      orders.ORDER_ID, orders.DATE, orders.STATUS, orders.VALUE,
      payment.DATE AS PAYMENT_DATE, payment.PAID_VALUE, payment.PAYMENT_STATUS, payment.PATMENT_TYPE
      FROM payment
      JOIN orders ON payment.ORDER_ID = orders.ORDER_ID`;

    let countQuery = `SELECT COUNT(*) AS total FROM payment JOIN orders ON payment.ORDER_ID = orders.ORDER_ID`;

    const queryParams = [];
    
    // Apply search condition if searchQuery is provided
    if (searchQuery) {
      query += ` WHERE orders.ORDER_ID LIKE ?`;
      countQuery += ` WHERE orders.ORDER_ID LIKE ?`;
      queryParams.push(`%${searchQuery}%`);
    }

    query += ` ORDER BY payment.ORDER_ID DESC LIMIT ? OFFSET ?`;
    queryParams.push(parseInt(limit), parseInt(offset));

    db.query(query, queryParams, (err, result) => {
      if (err) {
        return reject({ message: "Something went wrong, Please try again!"});
      }

      db.query(countQuery, [searchQuery ? `%${searchQuery}%` : null], (err, countResult) => {
        if (err) {
          return reject({ message: "Something went wrong, Please try again!", error: err });
        }

        const total = countResult[0].total;
        const totalPages = Math.ceil(total / limit);

        resolve({
          data: result,
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages,
        });
      });
    });
  });
};

//update payment data
export const updatePaymentDataService = async (newPayment, orderId, paymentStatus) => {
  return new Promise((resolve, reject) => {
    const query = `UPDATE payment SET PAID_VALUE = PAID_VALUE + ? , PAYMENT_STATUS = ? WHERE ORDER_ID = ?`;
    db.query(query, [newPayment, paymentStatus, orderId], (err, result) => {
      if (err) {
        return reject({ message: "Something went wrong, Please try again!"});
      }
      resolve({
        message: "Payment data updated successfully"
      });
    });
  });
};

