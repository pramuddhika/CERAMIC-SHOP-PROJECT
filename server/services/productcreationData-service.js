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
    // Get current stage and max stage
    const getCurrentStageQuery = `
      SELECT pss.STAGE as currentStage,
             (SELECT MAX(STOCK_STAGE_TAG) FROM stock_stages) as maxStage
      FROM product_stock_stages pss
      WHERE pss.ID = ?
    `;

    // Update product_stock_stages
    const updateStageQuery = `
      UPDATE product_stock_stages 
      SET STAGE = ?,
          DAMAGE_COUNT = DAMAGE_COUNT + ?,
          QUANTITY = ?,
          UPDATE_DATE = ?
      WHERE ID = ?
    `;

    // Update production based on scenario
    const updateProductionQuery = `
      UPDATE production 
      SET QUANTITY = CASE 
        -- Max to Max: Only subtract damage count
        WHEN ? = ? AND ? = ? THEN QUANTITY - ?
        -- Non-max to Max: Add new quantity minus total damage
        ELSE QUANTITY + ? - ?
      END,
      UPDATE_DATE = ?
      WHERE PRODUCT_CODE = ?
    `;

    // Execute queries in sequence
    db.query(getCurrentStageQuery, [id], (err, stageResult) => {
      if (err) {
        reject({ message: "Failed to get stage information" });
        return;
      }

      const { currentStage, maxStage } = stageResult[0];
      const isTransitionToMax = currentStage !== maxStage && stage === maxStage;
      const isAlreadyMax = currentStage === maxStage && stage === maxStage;

      // First update product_stock_stages
      db.query(updateStageQuery, 
        [stage, damage_count, quantity, updated_date, id], 
        (err) => {
          if (err) {
            reject({ message: "Failed to update stage data" });
            return;
          }

          // If moving to max stage or already at max stage, update production
          if (isTransitionToMax || isAlreadyMax) {
            db.query(updateProductionQuery, 
              [
                currentStage, maxStage, // For checking if Max to Max
                stage, maxStage,        // For checking new stage is max
                damage_count,           // For damage count reduction
                quantity,               // For adding new quantity
                damage_count,           // For subtracting damage from new quantity
                updated_date,
                product_code
              ], 
              (err) => {
                if (err) {
                  reject({ message: "Failed to update production data" });
                  return;
                }
                resolve({ 
                  message: "Product creation and production data updated successfully" 
                });
              }
            );
          } else {
            resolve({ 
              message: "Product creation data updated successfully" 
            });
          }
        }
      );
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
