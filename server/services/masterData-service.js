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
