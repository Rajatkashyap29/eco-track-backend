import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";



// ✅ REGISTER
export const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      confirmPassword,
      role,
      address,
      pincode,
      answer1,
      answer2,
      answer3,
    } = req.body;

    // 🔥 VALIDATION
    if (
      !name ||
      !email ||
      !phone ||
      !password ||
      !confirmPassword ||
      !address ||
      !pincode ||
      !answer1 ||
      !answer2 ||
      !answer3
    ) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    if (phone.length !== 10) {
      return res.status(400).json({ msg: "Phone must be 10 digits" });
    }

    if (pincode.length !== 6) {
      return res.status(400).json({ msg: "Pincode must be 6 digits" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ msg: "Passwords do not match" });
    }

    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(400).json({ msg: "User already exists" });
    }

    //  HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
      address,
      pincode,
      answer1,
      answer2,
      answer3,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};




// ✅ LOGIN
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Wrong password" });
    }
    if (user.isBlocked) {
      return res.status(403).json({ msg: "Your account is blocked" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};