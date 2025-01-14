import { db } from "../env.js";

//generate user id
export const generateUseIdService = () => {
  return new Promise((resolve, reject) => {
    const query = `SELECT MAX(USER_ID) as USER_ID FROM user`;
    db.query(query, (error, result) => {
      if (error) {
        reject({ message: "Something went wrong, Please try again!" });
        return;
      }
      let id;
      const USER_ID = result[0].USER_ID;
      if (USER_ID) {
        const numberpart = parseInt(product_code.split("-")[1], 10);
        const newnumberpart = String(numberpart + 1).padStart(6, "0");
        id = `USE-${newnumberpart}`;
      } else {
        id = `USE-000001`;
      }
      resolve({ newid: id });
    });
  });
};

// create member
export const createMemberService = (userId, firstName, lastName,userType, email, status) => {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO user (USER_ID, FIRST_NAME, LAST_NAME, USER_TYPE, EMAIL, STATUS) VALUES (?,?,?,?,?,?)`;
    db.query(query,[userId, firstName, lastName,userType, email, status], (error, result) => {
      if (error) {
        reject({ message: error.message });
        return;
      }
      resolve({ message: "Member created successfully!" });
    });
  });
};
