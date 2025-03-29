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
    const insertSql = `INSERT INTO address (USER_ID, CITY, DISTRICT, LINE_1, LINE_2, TELEPHONE_NUMBER, PROVINCE, TAG, POSTAL_CODE) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    db.query(insertSql, [userId, city, district, line1, line2, phoneNumber, state, tag, zipCode], function (err) {
      if (err) {
        reject({ message: "Something went wrong!" });
        return;
      }
      resolve({ message: "Address added successfully!" });
    });
  });
};
