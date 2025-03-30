import { db } from "../env.js";

export const addCartDataService = async (productCode, quantity, userId) => {
  return new Promise((resolve, reject) => {
    const insertSql = `INSERT INTO cart (PRODUCT_CODE, QUANTITY, USER_ID) VALUES (?, ?, ?)`;
    db.query(insertSql, [productCode, quantity, userId], function (err) {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          const updateSql = `UPDATE cart SET QUANTITY = QUANTITY + ? WHERE PRODUCT_CODE = ? AND USER_ID = ?`;
          db.query(
            updateSql,
            [quantity, productCode, userId],
            function (updateErr) {
              if (updateErr) {
                reject({ message: "Something went wrong!" });
                return;
              }
              resolve({ message: "Item added to cart successfully!" });
              return;
            }
          );
        } else {
          reject({ message: "Something went wrong!" });
        }
        return;
      }
      resolve({ message: "Item added to cart successfully!" });
    });
  });
};

//add address data
export const addAddressDataService = async (userId, city, district, line1, line2, phoneNumber, state, tag, zipCode) => {
  return new Promise((resolve, reject) => {
    const insertSql = `INSERT INTO address_book (USER_ID, CITY, DISTRICT, LINE_1, LINE_2, TELEPHONE_NUMBER, PROVINCE, TAG, POSTAL_CODE) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    db.query(insertSql, [userId, city, district, line1, line2, phoneNumber, state, tag, zipCode], function (err) {
      if (err) {
        reject({ message: "Something went wrong!" });
        return;
      }
      resolve({ message: "Address added successfully!" });
    });
  });
};

//get address data
export const getAddressDataService = async (userId) => {
  return new Promise((resolve, reject) => {
    const selectSql = `SELECT * FROM address_book WHERE USER_ID = ?`;
    db.query(selectSql, [userId], function (err, result) {
      if (err) {
        reject({ message: "Something went wrong!" });
        return;
      }
      resolve(result);
    });
  });
};

//get cart data
export const getCartDataService = async (userId) => {
  return new Promise((resolve, reject) => {
    const selectSql = `SELECT 
     cart.PRODUCT_CODE,cart.QUANTITY,
     product.NAME,product.IMAGE,product.PRICE,
     production.QUANTITY AS STOCK_QUANTITY
     FROM cart
     INNER JOIN product ON cart.PRODUCT_CODE = product.PRODUCT_CODE
     INNER JOIN production ON product.PRODUCT_CODE = production.PRODUCT_CODE
     WHERE cart.USER_ID = ?`;
    db.query(selectSql, [userId], function (err, result) {
      if (err) {
        reject({ message: "Something went wrong!" });
        return;
      }
      resolve(result);
    });
  });
};

//delete cart data
export const deleteCartDataService = async (userId, productCode) => {
  return new Promise((resolve, reject) => {
    const deleteSql = `DELETE FROM cart WHERE USER_ID = ? AND PRODUCT_CODE = ?`;
    db.query(deleteSql, [userId, productCode], function (err) {
      if (err) {
        reject({ message: "Something went wrong!" });
        return;
      }
      resolve({ message: "Item removed from cart successfully!" });
    });
  });
};

//get address tags
export const getAddressTagsService = async (userId) => {
  return new Promise((resolve, reject) => {
    const selectSql = `SELECT DISTINCT TAG FROM address_book WHERE USER_ID = ?`;
    db.query(selectSql, [userId], function (err, result) {
      if (err) {
        reject({ message: "Something went wrong!" });
        return;
      }
      resolve(result);
    });
  });
};

//get address data by tag
export const getAddressDataByTagService = async (userId, tag) => {
  return new Promise((resolve, reject) => {
    const selectSql = `SELECT * FROM address_book WHERE USER_ID = ? AND TAG = ?`;
    db.query(selectSql, [userId, tag], function (err, result) {
      if (err) {
        reject({ message: "Something went wrong!" });
        return;
      }
      resolve(result);
    });
  });
};

//get order id
export const getOrderIdService = async () => {
  return new Promise((resolve, reject) => {
    const query = `SELECT MAX(ORDER_ID) AS ORDER_ID FROM orders`;
    db.query(query, (err, result) => {
      if (err) {
        reject({ message: "Something went wrong, Please try again!" });
      } else {
        const code = result[0].ORDER_ID;
        let id;
        if (code) {
          const numberpart = parseInt(code.split("-")[1], 10);
          const newnumberpart = String(numberpart + 1).padStart(6, "0");
          id = `ORD-${newnumberpart}`;
        } else {
          id = `ORD-000001`;
        }
        resolve({ newid: id });
      }
    });
  });
};

//add order
export const addOrderService = async (orderID, userId, date, orderType,totalAmount ,billingTag, shippingTag) => {
  return new Promise((resolve, reject) => {
    const insertSql = `INSERT INTO orders (ORDER_ID, USER_ID, DATE, ORDER_TYPE ,VALUE ,BILLING_TAG, SHIPPING_TAG) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.query(insertSql, [orderID,userId,date,orderType,totalAmount,billingTag,shippingTag  ], function (err) {
      if (err) {
        reject({ message: "Something went wrong!" });
        return;
      }
      resolve({ message: "Order placed successfully!" });
    });
  });
};

