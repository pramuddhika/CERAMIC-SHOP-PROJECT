import { db, EMAIL_USER, EMAIL_PASS} from "../env.js";
import bcrypt from "bcrypt";
import e from "express";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";

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
export const createMemberService = (
  userId,
  firstName,
  lastName,
  userType,
  email,
  status
) => {
  return new Promise((resolve, reject) => {
    const id = uuidv4();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: EMAIL_USER,
      to: email,
      subject: "GLEAM - Account Created",
      text: `Hi ${firstName} ${lastName},\n\nYour account has been created successfully. \nYou can register from : http://localhost:5173/registration?token=${id}\n\nThank you,\nGLEAM Team`,
    };

    transporter.sendMail(mailOptions, (err, data) => {
      if (err) {
        reject({ message: "Something went wrong while sending email, Please try again!" });
        return;
      }
      const query = `INSERT INTO user (USER_ID, FIRST_NAME, LAST_NAME, USER_TYPE, EMAIL, STATUS, PASSWORD) VALUES (?,?,?,?,?,? ,?)`;
      db.query(
        query,
        [userId, firstName, lastName, userType, email, status, id],
        (error, result) => {
          if (error) {
            reject({ message: "Something went wrong, Please try again!" });
            return;
          }
          resolve({ message: "Member created successfully!" });
        }
      );
    });
  });
};


// create customer - signup
export const signUpService = (
  userId,
  firstName,
  lastName,
  email,
  password,
  userType,
  status
) => {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO user (USER_ID, FIRST_NAME, LAST_NAME, EMAIL, PASSWORD, USER_TYPE , STATUS) VALUES (?,?,?,?,?,?,?)`;
    db.query(
      query,
      [userId, firstName, lastName, email, password, userType, status],
      (error, result) => {
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
      }
    );
  });
};

//create supplier
export const createSupplierService = (
  userId,
  firstName,
  lastName,
  email,
  status,
  phone,
  line1,
  line2,
  city,
  distric,
  province,
  postalCode
) => {
  return new Promise((resolve, reject) => {
    const query1 = `INSERT INTO user (USER_ID,EMAIL, FIRST_NAME, LAST_NAME, USER_TYPE, STATUS) VALUES (?,?,?,?,?,?)`;
    const query2 = `INSERT INTO address_book (USER_ID,TAG, TELEPHONE_NUMBER, LINE_1, LINE_2, CITY, DISTRICT, PROVINCE, POSTAL_CODE) VALUES (?,?,?,?,?,?,?,?,?)`;
    db.query(
      query1,
      [userId, email, firstName, lastName, "supplier", status],
      (error, result) => {
        if (error) {
          if (error.code === "ER_DUP_ENTRY") {
            reject({ message: "User already exists!" });
            return;
          } else {
            reject({ message: "Something wrong plese try again!" });
            return;
          }
        }
        db.query(
          query2,
          [
            userId,
            "Primary",
            phone,
            line1,
            line2,
            city,
            distric,
            province,
            postalCode,
          ],
          (error, result) => {
            if (error) {
              if (error.code === "ER_DUP_ENTRY") {
                reject({ message: "User already exists!" });
                return;
              } else {
                reject({ message: "Something wrong plese try again!" });
                return;
              }
            }
            resolve({ message: "Supplier created successfully!" });
          }
        );
      }
    );
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

// login
export const loginService = (email, password) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT USER_ID, EMAIL, FIRST_NAME, LAST_NAME, USER_TYPE, PASSWORD FROM user WHERE EMAIL = ? AND STATUS = 1`;
    db.query(query, [email], async (error, result) => {
      if (error) {
        reject({ message: "Something went wrong, Please try again!" });
        return;
      }
      if (result.length === 0) {
        reject({ message: "Invalid email or password!" });
        return;
      }
      const user = result[0];
      if (!password || !user.PASSWORD) {
        reject({ message: "Invalid email or password!" });
        return;
      }
      const isPasswordValid = await bcrypt.compare(password, user.PASSWORD);
      if (!isPasswordValid) {
        reject({ message: "Invalid email or password!" });
        return;
      }

      const data = {
        id: user.USER_ID,
        email: user.EMAIL,
        firstName: user.FIRST_NAME,
        lastName: user.LAST_NAME,
        role: user.USER_TYPE,
      };
      resolve({ message: "Login successful!", data });
    });
  });
};

