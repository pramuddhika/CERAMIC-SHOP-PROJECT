import express from "express";
import { addContactUsController } from "../controllers/contactUs-controller.js";

const router = express.Router();

//senddata to db
router.post("/add", addContactUsController);

export default router;
