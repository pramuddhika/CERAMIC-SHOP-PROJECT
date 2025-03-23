import express from "express";
import {
  generateUserIdController,
  createMemberController,
  signUpController,
  supplierController,
  supplierListController,
  loginController,
  supplierDataController,
  supplierEditController,
  getMemberDataController,
  editMemberDataController,
  getRegisterPageDataController,
  RegisterController,
  getCustomerDataController
} from "../controllers/auth-controller.js";

const router = express.Router();

//user id generation
router.get("/generateUserId", generateUserIdController);
// member creation
router.post("/createMember", createMemberController);
// customer creation - signup
router.post("/createCustomer", signUpController);
// supplier creation
router.post("/createSupplier", supplierController);
// get supplier list
router.get("/getSupplierList", supplierListController);
// get supllier data
router.post("/getSupplierData", supplierDataController);
// log in
router.post("/login", loginController);
// edit supplier
router.post("/editSupplier", supplierEditController);
// get member data
router.post("/getMemberData", getMemberDataController);
// edit member data
router.post("/editMemberData", editMemberDataController);
//get register page data
router.get("/getRegisterPageData/:id", getRegisterPageDataController);
//register user
router.post("/registerUser", RegisterController);
//get customer data
router.post("/getCustomerData", getCustomerDataController);

export default router;
