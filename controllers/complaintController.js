import Complaint from "../models/Complaint.js";
import User from "../models/User.js";

//  CREATE COMPLAINT
export const createComplaint = async (req, res) => {
  try {
    const {
      title,
      wasteType,
      volume,
      description,
      extra,
      pincode,
      ward,
      city,
      street,
      landmark,
      locationExtra,
    } = req.body;

    //  IMAGE PATHS
    const images = req.files.map((file) => file.path);

    if (images.length !== 3) {
      return res.status(400).json({ msg: "Upload exactly 3 images" });
    }

    const complaint = await Complaint.create({
      user: req.user._id,
      title,
      wasteType,
      volume,
      description,
      extra,
      images,
      pincode,
      ward,
      city,
      street,
      landmark,
      locationExtra,
    });

    res.status(201).json(complaint);

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};


export const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};



export const assignStaff = async (req, res) => {
  try {
    const { staffId } = req.body;

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ msg: "Complaint not found" });
    }

    complaint.assignedTo = staffId;
    complaint.status = "assigned";

    await complaint.save();

    res.json({ msg: "Staff assigned successfully", complaint });

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ msg: "Complaint not found" });
    }

    //  only assigned staff update kar sakta hai
    if (complaint.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    complaint.status = status;

    await complaint.save();

    res.json({ msg: "Status updated", complaint });

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};


export const getAllComplaints = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      assignedTo = "",
      user = "", 
    } = req.query;

    const query = {};

    //  FILTER BY STAFF
    if (assignedTo) {
      query.assignedTo = assignedTo;
    }

    //  FILTER BY USER (VERY IMPORTANT)
    if (user) {
      query.user = user;
    }

    const complaints = await Complaint.find(query)
      .populate("user", "name email")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Complaint.countDocuments(query);

    res.json({
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      total,
      complaints,
    });

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getAssignedComplaints = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 10;

    const statusFilter = req.query.status
      ? { status: req.query.status }
      : {};

    const query = {
      assignedTo: req.user._id,
      ...statusFilter,
    };

    const total = await Complaint.countDocuments(query);

    const complaints = await Complaint.find(query)
      .populate("user", "name phone")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      page,
      totalPages: Math.ceil(total / limit),
      total,
      complaints,
    });

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate("user", "name email phone")
      .populate("assignedTo", "name email");

    if (!complaint) {
      return res.status(404).json({ msg: "Complaint not found" });
    }

    // 🔒 SECURITY (important)
    // user → sirf apni complaint dekhe
    if (
      req.user.role === "user" &&
      complaint.user._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    res.json(complaint);

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};


export const getDashboardStats = async (req, res) => {
  try {
    const totalRequests = await Complaint.countDocuments();

    const pending = await Complaint.countDocuments({ status: "pending" });

    const assigned = await Complaint.countDocuments({ status: "assigned" });

    const inProgress = await Complaint.countDocuments({
      status: "in-progress",
    });

    const completed = await Complaint.countDocuments({
      status: "completed",
    });

    // 👇 USERS + STAFF
    const totalUsers = await User.countDocuments({ role: "user" });

    const activeStaff = await User.countDocuments({ role: "staff" });

    res.json({
      totalRequests,
      pending,
      assigned,
      inProgress,
      completed,
      totalUsers,
      activeStaff,
    });

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};


export const getStaffStats = async (req, res) => {
  try {
    const staffId = req.user._id;

    const total = await Complaint.countDocuments({ assignedTo: staffId });

    const pending = await Complaint.countDocuments({
      assignedTo: staffId,
      status: "assigned",
    });

    const inProgress = await Complaint.countDocuments({
      assignedTo: staffId,
      status: "in-progress",
    });

    const completed = await Complaint.countDocuments({
      assignedTo: staffId,
      status: "completed",
    });

    res.json({
      total,
      pending,
      inProgress,
      completed,
    });

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};


export const getUserStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const total = await Complaint.countDocuments({ user: userId });

    const pending = await Complaint.countDocuments({
      user: userId,
      status: "pending",
    });

    const inProgress = await Complaint.countDocuments({
      user: userId,
      status: "in-progress",
    });

    const completed = await Complaint.countDocuments({
      user: userId,
      status: "completed",
    });

    res.json({
      total,
      pending,
      inProgress,
      completed,
    });

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};