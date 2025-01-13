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
          id = `MaT-${newnumberpart}`;
        } else {
          id = `MaT-000001`;
        }
        resolve({ newid: id });
      }
    });
  });
};
