import { db } from "../env.js";

//add conatct us data to db
export const addContactUsService = async (fullName, email, message) => {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO conatactUs (FULL_NAME, EMAIL, MESSAGE) VALUES (?,?,?)`;

    db.query(query, [fullName, email, message], (err, result) => {
      if (err) {
        reject({ message: "Something went wrong, Please try again!" });
      } else {
        resolve({ message: "We will contact you soon!" });
      }
    });
  });
};

//get contact us data from db
export const getContactUsService = async (page = 1, limit = 5) => {
  return new Promise((resolve, reject) => {
    const offset = (page - 1) * limit;
    
    const query = `SELECT * FROM conatactus LIMIT ? OFFSET ?`;
    const countQuery = `SELECT COUNT(*) AS total FROM conatactus`;
    
    db.query(query, [parseInt(limit), parseInt(offset)], (err, result) => {
      if (err) {
        reject({ message: "Something went wrong, Please try again!" });
        return;
      }
      
      db.query(countQuery, (err, countResult) => {
        if (err) {
          reject({ message: "Something went wrong, Please try again!" });
          return;
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

