import { db } from "../env.js";

//add product creation data
export const addprojectcreationDataService = async (
  product_code,
  create_date,
  quantity,
  stage
) => {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO product_stock_stages (PRODUCT_CODE,  QUANTITY, CREATE_DATE, STAGE) VALUES ('${product_code}', '${quantity}', '${create_date}', '${stage}')`;

    db.query(query, (err) => {
      if (err) {
        reject({ message: "Something went wrong, Please try again!" });
      } else {
        resolve({ message: "Product creation data added successfully!" });
      }
    });
  });
};
//get all Project creation data
export const getProjectcreationDataService = async (
  page = 1,
  limit = 5,
  product
) => {
  try {
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let query = `
      SELECT 
        pss.*, 
        p.NAME AS PRODUCT_NAME
      FROM product_stock_stages pss
      JOIN product p ON pss.PRODUCT_CODE = p.PRODUCT_CODE
      WHERE 1 = 1
    `;

    let countQuery = `SELECT COUNT(*) AS total FROM product_stock_stages WHERE 1 = 1`;
    let queryParams = [];
    let countParams = [];

    if (product) {
      query += ` AND pss.PRODUCT_CODE = ?`;
      countQuery += ` AND PRODUCT_CODE = ?`;
      queryParams.push(product);
      countParams.push(product);
    }

    query += ` ORDER BY pss.CREATE_DATE DESC LIMIT ? OFFSET ?`;
    queryParams.push(parseInt(limit), parseInt(offset));

    const [result] = await db.query(query, queryParams);
    const [countResult] = await db.query(countQuery, countParams);

    const total = countResult[0]?.total || 0;
    const totalPages = Math.ceil(total / limit);

    return {
      data: result,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages,
    };
  } catch (error) {
    console.error("Error in getProjectcreationDataService:", error);
    throw new Error("Something went wrong, Please try again!");
  }
};

export const getProductstockDataService = async (page = 1, limit = 5) => {
  return new Promise((resolve, reject) => {
    const offset = (page - 1) * limit;
    const query = `SELECT p.*, pr.NAME
    FROM production p
    JOIN product pr ON p.PRODUCT_CODE = pr.PRODUCT_CODE
    LIMIT ? OFFSET ?`;

    db.query(query, [parseInt(limit), parseInt(offset)], (err, result) => {
      if (err) {
        reject({ message: "Something went wrong, Please try again!" });
        return;
      }
      const countQuery = `SELECT COUNT(*) AS total FROM production`;

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
    const query3 = `INSERT INTO production (PRODUCT_CODE, QUANTITY, UPDATE_DATE)
SELECT 
    ps.PRODUCT_CODE, 
    (ps.QUANTITY - ps.DAMAGE_COUNT) AS QUANTITY, 
    ps.UPDATE_DATE
FROM product_stock_stages ps
WHERE ps.STAGE = (
    SELECT MAX(STOCK_STAGE_TAG)
    FROM stock_stages
    WHERE STATUS = 1
);
`;

    db.query(query, (err) => {
      if (err) {
        reject({ message: "Something went wrong, Please try again!" });
      } else {
        resolve({ message: "Project creation data updated successfully" });
      }
    });
    db.query(query3, (err) => {
      if (err) {
        reject({ message: " try again!" });
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
