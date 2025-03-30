import express from "express";
import {
    addContactUsController,
    getContactUsController,
    sendConrtactUsReplyController
 } from "../controllers/contactUs-controller.js";

const router = express.Router();

//senddata to db
router.post("/add", addContactUsController);
//get contact us
router.get("/get", getContactUsController);
//send reply to email
router.post("/sendReply", sendConrtactUsReplyController);

export default router;
