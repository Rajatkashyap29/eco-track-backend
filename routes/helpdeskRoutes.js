import express from "express";
import {
  createTicket,
  getMyTickets,
  getAllTickets,
  updateTicket,
  getTicketById, //  ADD THIS
} from "../controllers/helpdeskController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// USER / STAFF
router.post("/", createTicket);
router.get("/my", protect, getMyTickets);

// ADMIN
router.get("/all", protect, adminOnly, getAllTickets);

//  NEW ROUTE (IMPORTANT)
router.get("/:id", protect, adminOnly, getTicketById);

router.put("/:id", protect, adminOnly, updateTicket);

export default router;