import { db } from "../env.js";

// get last material ID
export const getLastMaterialIDService = async (tname) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT MAX(MATERIAL_ID) AS MATERIAL_CODE FROM material`;

    db.query(query, (err, result) => {
      if (err) {
        reject({ message: "Something went wrong, Please try again!" });
      } else {
        const code = result[0].MATERIAL_CODE;
        let id;
        if (code) {
          const numberpart = parseInt(code.split("-")[1], 10);
          const newnumberpart = String(numberpart + 1).padStart(6, "0");
          id = `MAT-${newnumberpart}`;
        } else {
          id = `MAT-000001`;
        }
        resolve({ newid: id });
      }
    });
  });
};

// add material data
export const addMaterialDataService = async (
  code,
  name,
  description,
  status
) => {
  return new Promise((resolve, reject) => {
    const query1 =`INSERT INTO material_stock (MATERIAL_ID,UPDATE_DATE,QUANTITY) VALUES (?, ?, ?)`;
    const query = `INSERT INTO material (MATERIAL_ID, NAME, DESCRIPTION, STATUS) VALUES ('${code}', '${name}', '${description}', '${status}')`;

    db.query(query, (err) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          reject({ message: "Material code already exists!" });
        } else {
          reject({ message: "Something went wrong, Please try again!" });
        }
      } else {
        db.query(query1, [code, new Date(), 0], (err) => {
          if (err) {
            if (err.code === "ER_DUP_ENTRY") {
              reject({ message: "Material code already exists!" });
            } else {
              reject({ message: 'Something went wrong, Please try again!' });
            }
          } else {
            resolve({ message: "Material data added successfully!" });
          }
        });
      }
    });
  });
};

// get material data
export const getMaterialDataService = async (page = 1, limit = 10) => {
  return new Promise((resolve, reject) => {
    const offset = (page - 1) * limit;
    const query = `SELECT * FROM material LIMIT ? OFFSET ?`;

    db.query(query, [parseInt(limit), parseInt(offset)], (err, result) => {
      if (err) {
        reject({ message: "Something went wrong, Please try again!" });
        return;
      }
      const countQuery = `SELECT COUNT(*) AS total FROM material`;

      db.query(countQuery, (err, count) => {
        if (err) {
          reject({ message: "Something went wrong, Please try again!" });
          return;
        }
        const total = count[0].total;
        const pages = Math.ceil(total / limit);
        resolve({
          data: result,
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: pages,
        });
      });
    });
  });
};

// edit material data
export const editMaterialDataService = async (
  code,
  name,
  description,
  status
) => {
  return new Promise((resolve, reject) => {
    const query = `UPDATE material SET NAME = '${name}', DESCRIPTION = '${description}', STATUS = '${status}' WHERE MATERIAL_ID = '${code}'`;

    db.query(query, (err) => {
      if (err) {
        reject({ message: "Something went wrong, Please try again!" });
      } else {
        resolve({ message: "Material data updated successfully!" });
      }
    });
  });
};
