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