//add order data
export const addOrderDataService = async (orderID, product, userId) => {
  return new Promise((resolve, reject) => {
    const insertSql = `INSERT INTO order_data (ORDER_ID, PRODUCT_CODE, QUANTITY, UNIT_PRICE) VALUES (?, ?, ?, ?)`;
    const deleteSql = `DELETE FROM cart WHERE USER_ID = ? AND PRODUCT_CODE = ?`;

    // Insert products one by one
    const insertPromises = product.map((item) => {
      return new Promise((res, rej) => {
        db.query(
          insertSql,
          [orderID, item.productCode, item.quantity, item.price],
          function (err) {
            if (err) {
              rej(err);
              return;
            }
            res();
          }
        );
      });
    });

    Promise.all(insertPromises)
      .then(() => {
        // After successful insert, delete products from cart
        const deletePromises = product.map((item) => {
          return new Promise((res, rej) => {
            db.query(
              deleteSql,
              [userId, item.productCode],
              function (err) {
                if (err) {
                  rej(err);
                  return;
                }
                res();
              }
            );
          });
        });

        return Promise.all(deletePromises);
      })
      .then(() => {
        resolve({ message: "Order data added and cart cleared successfully!" });
      })
      .catch((err) => {
        reject({ message: "Something went wrong!", error: err });
      });
  });
};

//add order payment
export const addOrderPaymentService = async (date, orderID, paid, paymentType , paymentStatus) => {
  return new Promise((resolve, reject) => {
    const insertSql = `INSERT INTO payment (DATE, ORDER_ID, PAID_VALUE, PATMENT_TYPE , PAYMENT_STATUS) VALUES (?, ?, ?, ?, ?)`;
    db.query(insertSql, [date, orderID, paid, paymentType, paymentStatus], function (err) {
      if (err) {
        reject({ message: err });
        return;
      }
      resolve({ message: "Order payment added successfully!" });
    });
  });
};

