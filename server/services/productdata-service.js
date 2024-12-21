import e from "express";
import { db } from "../env.js";

//get category-subcategory-product last id
export const getLastIDService = async (tname) => {
  return new Promise((resolve, reject) => {
    let query;
    switch (tname) {
      case "product":
        query = `SELECT MAX(PRODUCT_CODE) AS PRODUCT_CODE FROM product`;
        break;
      case "category":
        query = `SELECT MAX(CATAGORY_CODE) AS CATAGORY_CODE FROM category`;
        break;
      case "subcategory":
        query = `SELECT MAX(SUB_CATAGORY_CODE) AS SUB_CATAGORY_CODE FROM sub_category`;
        break;
    }

    db.query(query, (err, result) => {
      if (err) {
        reject({ message: "Something went wrong, Please try again!" });
        return;
      }
      if (tname == "product") {
        const product_code = result[0].PRODUCT_CODE;
        let id;
        if (product_code) {
          const numberpart = parseInt(product_code.split("-")[1], 10);
          const newnumberpart = String(numberpart + 1).padStart(6, "0");
          id = `PRO-${newnumberpart}`;
        } else {
          id = `PRO-000001`;
        }
        resolve({ newid: id });
      }
      if (tname == "category") {
        const category_code = result[0].CATAGORY_CODE;
        let id;
        if (category_code) {
          const numberpart = parseInt(category_code.split("-")[1], 10);
          const newnumberpart = String(numberpart + 1).padStart(6, "0");
          id = `CAT-${newnumberpart}`;
        } else {
          id = `CAT-000001`;
        }
        resolve({ newid: id });
      }
      if (tname == "subcategory") {
        const subcategory_code = result[0].SUB_CATAGORY_CODE;
        let id;
        if (subcategory_code) {
          const numberpart = parseInt(subcategory_code.split("-")[1], 10);
          const newnumberpart = String(numberpart + 1).padStart(6, "0");
          id = `SUBCAT-${newnumberpart}`;
        } else {
          id = `SUB-000001`;
        }
        resolve({ newid: id });
      }
    });
  });
};

//add new category
export const addNewCategoryService = async (
  code,
  name,
  description,
  image,
  status
) => {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO category (CATAGORY_CODE, NAME, DESCRIPTION, IMAGE, STATUS) VALUES (?,?,?,?,?)`;
    db.query(query, [code, name, description, image, status], (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          reject({ message: "Data already exists!" });
        } else {
          reject({ message: "Something went wrong, Please try again!" });
        }
      }
      resolve({ message: "Category added successfully" });
    });
  });
};

//get paginated product data
export const getCategoryDataService = async (tname, page = 1, limit = 10) => {
  return new Promise((resolve, reject) => {
    const offset = (page - 1) * limit;
    let query;
    switch (tname) {
      case "category":
        query = `SELECT * FROM category LIMIT ? OFFSET ?`;
        break;
      case "subcategory":
        query = `SELECT * FROM sub_category LIMIT ? OFFSET ?`;
        break;
      case "product":
        query = `SELECT * FROM product LIMIT ? OFFSET ?`;
        break;
    }
    db.query(query, [parseInt(limit), parseInt(offset)], (err, result) => {
      if (err) {
        reject({ message: "Something went wrong, Please try again!" });
        return;
      }
      let countQuery;
      switch (tname) {
        case "category":
          countQuery = `SELECT COUNT(*) AS total FROM category`;
          break;
        case "subcategory":
          countQuery = `SELECT COUNT(*) AS total FROM sub_category`;
          break;
        case "product":
          countQuery = `SELECT COUNT(*) AS total FROM product`;
          break;
      }
      db.query(countQuery, (err, countResult) => {
        if (err) {
          reject({ message: "Something went wrong, Please try again!" });
          return;
        }
        const total = countResult[0].total;
        resolve({
          data: result,
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / limit),
        });
      });
    });
  });
};

//edit category
export const updateCategoryService = async (
  code,
  name,
  description,
  image,
  status
) => {
  return new Promise((resolve, reject) => {
    if (image === null) {
      const query = `UPDATE category SET NAME = ?, DESCRIPTION = ?, STATUS = ? WHERE CATAGORY_CODE = ?`;
      db.query(query, [name, description, status, code], (err, result) => {
        if (err) {
          reject({ message: "Something went wrong, Please try again!" });
          return;
        }
        resolve({ message: "Category updated successfully" });
      });
    } else {
      const query = `UPDATE category SET NAME = ?, DESCRIPTION = ?, IMAGE = ?, STATUS = ? WHERE CATAGORY_CODE = ?`;
      db.query(
        query,
        [name, description, image, status, code],
        (err, result) => {
          if (err) {
            reject({ message: "Something went wrong, Please try again!" });
            return;
          }
          resolve({ message: "Category updated successfully" });
        }
      );
    }
  });
};
