import { db } from "../env.js";

//get data from db
export const getMasterDataService = async (tname) => {
  return new Promise((resolve, reject) => {
    let query;
    switch (tname) {
      case "payment":
        query = `SELECT * FROM payment_status`;
        break;
      case "order":
        query = `SELECT * FROM order_type`;
        break;
      case "stock":
        query = `SELECT * FROM stock_stages`;
        break;
    }

    db.query(query, (err, result) => {
      if (err) {
        reject({ message: "Something went wrong, Please try again!" });
      } else if (result.length === 0) {
        resolve({ message: "No data found!" });
      } else {
        resolve(result);
      }
    });
  });
};

//add data to db
export const addMasterDataService = async (tname, tag, description, status) => {
  return new Promise((resolve, reject) => {
    let query;
    switch (tname) {
      case "payment":
        query = `INSERT INTO payment_status (PAYMENT_TAG, DESCRIPTION, STATUS) VALUES ('${tag}','${description}','${status}')`;
        break;
      case "order":
        query = `INSERT INTO order_type (ORDER_TYPE_TAG , DESCRIPTION , STATUS ) VALUES ('${tag}','${description}','${status}')`;
        break;
      case "stock":
        query = `INSERT INTO stock_stages (STOCK_STAGE_TAG , DESCRIPTION , STATUS ) VALUES ('${tag}','${description}','${status}')`;
        break;
    }

    db.query(query, (err, result) => {
      if (err.code === "ER_DUP_ENTRY") {
        reject({message:"Data already exists!"});
      } else if (err) {
          reject({ message: "Something went wrong, Please try again!" });
      } else {
        resolve({ message: "Data added successfully!" });
      }
    });
  });
};
