import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    phone: { type: String, required: true },

    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["user", "admin", "staff"],
      default: "user",
    },

    address: { type: String, required: true },

    pincode: { type: String, required: true },

    answer1: { type: String, required: true },
    answer2: { type: String, required: true },
    answer3: { type: String, required: true },


    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);