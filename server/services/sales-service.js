import { db } from "../env.js";

//get payment data
export const getPaymentDataService = async (page = 1, limit = 5) => {
  return new Promise((resolve, reject) => {
    const offset = (page - 1) * limit;

    const query = `SELECT 
      orders.ORDER_ID, orders.DATE, orders.STATUS, orders.VALUE,
      payment.DATE AS PAYMENT_DATE, payment.PAID_VALUE, payment.PAYMENT_STATUS, payment.PATMENT_TYPE
      FROM payment
      JOIN orders ON payment.ORDER_ID = orders.ORDER_ID
      ORDER BY payment.ORDER_ID DESC 
      LIMIT ? OFFSET ?`;

    const countQuery = `SELECT COUNT(*) AS total FROM payment`;

    db.query(query, [parseInt(limit), parseInt(offset)], (err, result) => {
      if (err) {
        return reject({ message: err });
      }

      db.query(countQuery, (err, countResult) => {
        if (err) {
          return reject({ message: "Something went wrong, Please try again!" });
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
