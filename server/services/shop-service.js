import { db } from "../env.js";

export const addCartDataService = async (productCode, quantity, userId) => {
    return new Promise((resolve, reject) => {
      const insertSql = `INSERT INTO cart (PRODUCT_CODE, QUANTITY, USER_ID) VALUES (?, ?, ?)`;
      db.query(insertSql, [productCode, quantity, userId], function (err) {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            const updateSql = `UPDATE cart SET QUANTITY = QUANTITY + ? WHERE PRODUCT_CODE = ? AND USER_ID = ?`;
            db.query(updateSql, [quantity, productCode, userId], function (updateErr) {
              if (updateErr) {
                reject({ message: "Something went wrong!" });
                return;
              }
                resolve({ message: "Item added to cart successfully!" });
                return;
            });
          } else {
            reject({ message: "Something went wrong!" });
          }
          return;
        }
        resolve({ message: "Item added to cart successfully!" });
      });
    });
  };
  
