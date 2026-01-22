import express from "express";
import {
  getAllMessages,
  sendMessage,
} from "../controller/messageController.js";
import { isAdminAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

/* ======================================================
   FRONTEND (Contact Form)
====================================================== */

// Send message
router.post("/", sendMessage);

/* ======================================================
   DASHBOARD (Admin)
====================================================== */

// Get all messages
router.get("/", isAdminAuthenticated, getAllMessages);

export default router;
