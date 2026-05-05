import User from "../models/User.js";
import Complaint from "../models/Complaint.js";

// 🔥 ADMIN → ALL USERS
export const getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      role = "",
      status = "", // assigned / free
    } = req.query;

    const query = {};

    // 🔍 SEARCH
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // 🎯 ROLE
    if (role) {
      query.role = role;
    }

    // 🔥 STEP 1: FETCH PAGINATED USERS
    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    // 🔥 STEP 2: ADD TASK COUNT
    const usersWithTasks = await Promise.all(
      users.map(async (u) => {
        const count = await Complaint.countDocuments({
          assignedTo: u._id,
        });

        return {
          ...u.toObject(),
          taskCount: count,
          workStatus: count > 0 ? "assigned" : "free",
        };
      })
    );

    // 🔥 STEP 3: STATUS FILTER (IMPORTANT NOTE)
    let finalUsers = usersWithTasks;

    if (status) {
      finalUsers = usersWithTasks.filter(
        (u) => u.workStatus === status
      );
    }

    // 🔥 STEP 4: TOTAL COUNT (for pagination)
    const totalUsers = await User.countDocuments(query);

    res.json({
      page: Number(page),
      totalPages: Math.ceil(totalUsers / limit),
      total: totalUsers,
      users: finalUsers,
    });

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



export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user);

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};