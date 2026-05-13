import express from "express";
import {
  getAllUsers,
  getUserById,
  updateProfile,
  deleteUser,
  changeRole,
  toggleBlockUser,
  getMe, //  ADD THIS
} from "../controllers/userController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/me", protect, getMe);
//  ADMIN
router.get("/", protect, adminOnly, getAllUsers);
router.get("/:id", protect, adminOnly, getUserById);
router.delete("/:id", protect, adminOnly, deleteUser);
router.put("/role/:id", protect, adminOnly, changeRole);
router.put("/block/:id", protect, adminOnly, toggleBlockUser);

//  USER
router.put("/profile", protect, updateProfile);

// NEW: GET LOGGED IN USER PROFILE


export default router;