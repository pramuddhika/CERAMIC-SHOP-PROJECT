import { Console } from "console";
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
          id = `SUB-${newnumberpart}`;
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

//get category data list
export const getCategoryDataListService = async () => {
  return new Promise((resolve, reject) => {
    const query =
      "SELECT CATAGORY_CODE, NAME, IMAGE FROM category WHERE STATUS = 1";
    db.query(query, (err, result) => {
      if (err) {
        console.log("hi");
        reject({ message: "Something went wrong, Please try again!" });
        return;
      }
      const list = result.map((element) => ({
        value: element.CATAGORY_CODE,
        label: element.NAME,
        image: element.IMAGE,
      }));
      resolve(list);
    });
  });
};

//add new subcategory
export const addSubNewCategoryService = async (
  code,
  category,
  name,
  description,
  image,
  status
) => {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO sub_category (SUB_CATAGORY_CODE, CATAGORY_CODE, NAME, DESCRIPTION, IMAGE, STATUS) VALUES (?,?,?,?,?,?)`;
    db.query(
      query,
      [code, category, name, description, image, status],
      (err, result) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            reject({ message: "Data already exists!" });
          } else {
            reject({ message: 'Something went wrong, Please try again!' });
          }
        }
        resolve({ message: "Subcategory added successfully" });
      }
    );
  });
};

//update subcategory data
export const updateSubCategoryService = async (
  code,
  name,
  description,
  image,
  status,
  category
) => {
  return new Promise((resolve, reject) => {
    if (image === null) {
      const query = `UPDATE sub_category SET NAME = ?, DESCRIPTION = ?, STATUS = ?, CATAGORY_CODE = ? WHERE SUB_CATAGORY_CODE = ?`;
      db.query(
        query,
        [name, description, status, category, code],
        (err, result) => {
          if (err) {
            reject({ message: "Something went wrong, Please try again!" });
            return;
          }
          resolve({ message: "Subcategory updated successfully" });
        }
      );
    } else {
      const query = `UPDATE sub_category SET NAME = ?, DESCRIPTION = ?, IMAGE = ?, STATUS = ?, CATAGORY_CODE = ? WHERE SUB_CATAGORY_CODE = ?`;
      db.query(
        query,
        [name, description, image, status, category, code],
        (err, result) => {
          if (err) {
            reject({ message: "Something went wrong, Please try again!" });
            return;
          }
          resolve({ message: "Subcategory updated successfully" });
        }
      );
    }
  });
};

//get subcategory data list
export const getSubCategoryDataListService = async () => {
  return new Promise((resolve, reject) => {
    const query =
      "SELECT SUB_CATAGORY_CODE, NAME FROM sub_category WHERE STATUS = 1";
    db.query(query, (err, result) => {
      if (err) {
        reject({ message: "Something went wrong, Please try again!" });
        return;
      }
      const list = result.map((element) => ({
        value: element.SUB_CATAGORY_CODE,
        label: element.NAME,
      }));
      resolve(list);
    });
  });
};

//add new product
export const addNewProductService = async (
  code,
  category,
  subcategory,
  name,
  description,
  image,
  status,
  price
) => {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO product (PRODUCT_CODE,SUB_CATAGORY_CODE , CATAGORY_CODE, NAME, DESCRIPTION, IMAGE, STATUS , PRICE) VALUES (?,?,?,?,?,?,?,?)`;
    const stoclQuery = `INSERT INTO production (PRODUCT_CODE,UPDATE_DATE,QUANTITY) values(?,?,?)`;
    db.query(
      query,
      [code, subcategory, category, name, description, image, status, price],
      (err, result) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            reject({ message: "Data already exists!" });
            return;
          } else {
            reject({ message: "Something went wrong, Please try again!" });
            return;
          }
        }

        db.query(stoclQuery, [code, new Date(), 0], (err, result) => {
          if (err) {
            if (err.code === "ER_DUP_ENTRY") {
              reject({ message: "Data already exists!" });
            } else {
              reject({ message: "Something went wrong, Please try again!" });
            }
          }
          resolve({ message: "Product added successfully" });
        });
      }
    );
  });
};

