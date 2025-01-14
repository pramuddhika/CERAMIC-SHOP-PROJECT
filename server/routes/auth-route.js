import express from "express";
import {
  generateUserIdController,
  createMemberController,
} from "../controllers/auth-controller.js";

const router = express.Router();

//user id generation
router.get("/generateUserId", generateUserIdController);
// member creation
router.post("/createMember", createMemberController);

export default router;
