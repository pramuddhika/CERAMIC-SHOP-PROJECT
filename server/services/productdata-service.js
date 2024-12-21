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
export const addNewCategoryService = async (code, name, description, image, status) => {
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
    } );
  });
};