import jwt from "jsonwebtoken";
import User from "../models/User.js";

// 🔒 PROTECT (AUTH)
export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token || !token.startsWith("Bearer")) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ msg: "User not found" });
    }

    // 🚫 BLOCK CHECK
    if (user.isBlocked) {
      return res.status(403).json({ msg: "Account blocked" });
    }

    req.user = user;

    next();

  } catch (error) {
    res.status(401).json({ msg: "Invalid token" });
  }
};



// 🔴 ADMIN ONLY
export const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Admin access only" });
  }
  next();
};



// 🔵 STAFF ONLY
export const staffOnly = (req, res, next) => {
  if (req.user.role !== "staff") {
    return res.status(403).json({ msg: "Staff access only" });
  }
  next();
};