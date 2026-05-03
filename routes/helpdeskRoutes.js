import express from "express";
import {
  createTicket,
  getMyTickets,
  getAllTickets,
  updateTicket,
} from "../controllers/helpdeskController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// USER / STAFF
router.post("/", protect, createTicket);
router.get("/my", protect, getMyTickets);

// ADMIN
router.get("/all", protect, adminOnly, getAllTickets);
router.put("/:id", protect, adminOnly, updateTicket);

export default router;