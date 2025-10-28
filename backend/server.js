// backend/server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log(err));

// Basic schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  income: Number,
  expenses: [{ title: String, amount: Number, date: Date }],
});

const User = mongoose.model("User", userSchema);

// Simple routes
app.get("/", (req, res) => res.send("FinVerse backend is running ✅"));

app.post("/api/addExpense", async (req, res) => {
  const { email, title, amount } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });
  user.expenses.push({ title, amount, date: new Date() });
  await user.save();
  res.json(user.expenses);
});

app.get("/api/getExpenses/:email", async (req, res) => {
  const user = await User.findOne({ email: req.params.email });
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user.expenses);
});

app.listen(4000, () => console.log("Server running on port 4000 🚀"));
