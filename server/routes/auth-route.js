import express from "express";
import {
  generateUserIdController,
  createMemberController,
  signUpController,
} from "../controllers/auth-controller.js";

const router = express.Router();

//user id generation
router.get("/generateUserId", generateUserIdController);
// member creation
router.post("/createMember", createMemberController);
// customer creation - signup
router.post("/createCustomer", signUpController);

export default router;
