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
     (production.QUANTITY - IFNULL(order_data.QUANTITY, 0)) AS STOCK_QUANTITY
     FROM cart
     INNER JOIN product ON cart.PRODUCT_CODE = product.PRODUCT_CODE
     INNER JOIN production ON product.PRODUCT_CODE = production.PRODUCT_CODE
     LEFT JOIN order_data ON product.PRODUCT_CODE = order_data.PRODUCT_CODE
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