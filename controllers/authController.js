import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcryptjs";

//  STEP 1: EMAIL CHECK
export const forgotEmailCheck = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: "Email not found" });
    }

    res.json({ msg: "Email verified" });

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

//  STEP 2: SECURITY ANSWERS VERIFY
export const verifyAnswers = async (req, res) => {
  try {
    const { email, answer1, answer2, answer3 } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (
      user.answer1 !== answer1 ||
      user.answer2 !== answer2 ||
      user.answer3 !== answer3
    ) {
      return res.status(400).json({ msg: "Wrong security answers" });
    }

    res.json({ msg: "Answers verified" });

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

//  STEP 3: RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    await user.save();

    res.json({ msg: "Password reset successful" });

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};


//  REGISTER
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

    //  VALIDATION
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




// LOGIN
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