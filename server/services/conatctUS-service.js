import { db, EMAIL_USER, EMAIL_PASS } from "../env.js";
import nodemailer from "nodemailer";

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
    
    const query = `SELECT * FROM conatactus ORDER BY ID DESC LIMIT ? OFFSET ?`;
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

//send reply to email
export const sendConrtactUsReplyService = async (id, email, reply) => {
  return new Promise((resolve, reject) => {
    const query = `UPDATE conatactus SET Reply_MESSAGE = ? WHERE ID = ?`;

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
      subject: "GLEAM - Contact Us Reply",
      text: reply,
    };

    transporter.sendMail(mailOptions, (err, data) => {
      if (err) {
        reject({ message: "Something went wrong while sending email, Please try again!" });
        return;
      }
      db.query(query, [reply, id], (err, result) => {
        if (err) {
          reject({ message: err });
        } else {
          resolve({ message: "Reply sent successfully!" });
        }
      });
    });
  });
};



