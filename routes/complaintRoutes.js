import {
  createComplaint,
  getMyComplaints,
  assignStaff,
  updateStatus,
  getAllComplaints,
  getAssignedComplaints,
  getComplaintById,
  getDashboardStats,
  getStaffStats,
  getUserStats,
} from "../controllers/complaintController.js";

import { protect, adminOnly, staffOnly } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";
import express from "express";

const router = express.Router();

// ✅ CREATE
router.post("/", protect, upload.array("images", 3), createComplaint);

// ✅ USER → GET MY
router.get("/my", protect, getMyComplaints);

// ✅ ADMIN → ASSIGN
router.put("/assign/:id", protect, adminOnly, assignStaff);

// ✅ STAFF → UPDATE STATUS
router.put("/status/:id", protect, staffOnly, updateStatus);

router.get("/all", protect, adminOnly, getAllComplaints);

// STAFF → MY TASKS
router.get("/assigned", protect, staffOnly, getAssignedComplaints);

router.get("/:id", protect, getComplaintById);

router.get("/stats/dashboard", protect, adminOnly, getDashboardStats);

router.get("/stats/staff", protect, staffOnly, getStaffStats);

router.get("/stats/user", protect, getUserStats);

export default router;