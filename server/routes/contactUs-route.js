import express from "express";
import {
    addContactUsController,
    getContactUsController
 } from "../controllers/contactUs-controller.js";

const router = express.Router();

//senddata to db
router.post("/add", addContactUsController);
//get contact us
router.get("/get" , getContactUsController);

export default router;
