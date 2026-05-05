import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    role: {
      type: String,
      enum: ["user", "staff"],
      required: true,
    },

    topic: { type: String, required: true },
    complaintId: String,

    description: { type: String, required: true },

    phone: String,
    email: String,

    department: String,
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    status: {
      type: String,
      enum: ["open", "in-progress", "resolved"],
      default: "open",
    },

    response: String, 
  },
  { timestamps: true }
);

export default mongoose.model("Ticket", ticketSchema);