import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import ticketRoutes from "./routes/helpdeskRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes  from "./routes/userRoutes.js"

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use("/uploads", express.static("uploads"));


// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/users", userRoutes);


app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


