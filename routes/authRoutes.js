import express from "express";
import {
  registerUser,
  loginUser,
  forgotEmailCheck,
  verifyAnswers,
  resetPassword,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// 🔥 FORGOT PASSWORD FLOW
router.post("/forgot-email-check", forgotEmailCheck);
router.post("/verify-answers", verifyAnswers);
router.post("/reset-password", resetPassword);

export default router;