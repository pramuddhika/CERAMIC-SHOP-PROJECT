import express from "express";
import {
  generateUserIdController,
  createMemberController,
  signUpController,
  supplierController,
  supplierListController,
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

export default router;
