import { db } from "../env.js";

//get payment data
export const getPaymentDataService = async (
  page = 1,
  limit = 5,
  searchQuery = ""
) => {
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
        return reject({ message: "Something went wrong, Please try again!" });
      }

      db.query(
        countQuery,
        [searchQuery ? `%${searchQuery}%` : null],
        (err, countResult) => {
          if (err) {
            return reject({
              message: "Something went wrong, Please try again!",
              error: err,
            });
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
        }
      );
    });
  });
};

//update payment data
export const updatePaymentDataService = async (
  newPayment,
  orderId,
  paymentStatus
) => {
  return new Promise((resolve, reject) => {
    const query = `UPDATE payment SET PAID_VALUE = PAID_VALUE + ? , PAYMENT_STATUS = ? WHERE ORDER_ID = ?`;
    db.query(query, [newPayment, paymentStatus, orderId], (err, result) => {
      if (err) {
        return reject({ message: "Something went wrong, Please try again!" });
      }
      resolve({
        message: "Payment data updated successfully",
      });
    });
  });
};

//get order data
export const getOrderDataService = async (
  page = 1,
  limit = 5,
  searchQuery = ""
) => {
  return new Promise((resolve, reject) => {
    const offset = (page - 1) * limit;

    let query = `SELECT 
      orders.ORDER_ID, orders.DATE AS createdDate, orders.STATUS AS orderStatus, orders.VALUE,
      payment.PAYMENT_STATUS AS paymentStatus,
      order_data.PRODUCT_CODE AS productCode, order_data.COMPLETED_QUANTITY AS completedQuantity,
      product.NAME AS productName, order_data.QUANTITY AS quantity
    FROM orders
    LEFT JOIN payment ON orders.ORDER_ID = payment.ORDER_ID
    LEFT JOIN order_data ON orders.ORDER_ID = order_data.ORDER_ID
    LEFT JOIN product ON order_data.PRODUCT_CODE = product.PRODUCT_CODE`;

    let countQuery = `SELECT COUNT(*) AS total FROM orders LEFT JOIN payment ON orders.ORDER_ID = payment.ORDER_ID`;

    const queryParams = [];

    if (searchQuery) {
      query += ` WHERE orders.ORDER_ID LIKE ?`;
      countQuery += ` WHERE orders.ORDER_ID LIKE ?`;
      queryParams.push(`%${searchQuery}%`);
    }

    query += ` ORDER BY orders.ORDER_ID DESC LIMIT ? OFFSET ?`;
    queryParams.push(parseInt(limit), parseInt(offset));

    db.query(query, queryParams, (err, result) => {
      if (err) {
        return reject({ message: err });
      }

      db.query(
        countQuery,
        [searchQuery ? `%${searchQuery}%` : null],
        (err, countResult) => {
          if (err) {
            return reject({
              message: "Something went wrong, Please try again!",
              error: err,
            });
          }

          const total = countResult[0].total;
          const totalPages = Math.ceil(total / limit);

          const formattedResult = result.reduce((acc, row) => {
            let order = acc.find((o) => o.orderId === row.ORDER_ID);
            if (!order) {
              order = {
                orderId: row.ORDER_ID,
                createdDate: row.createdDate,
                orderStatus: row.orderStatus,
                paymentStatus: row.paymentStatus,
                value: row.VALUE,
                orderData: [],
              };
              acc.push(order);
            }

            if (row.productCode) {
              order.orderData.push({
                productCode: row.productCode,
                productName: row.productName,
                quantity: row.quantity,
                completedQuantity: row.completedQuantity,
              });
            }

            return acc;
          }, []);

          resolve({
            data: formattedResult,
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages,
          });
        }
      );
    });
  });
};

//update order data
export const updateOrderDataService = async (
  orderId,
  orderStatus,
  orderUpdate = []              // [{ productCode, addedQuantity }]
) => {
  return new Promise((resolve, reject) => {
    /* ---------- 1) Check stock for every product ---------- */
    const stockSql =
      "SELECT QUANTITY FROM production WHERE PRODUCT_CODE = ?";
    const stockChecks = orderUpdate.map(
      (item) =>
        new Promise((res, rej) => {
          db.query(stockSql, [item.productCode], (err, rows) => {
            if (err)
              return rej({ message: "Stock check failed!", error: err });
            if (!rows.length || rows[0].QUANTITY < item.addedQuantity)
              return rej({
                message: `Not enough quantity for product ${item.productCode}`,
              });
            res();
          });
        })
    );

    /* Wait for ALL stock checks to finish */
    Promise.all(stockChecks)
      .then(() => {
        /* ---------- 2) Update order status once ---------- */
        db.query(
          "UPDATE orders SET STATUS = ? WHERE ORDER_ID = ?",
          [orderStatus, orderId],
          (err) => {
            if (err)
              return reject({
                message: "Error updating order status!",
                error: err,
              });

            /* ---------- 3) Update order_data & production rows ---------- */
            const now = new Date();
            const orderDataSql = `
              UPDATE order_data
                 SET COMPLETED_QUANTITY = COMPLETED_QUANTITY + ?
               WHERE ORDER_ID = ? AND PRODUCT_CODE = ?`;
            const prodSql = `
              UPDATE production
                 SET UPDATE_DATE = ?, QUANTITY = QUANTITY - ?
               WHERE PRODUCT_CODE = ?`;

            const lineUpdates = orderUpdate.map(
              (item) =>
                new Promise((res, rej) => {
                  db.query(
                    orderDataSql,
                    [item.addedQuantity, orderId, item.productCode],
                    (err) => {
                      if (err) return rej(err);
                      db.query(
                        prodSql,
                        [now, item.addedQuantity, item.productCode],
                        (err) => (err ? rej(err) : res())
                      );
                    }
                  );
                })
            );

            Promise.all(lineUpdates)
              .then(() =>
                resolve({ message: "Order data updated successfully!" })
              )
              .catch((err) =>
                reject({
                  message: "Error updating order data!",
                  error: err,
                })
              );
          }
        );
      })
      .catch(reject); // stock check failure
  });
};



