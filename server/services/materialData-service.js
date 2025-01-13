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
export const addMaterialDataService = async (code, name, description, status) => {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO material (MATERIAL_ID, NAME, DESCRIPTION, STATUS) VALUES ('${code}', '${name}', '${description}', '${status}')`;

    db.query(query, (err) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          reject({ message: "Material code already exists!" });
        } else {
          reject({ message: "Something went wrong, Please try again!" });
        }
      } else {
        resolve({ message: "Material data added successfully!" });
      }
    });
  });
};
