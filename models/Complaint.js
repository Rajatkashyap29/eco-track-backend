import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    //  WASTE DETAILS
    title: { type: String, required: true },
    wasteType: {
      type: String,
      enum: ["dry", "wet", "mixed"],
      required: true,
    },

    volume: {
      type: String,
      enum: ["small", "medium", "large"],
      required: true,
    },

    description: { type: String, required: true },
    extra: String,

    images: [{ type: String, required: true }], // URLs

    //  LOCATION
    pincode: { type: String, required: true },
    ward: String,
    city: { type: String, required: true },
    street: { type: String, required: true },
    landmark: String,
    locationExtra: String,

    //  STATUS FLOW
    status: {
      type: String,
      enum: ["pending", "assigned", "in-progress", "completed"],
      default: "pending",
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Complaint", complaintSchema);