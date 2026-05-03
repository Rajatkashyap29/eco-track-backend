import User from "../models/User.js";

// 🔥 ADMIN → ALL USERS
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// 🔍 USER DETAIL
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};



// ✏️ USER UPDATE (SELF)
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.address = req.body.address || user.address;
    user.pincode = req.body.pincode || user.pincode;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      phone: updatedUser.phone,
      address: updatedUser.address,
      pincode: updatedUser.pincode,
    });

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};


// ❌ DELETE USER
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    await user.deleteOne();

    res.json({ msg: "User removed" });

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};


// 🔄 CHANGE ROLE (user ↔ staff)
export const changeRole = async (req, res) => {
  try {
    const { role } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    user.role = role;

    await user.save();

    res.json({ msg: "Role updated", user });

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};


// 🔒 BLOCK / UNBLOCK USER
export const toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    user.isBlocked = !user.isBlocked;

    await user.save();

    res.json({
      msg: user.isBlocked ? "User blocked 🚫" : "User unblocked ✅",
      isBlocked: user.isBlocked,
    });

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};