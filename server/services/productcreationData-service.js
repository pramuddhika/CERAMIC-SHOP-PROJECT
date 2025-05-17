import { db } from "../env.js";

//add product creation data
export const addprojectcreationDataService = async (
  product_code,
  create_date,
  quantity,
  stage
) => {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO product_stock_stages (PRODUCT_CODE,  QUANTITY, CREATE_DATE,UPDATE_DATE, STAGE) VALUES ('${product_code}', '${quantity}', '${create_date}','${create_date}', '${stage}')`;

    db.query(query, (err) => {
      if (err) {
        reject({ message: "Something went wrong, Please try again!" });
      } else {
        resolve({ message: "Product creation data added successfully!" });
      }
    });
  });
};
//get all product creation data
export const getProjectcreationDataService = async (page = 1, limit = 5, product) => {
  return new Promise((resolve, reject) => {
    const offset = (page - 1) * limit;
    let query = `SELECT pss.*, p.NAME AS PRODUCT_NAME FROM product_stock_stages pss JOIN product p ON pss.PRODUCT_CODE = p.PRODUCT_CODE WHERE 1 = 1`;
    let countQuery = `SELECT COUNT(*) AS total FROM product_stock_stages WHERE 1 = 1`;
    let queryParams = [];
    let countParams = [];

    if (product && product.trim() !== "" && product !== "null") {
      query += ` AND pss.PRODUCT_CODE = ?`;
      countQuery += ` AND PRODUCT_CODE = ?`;
      queryParams.push(product);
      countParams.push(product);
    }

    query += ` ORDER BY pss.CREATE_DATE DESC LIMIT ? OFFSET ?`;
    queryParams.push(parseInt(limit), parseInt(offset));

    db.query(query, queryParams, (err, result) => {
      if (err) {
        reject({ message: "Something went wrong, Please try again!" });
        return;
      }

      db.query(countQuery, countParams, (err, count) => {
        if (err) {
          reject({ message: "Something went wrong, Please try again!" });
          return;
        }

        const total = count[0].total;
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
}

export const getProductstockDataService = async (searchQuery) => {
  return new Promise((resolve, reject) => {
    let query = `SELECT p.*, pr.NAME
    FROM production p
    JOIN product pr ON p.PRODUCT_CODE = pr.PRODUCT_CODE`;

    if (searchQuery) {
      query += ` WHERE p.PRODUCT_CODE LIKE '%${searchQuery}%' OR pr.NAME LIKE '%${searchQuery}%'`;
    }

    db.query(query, (err, result) => {
      if (err) {
        reject({ message: "Something went wrong, Please try again!" });
        return;
      }
      resolve({ data: result });
    });
  });
};


export const editProjectcreationDataService = async (
  product_code,
  updated_date,
  quantity,
  damage_count,
  stage,
  id
) => {
  return new Promise((resolve, reject) => {
    const query = `UPDATE product_stock_stages SET STAGE = '${stage}', DAMAGE_COUNT = '${damage_count}', QUANTITY = '${quantity}', UPDATE_DATE = '${updated_date}' WHERE ID = '${id}'`;
    const query3 =`UPDATE production p 
     JOIN product_stock_stages ps ON p.PRODUCT_CODE = ps.PRODUCT_CODE
     SET p.QUANTITY = (ps.QUANTITY - ps.DAMAGE_COUNT),
     p.UPDATE_DATE = NOW() WHERE ps.STAGE = (
      SELECT MAX(ss.STOCK_STAGE_TAG) 
      FROM stock_stages ss 
      WHERE ps.PRODUCT_CODE = p.PRODUCT_CODE);`;

    db.query(query, (err) => {
      if (err) {
        reject({ message: "Something went wrong, Please try again!" });
      } else {
        resolve({ message: "Project creation data updated successfully" });
      }
    });
    db.query(query3, (err) => {
      if (err) {
        reject({ message: "Something went wrong, Please try again!" });
      } else {
        resolve({ message: "Project creation data updated successfully" });
      }
    });
  });
};

//get productlist
export const getProductListService = async () => {
  return new Promise((resolve, reject) => {
    const query = `SELECT PRODUCT_CODE, NAME FROM product WHERE STATUS = 1`;

    db.query(query, (err, result) => {
      if (err) {
        reject({ message: "Something went wrong, Please try again!" });
      } else {
        resolve(result);
      }
    });
  });
};
