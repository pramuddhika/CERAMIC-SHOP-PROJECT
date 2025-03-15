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
    const query1 = `INSERT INTO material_stock (MATERIAL_ID,UPDATE_DATE,QUANTITY) VALUES (?, ?, ?)`;
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
              reject({ message: "Something went wrong, Please try again!" });
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
export const getMaterialDataService = async (page = 1, limit = 5) => {
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

// get material data list
export const getMaterialListService = async () => {
  return new Promise((resolve, reject) => {
    const query = `SELECT MATERIAL_ID, NAME FROM material WHERE STATUS = 1`;

    db.query(query, (err, result) => {
      if (err) {
        reject({ message: "Something went wrong, Please try again!" });
      } else {
        resolve(result);
      }
    });
  });
};

// get material stock data
export const getMaterialStockService = async (searchQuery) => {
  return new Promise((resolve, reject) => {
    let query = `SELECT material.MATERIAL_ID, material.NAME, material_stock.UPDATE_DATE, material_stock.QUANTITY 
      FROM material INNER JOIN material_stock ON material.MATERIAL_ID = material_stock.MATERIAL_ID`;

    if (searchQuery) {
      query += ` WHERE material.MATERIAL_ID LIKE '%${searchQuery}%' OR material.NAME LIKE '%${searchQuery}%'`;
    }

    db.query(query, (err, result) => {
      if (err) {
        reject({ message: "Something went wrong, Please try again!" });
      } else {
        resolve(result);
      }
    });
  });
};

// add material received note data
export const addMaterialReceivedDataService = async (
  materialId,
  supplierId,
  date,
  quantity,
  value
) => {
  return new Promise((resolve, reject) => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];
    const query = `INSERT INTO material_received_note (MATERIAL_ID, SUPPILER_ID, DATE, QUANTITY, MATERIAL_VALUE) VALUES ('${materialId}', '${supplierId}', '${date}', '${quantity}', '${value}')`;
    const query1 = `UPDATE material_stock SET QUANTITY = QUANTITY + ${quantity},UPDATE_DATE = '${formattedDate}' WHERE MATERIAL_ID = '${materialId}'`;

    db.query(query, (err) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          reject({ message: "Material received data already exists!" });
        } else {
          reject({ message: err });
        }
      } else {
        db.query(query1, (err) => {
          if (err) {
            if (err.code === "ER_DUP_ENTRY") {
              reject({ message: "Material received data already exists!" });
            } else {
              reject({ message: err });
            }
          } else {
            resolve({ message: "Material received data added successfully!" });
          }
        });
      }
    });
  });
};