// get supplier data
export const getSupplierDataService = async (
  page = 1,
  limit = 5,
  search = ""
) => {
  return new Promise((resolve, reject) => {
    const offset = (page - 1) * limit;
    let queryParams = [parseInt(limit), parseInt(offset)];
    let countQueryParams = [];

    let searchCondition = "";
    if (search) {
      searchCondition = `AND (user.USER_ID LIKE ? OR user.FIRST_NAME LIKE ? OR user.LAST_NAME LIKE ?)`;
      queryParams.unshift(`%${search}%`, `%${search}%`, `%${search}%`);
      countQueryParams = [`%${search}%`, `%${search}%`, `%${search}%`];
    }

    const query = `SELECT user.USER_ID, user.FIRST_NAME, user.LAST_NAME, user.EMAIL, user.STATUS,
      address_book.TELEPHONE_NUMBER, address_book.LINE_1, address_book.LINE_2,
      address_book.CITY, address_book.DISTRICT, address_book.PROVINCE, address_book.POSTAL_CODE
      FROM user
      JOIN address_book ON user.USER_ID = address_book.USER_ID
      WHERE USER_TYPE = 'supplier' ${searchCondition}
      LIMIT ? OFFSET ?`;

    db.query(query, queryParams, (error, result) => {
      if (error) {
        reject({ message: "Something went wrong, Please try again!", error });
        return;
      }

      // Count total suppliers
      let countQuery = `SELECT COUNT(*) AS total FROM user WHERE USER_TYPE = 'supplier' ${searchCondition}`;
      db.query(
        countQuery,
        countQueryParams.length ? countQueryParams : [],
        (error, countResult) => {
          if (error) {
            reject({
              message: "Something went wrong, Please try again!",
              error,
            });
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
        }
      );
    });
  });
};

// edit supplier
export const editSupplierService = (
  userId,
  firstName,
  lastName,
  email,
  status,
  phone,
  line1,
  line2,
  city,
  distric,
  province,
  postalCode
) => {
  return new Promise((resolve, reject) => {
    const query1 = `UPDATE user SET FIRST_NAME = ?, LAST_NAME = ?, EMAIL = ?, STATUS = ? WHERE USER_ID = ?`;
    const query2 = `UPDATE address_book SET TELEPHONE_NUMBER = ?, LINE_1 = ?, LINE_2 = ?, CITY = ?, DISTRICT = ?, PROVINCE = ?, POSTAL_CODE = ? WHERE USER_ID = ?`;
    db.query(
      query1,
      [firstName, lastName, email, status, userId],
      (error, result) => {
        if (error) {
          reject({ message: "Something went wrong, Please try again!" });
          return;
        }
        db.query(
          query2,
          [phone, line1, line2, city, distric, province, postalCode, userId],
          (error, result) => {
            if (error) {
              reject({ message: "Something went wrong, Please try again!" });
              return;
            }
            resolve({ message: "Supplier updated successfully!" });
          }
        );
      }
    );
  });
};

// get member data
export const getMemberDataService = async (
  page = 1,
  limit = 5,
  search = ""
) => {
  return new Promise((resolve, reject) => {
    const offset = (page - 1) * limit;
    let queryParams = [parseInt(limit), parseInt(offset)];
    let countQueryParams = [];

    let searchCondition = " WHERE (USER_TYPE = 'Admin' OR USER_TYPE = 'Sales Manager' OR USER_TYPE = 'Stock Manager')";
    if (search) {
      searchCondition += ` AND (user.USER_ID LIKE ? OR user.FIRST_NAME LIKE ? OR user.LAST_NAME LIKE ?)`;
      queryParams = [`%${search}%`, `%${search}%`, `%${search}%`, ...queryParams];
      countQueryParams = [`%${search}%`, `%${search}%`, `%${search}%`];
    }

    const query = `SELECT user.USER_ID, user.FIRST_NAME, user.LAST_NAME, user.EMAIL, user.STATUS, user.USER_TYPE
      FROM user
      ${searchCondition}
      LIMIT ? OFFSET ?`;

    db.query(query, queryParams, (error, result) => {
      if (error) {
        reject({ message: "Something went wrong, Please try again!", error });
        return;
      }

      // Count total members
      let countQuery = `SELECT COUNT(*) AS total FROM user ${searchCondition}`;
      db.query(
        countQuery,
        countQueryParams.length ? countQueryParams : [],
        (error, countResult) => {
          if (error) {
            reject({
              message: "Something went wrong, Please try again!",
              error,
            });
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
        }
      );
    });
  });
};

// edit member data
export const editMemberService = (
  userId,
  firstName,
  lastName,
  email,
  status,
  userType
) => {
  return new Promise((resolve, reject) => {
    const query = `UPDATE user SET FIRST_NAME = ?, LAST_NAME = ?, EMAIL = ?, STATUS = ?,USER_TYPE = ? WHERE USER_ID = ? `;
    db.query(
      query,
      [firstName, lastName, email, status,userType, userId],
      (error, result) => {
        if (error) {
          reject({ message: "Something went wrong, Please try again!" });
          return;
        }
        resolve({ message: "Member updated successfully!" });
      }
    );
  });
};

// get register page data
export const getRegisterPageDataService = async (id) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT USER_ID, FIRST_NAME, LAST_NAME, EMAIL,USER_TYPE FROM user WHERE PASSWORD = ?`;
    db.query(query, [id], (error, result) => {
      if (error) {
        reject({ message: "Something went wrong, Please try again!" });
        return;
      }
      if (result.length === 0) {
        reject({ message: "Invalid Link!" });
        return;
      }
      resolve(result[0]);
    });
  });
};

// register user
export const RegisterService = (
  userId,
  password,
) => {
  return new Promise((resolve, reject) => {
    const query = `UPDATE user SET PASSWORD = ? WHERE USER_ID = ?`;
    db.query(
      query,
      [password, userId ],
      (error, result) => {
        if (error) {
          reject({ message: "Something went wrong, Please try again!" });
          return;
        }
        resolve({ message: "User registered successfully!" });
      }
    );
  });
};

// get customer data
export const getCustomerDataService = async (
  page = 1,
  limit = 5,
  search = ""
) => {
  return new Promise((resolve, reject) => {
    const offset = (page - 1) * limit;
    let queryParams = [parseInt(limit), parseInt(offset)];
    let countQueryParams = [];

    let searchCondition = " WHERE (USER_TYPE = 'customer' OR USER_TYPE = 'Whole Customer')";
    if (search) {
      searchCondition += ` AND (user.USER_ID LIKE ? OR user.FIRST_NAME LIKE ? OR user.LAST_NAME LIKE ?)`;
      queryParams = [`%${search}%`, `%${search}%`, `%${search}%`, ...queryParams];
      countQueryParams = [`%${search}%`, `%${search}%`, `%${search}%`];
    }

    const query = `SELECT user.USER_ID, user.FIRST_NAME, user.LAST_NAME, user.EMAIL, user.STATUS, user.USER_TYPE
      FROM user
      ${searchCondition}
      LIMIT ? OFFSET ?`;

    db.query(query, queryParams, (error, result) => {
      if (error) {
        reject({ message: "Something went wrong, Please try again!"});
        return;
      }

      // Count total members
      let countQuery = `SELECT COUNT(*) AS total FROM user ${searchCondition}`;
      db.query(
        countQuery,
        countQueryParams.length ? countQueryParams : [],
        (error, countResult) => {
          if (error) {
            reject({message: "Something went wrong, Please try again!"});
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
        }
      );
    });
  });
};