//edit product data
export const updateProductService = async (
  code,
  name,
  description,
  image,
  status,
  category,
  subcategory,
  price
) => {
  return new Promise((resolve, reject) => {
    if (image === null) {
      const query = `UPDATE product SET NAME = ?, DESCRIPTION = ?, STATUS = ?, CATAGORY_CODE = ?, SUB_CATAGORY_CODE = ?, PRICE = ? WHERE PRODUCT_CODE = ?`;
      db.query(
        query,
        [name, description, status, category, subcategory, price, code],
        (err, result) => {
          if (err) {
            reject({ message: "Something went wrong, Please try again!" });
            return;
          }
          resolve({ message: "Product updated successfully" });
        }
      );
    } else {
      const query = `UPDATE product SET NAME = ?, DESCRIPTION = ?, IMAGE = ?, STATUS = ?, CATAGORY_CODE = ?, SUB_CATAGORY_CODE = ?, PRICE = ? WHERE PRODUCT_CODE = ?`;
      db.query(
        query,
        [name, description, image, status, category, subcategory, price, code],
        (err, result) => {
          if (err) {
            reject({ message: "Something went wrong, Please try again!" });
            return;
          }
          resolve({ message: "Product updated successfully" });
        }
      );
    }
  });
};

//get subcatory according to selected category
export const getCategoryListService = async (category) => {
  return new Promise((resolve, reject) => {
    const query =
      "SELECT SUB_CATAGORY_CODE,IMAGE, NAME FROM sub_category WHERE CATAGORY_CODE = ? AND STATUS = 1";
    db.query(query, [category], (err, result) => {
      if (err) {
        reject({ message: "Something went wrong, Please try again!" });
        return;
      }
      const list = result.map((element) => ({
        value: element.SUB_CATAGORY_CODE,
        image: element.IMAGE,
        label: element.NAME,
      }));
      resolve(list);
    });
  });
};

//get product data according to selected sub category
export const getProductService = async (subcategory) => {
  return new Promise((resolve, reject) => {
    const query =
      "SELECT PRODUCT_CODE,NAME,IMAGE FROM product WHERE SUB_CATAGORY_CODE = ? AND STATUS = 1";
    db.query(query, [subcategory], (err, result) => {
      if (err) {
        reject({ message: "Something went wrong, Please try again!" });
        return;
      }
      const list = result.map((element) => ({
        value: element.PRODUCT_CODE,
        image: element.IMAGE,
        label: element.NAME,
      }));
      resolve(list);
    });
  });
};

//get active product data
export const getShopProductService = async (page = 1, limit= 12) => {
  return new Promise((resolve, reject) => {
    const query =
     `SELECT
      product.PRODUCT_CODE,product.SUB_CATAGORY_CODE,product.CATAGORY_CODE,product.NAME,product.DESCRIPTION,product.IMAGE,product.PRICE,
      sub_category.NAME AS SUB_CATAGORY_NAME,category.NAME AS CATAGORY_NAME,
      production.QUANTITY
      FROM product
      JOIN sub_category ON product.SUB_CATAGORY_CODE = sub_category.SUB_CATAGORY_CODE
      JOIN category ON product.CATAGORY_CODE = category.CATAGORY_CODE
      JOIN production ON product.PRODUCT_CODE = production.PRODUCT_CODE
      WHERE product.STATUS = 1 LIMIT ? OFFSET ?`;
    
    const offset = (page - 1) * limit;
    db.query(query, [parseInt(limit), parseInt(offset)], (err, result) => {
      if (err) {
        reject({ message: err });
        return;
      }
      let countQuery = `SELECT COUNT(*) AS total FROM product WHERE STATUS = 1`;
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
