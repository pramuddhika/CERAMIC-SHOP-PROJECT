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
        const numberpart = parseInt(USER_ID.split("-")[1], 10);
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
      //To do: generate link & send email to user for password setup , link shoud be navigae to registration page with user id
    });
  });
};

// create customer - signup
export const signUpService = (userId, firstName, lastName, email, password, userType , status) => {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO user (USER_ID, FIRST_NAME, LAST_NAME, EMAIL, PASSWORD, USER_TYPE , STATUS) VALUES (?,?,?,?,?,?,?)`;
    db.query(query,[userId, firstName, lastName, email, password, userType , status], (error, result) => {
      if (error) {
        if (error.code === "ER_DUP_ENTRY") {
          reject({ message: "Email already exists!" });
          return;
        } else { 
          reject({ message: "Something went wrong, Please try again!" });
          return;
        }
      }
      resolve({ message: "Account created successfully!" });
    });
  });
};

//create supplier
export const createSupplierService = (userId, firstName, lastName, email, status, phone, line1, line2, city, distric, province, postalCode) => {
  return new Promise((resolve, reject) => {
    const query1 = `INSERT INTO user (USER_ID,EMAIL, FIRST_NAME, LAST_NAME, USER_TYPE, STATUS) VALUES (?,?,?,?,?,?)`;
    const query2 = `INSERT INTO address_book (USER_ID,TAG, TELEPHONE_NUMBER, LINE_1, LINE_2, CITY, DISTRICT, PROVINCE, POSTAL_CODE) VALUES (?,?,?,?,?,?,?,?,?)`;
    db.query(query1,[userId,email, firstName, lastName, "supplier", status], (error, result) => {
      if (error) {
        if(error.code === "ER_DUP_ENTRY"){
          reject({ message: "User already exists!" });
          return;
        } else {
          reject({ message: "Something wrong plese try again!" });
          return;
        }
      }
      db.query(query2,[userId,"Primary", phone, line1, line2, city, distric, province, postalCode], (error, result) => {
        if (error) {
          if(error.code === "ER_DUP_ENTRY"){
            reject({ message: "User already exists!" });
            return;
          } else {
            reject({ message: "Something wrong plese try again!" });
            return;
          }
        }
        resolve({ message: "Supplier created successfully!" });
      });
    });
  });
};

//get supplier list
export const getSupplierListService = () => {
  return new Promise((resolve, reject) => {
    const query = `SELECT USER_ID,FIRST_NAME,LAST_NAME FROM user WHERE USER_TYPE = 'supplier' AND STATUS = 1`;
    db.query(query, (error, result) => {
      if (error) {
        reject({ message: "Something went wrong, Please try again!" });
        return;
      }
      resolve(result);
    });
  });
};