// get material received note data
export const getMaterialReceivedDataService = async (
  page = 1,
  limit = 5,
  material,
  supplier,
) => {
  return new Promise((resolve, reject) => {
    const offset = (page - 1) * limit;
    let query = `SELECT material.MATERIAL_ID, material.NAME, material_received_note.DATE,material_received_note.QUALITY,
                        material_received_note.QUANTITY, material_received_note.MATERIAL_VALUE, 
                        user.USER_ID, user.FIRST_NAME, user.LAST_NAME
                 FROM material_received_note
                 INNER JOIN material 
                   ON material.MATERIAL_ID = material_received_note.MATERIAL_ID 
                 INNER JOIN user 
                   ON material_received_note.SUPPILER_ID = user.USER_ID`;
    let queryParams = [];
    let filters = [];

    if (material && material !== "undefined" && material !== "") {
      filters.push(`material.MATERIAL_ID = ?`);
      queryParams.push(material);
    }

    if (supplier && supplier !== "undefined" && supplier !== "") {
      filters.push(`user.USER_ID = ?`);
      queryParams.push(supplier);
    }

    // Add WHERE clause if filters exist
    if (filters.length > 0) {
      query += " WHERE " + filters.join(" AND ");
    }

    query += " ORDER BY material_received_note.DATE DESC";
    query += " LIMIT ? OFFSET ?";
    queryParams.push(parseInt(limit), parseInt(offset));

    db.query(query, queryParams, (err, result) => {
      if (err) {
        reject({ message: "Something went wrong. Please try again!" });
        return;
      }

      let countQuery = `SELECT COUNT(*) AS total 
                        FROM material_received_note
                        INNER JOIN material 
                          ON material.MATERIAL_ID = material_received_note.MATERIAL_ID
                        INNER JOIN user 
                          ON material_received_note.SUPPILER_ID = user.USER_ID`;

      if (filters.length > 0) {
        countQuery += " WHERE " + filters.join(" AND ");
      }

      db.query(countQuery, queryParams.slice(0, -2), (err, count) => {
        if (err) {
          reject({ message: "Something went wrong. Please try again!" });
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

// quality update
export const qualityUpdateService = async (materialId, date, supplierId, quality, quantity) => {
  return new Promise((resolve, reject) => {
    if (quality === 'failed') {
      const today = new Date();
      const formattedDate = today.toISOString().split("T")[0];
      const query = `UPDATE material_stock SET QUANTITY = QUANTITY - ${quantity},UPDATE_DATE = '${formattedDate}'  WHERE MATERIAL_ID = '${materialId}'`;
      db.query(query, (err) => {
        if (err) {
          reject({ message: "Something went wrong, Please try again!" });
        } else {
          const query1 = 'UPDATE material_received_note SET QUALITY = ? WHERE MATERIAL_ID = ? AND SUPPILER_ID = ? AND DATE = ?';
          db.query(query1, [quality, materialId, supplierId, date], (err) => {
            if (err) {
              reject({ message: "Something went wrong, Please try again!" });
              return;
            } else {
              resolve({ message: "Quality updated successfully!" });
              return;
            }
          });
        }
      });
    }
    if(quality === 'passed'){
      const query2 = 'UPDATE material_received_note SET QUALITY =? WHERE MATERIAL_ID =? AND SUPPILER_ID =? AND DATE =?';
      db.query(query2, [quality, materialId, supplierId, date], (err) => {
        if (err) {
          reject({ message: "Something went wrong, Please try again!" });
          return;
        } else {
          resolve({ message: "Quality updated successfully!" });
          return;
        }
      });
    }
  })
}

// add material usage data
export const addMaterialUsageDataService = async (materialId, date, quantity) => {
  return new Promise((resolve, reject) => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];
    const query = `UPDATE material_stock SET QUANTITY = QUANTITY - ${quantity},UPDATE_DATE = '${formattedDate}' WHERE MATERIAL_ID = '${materialId}'`;

    db.query(query, (err) => {
      if (err) {
        reject({ message: "Something went wrong, Please try again!" });
      } else {
        const query1 = `INSERT INTO material_use (MATERIAL_ID, DATE, QUANTITY) VALUES ('${materialId}', '${date}', '${quantity}')`;

        db.query(query1, (err) => {
          if (err) {
            reject({ message: "Something went wrong, Please try again!" });
          } else {
            resolve({ message: "Material usage data added successfully!" });
          }
        });
      }
    });
  });
};

// get material usage data
export const getMaterialUsageDataService = async (page = 1, limit = 5, material) => {
  return new Promise((resolve, reject) => {
    const offset = (page - 1) * limit;
    let query = `SELECT material.MATERIAL_ID, material.NAME, material_use.DATE, material_use.QUANTITY 
                 FROM material 
                 INNER JOIN material_use ON material.MATERIAL_ID = material_use.MATERIAL_ID`;

    let countQuery = `SELECT COUNT(*) AS total FROM material_use 
                      INNER JOIN material ON material.MATERIAL_ID = material_use.MATERIAL_ID`;

    let queryParams = [];
    let filters = [];

    if (material) {
      filters.push(`material.MATERIAL_ID = ?`);
      queryParams.push(material);
    }

    if (filters.length > 0) {
      query += " WHERE " + filters.join(" AND ");
      countQuery += " WHERE " + filters.join(" AND "); 
    }

    query += " ORDER BY material_use.DATE DESC LIMIT ? OFFSET ?";
    queryParams.push(parseInt(limit), parseInt(offset));

    db.query(query, queryParams, (err, result) => {
      if (err) {
        reject({ message: "Something went wrong, Please try again!" });
        return;
      }

      db.query(countQuery, queryParams.slice(0, -2), (err, count) => {
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

// get payment data
export const getPaymentDataService = async (page = 1, limit = 5, material, supplier) => {
  return new Promise((resolve, reject) => {
    const offset = (page - 1) * limit;
    
    let query = `SELECT material.MATERIAL_ID, material.NAME, material_received_note.DATE, 
                        material_received_note.QUANTITY, material_received_note.MATERIAL_VALUE,material_received_note.SUPPILER_ID,
                        user.FIRST_NAME, user.LAST_NAME, material_received_note.PAID_VALUE
                 FROM material_received_note
                 INNER JOIN material ON material.MATERIAL_ID = material_received_note.MATERIAL_ID 
                 INNER JOIN user ON material_received_note.SUPPILER_ID = user.USER_ID`;

    let countQuery = `SELECT COUNT(*) AS total 
                      FROM material_received_note 
                      INNER JOIN material ON material.MATERIAL_ID = material_received_note.MATERIAL_ID 
                      INNER JOIN user ON material_received_note.SUPPILER_ID = user.USER_ID`;

    let queryParams = [];
    let filters = [];

    if (material) {
      filters.push(`material.MATERIAL_ID = ?`);
      queryParams.push(material);
    }

    if (supplier) {
      filters.push(`user.USER_ID = ?`);
      queryParams.push(supplier);
    }

    if (filters.length > 0) {
      query += " WHERE " + filters.join(" AND ");
      countQuery += " WHERE " + filters.join(" AND ");
    }

    // Add quality condition correctly
    query += (filters.length > 0 ? " AND" : " WHERE") + " material_received_note.QUALITY = 'passed'";
    countQuery += (filters.length > 0 ? " AND" : " WHERE") + " material_received_note.QUALITY = 'passed'";

    query += " ORDER BY material_received_note.DATE DESC LIMIT ? OFFSET ?";
    queryParams.push(parseInt(limit), parseInt(offset));

    db.query(query, queryParams, (err, result) => {
      if (err) {
        reject({ message: err });
        return;
      }

      db.query(countQuery, queryParams.slice(0, filters.length), (err, count) => {
        if (err) {
          reject({ message: err });
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

// add payment data
export const addPaymentDataService = async (materialId, supplierId, date, payment) => {
  return new Promise((resolve, reject) => {
    const query = `UPDATE material_received_note SET PAID_VALUE = (PAID_VALUE + ?) WHERE MATERIAL_ID = ? AND SUPPILER_ID = ? AND DATE = ?`;

    db.query(query, [payment, materialId, supplierId, date], (err) => {
      if (err) {
        reject({ message: "Something went wrong, Please try again!" });
      } else {
        resolve({ message: "Payment data added successfully!" });
      }
    });
  });
};


