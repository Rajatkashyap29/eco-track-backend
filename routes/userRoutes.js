import express from "express";
import {
  getAllUsers,
  getUserById,
  updateProfile,
  deleteUser,
  changeRole,
  toggleBlockUser
} from "../controllers/userController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔥 ADMIN
router.get("/", protect, adminOnly, getAllUsers);
router.get("/:id", protect, adminOnly, getUserById);
router.delete("/:id", protect, adminOnly, deleteUser);
router.put("/role/:id", protect, adminOnly, changeRole);

// 🔥 USER
router.put("/profile", protect, updateProfile);

router.put("/block/:id", protect, adminOnly, toggleBlockUser);


export default router;