//get order data
export const getOrderDataService = async (userId, page = 1, limit = 5) => {
  return new Promise((resolve, reject) => {
    const countQuery = `SELECT COUNT(DISTINCT o.ORDER_ID) AS total FROM orders o WHERE o.USER_ID = ?`;
    
    db.query(countQuery, [userId], (err, countResult) => {
      if (err) {
        return reject({ message: "Something went wrong!", error: err });
      }

      const total = countResult[0].total;
      const totalPages = Math.ceil(total / limit);

      // If no orders found, return empty result
      if (total === 0) {
        return resolve({
          data: [],
          total: 0,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: 0
        });
      }

      // Query to fetch all order data first
      const selectSql = `
        WITH OrderData AS (
          SELECT DISTINCT 
            o.ORDER_ID,
            o.DATE AS ORDER_DATE,
            o.VALUE AS ORDER_VALUE,
            o.STATUS AS ORDER_STATUS,
            o.SHIPPING_TAG,
            o.BILLING_TAG,
            p.PAYMENT_STATUS,
            od.PRODUCT_CODE,
            pr.NAME AS PRODUCT_NAME,
            pr.IMAGE AS PRODUCT_IMAGE,
            od.UNIT_PRICE,
            od.QUANTITY,
            shipping.CITY AS SHIPPING_CITY,
            shipping.DISTRICT AS SHIPPING_DISTRICT,
            shipping.LINE_1 AS SHIPPING_LINE1,
            shipping.LINE_2 AS SHIPPING_LINE2,
            shipping.PROVINCE AS SHIPPING_STATE,
            shipping.POSTAL_CODE AS SHIPPING_ZIP,
            shipping.TELEPHONE_NUMBER AS SHIPPING_PHONE,
            billing.CITY AS BILLING_CITY,
            billing.DISTRICT AS BILLING_DISTRICT,
            billing.LINE_1 AS BILLING_LINE1,
            billing.LINE_2 AS BILLING_LINE2,
            billing.PROVINCE AS BILLING_STATE,
            billing.POSTAL_CODE AS BILLING_ZIP,
            billing.TELEPHONE_NUMBER AS BILLING_PHONE,
            ROW_NUMBER() OVER (ORDER BY o.ORDER_ID DESC) as row_num
          FROM orders o
          LEFT JOIN payment p ON o.ORDER_ID = p.ORDER_ID
          LEFT JOIN order_data od ON o.ORDER_ID = od.ORDER_ID
          LEFT JOIN product pr ON od.PRODUCT_CODE = pr.PRODUCT_CODE
          LEFT JOIN address_book shipping ON o.SHIPPING_TAG = shipping.TAG AND o.USER_ID = shipping.USER_ID
          LEFT JOIN address_book billing ON o.BILLING_TAG = billing.TAG AND o.USER_ID = billing.USER_ID
          WHERE o.USER_ID = ?
        )
        SELECT * FROM OrderData 
        WHERE row_num > ? AND row_num <= ?
        ORDER BY ORDER_ID DESC`;

      const offset = (page - 1) * limit;
      db.query(selectSql, [userId, offset, offset + parseInt(limit)], (err, results) => {
        if (err) {
          return reject({ message: "Something went wrong!", error: err });
        }

        // Transform results into required format
        const ordersMap = new Map();

        results.forEach((row) => {
          if (!ordersMap.has(row.ORDER_ID)) {
            ordersMap.set(row.ORDER_ID, {
              orderID: row.ORDER_ID,
              orderValue: row.ORDER_VALUE,
              orderDate: row.ORDER_DATE,
              paymentStatus: row.PAYMENT_STATUS,
              orderStatus: row.ORDER_STATUS,
              shippingAddress: row.SHIPPING_TAG ? {
                city: row.SHIPPING_CITY,
                district: row.SHIPPING_DISTRICT,
                line1: row.SHIPPING_LINE1,
                line2: row.SHIPPING_LINE2,
                state: row.SHIPPING_STATE,
                zipCode: row.SHIPPING_ZIP,
                phoneNumber: row.SHIPPING_PHONE,
              } : null,
              billingAddress: row.BILLING_TAG ? {
                city: row.BILLING_CITY,
                district: row.BILLING_DISTRICT,
                line1: row.BILLING_LINE1,
                line2: row.BILLING_LINE2,
                state: row.BILLING_STATE,
                zipCode: row.BILLING_ZIP,
                phoneNumber: row.BILLING_PHONE,
              } : null,
              details: [],
            });
          }

          if (row.PRODUCT_CODE) {
            ordersMap.get(row.ORDER_ID).details.push({
              productCode: row.PRODUCT_CODE,
              productName: row.PRODUCT_NAME,
              productImage: row.PRODUCT_IMAGE,
              productPrice: row.UNIT_PRICE,
              productQty: row.QUANTITY,
            });
          }
        });

        resolve({
          data: Array.from(ordersMap.values()),
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages,
        });
      });
    });
  });
};
