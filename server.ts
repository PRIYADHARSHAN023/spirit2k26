import express from "express";
import { createServer as createViteServer } from "vite";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://infotech:infotech%402026@cluster0.qnamgvq.mongodb.net/?appName=Cluster0";

mongoose.connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err));

const registrationSchema = new mongoose.Schema({
  registrationId: { type: String, unique: true },
  name: { type: String, required: true },
  college: { type: String, required: true },
  department: { type: String, required: true },
  year: { type: String, required: true },
  gender: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  events: [String],
  paymentStatus: { type: String, default: 'Pending' },
  paymentScreenshot: String,
  createdAt: { type: Date, default: Date.now }
});

const Registration = mongoose.model("Registration", registrationSchema);

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Admin = mongoose.model("Admin", adminSchema);

const counterSchema = new mongoose.Schema({
  id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

const Counter = mongoose.model("Counter", counterSchema);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API routes
  app.post("/api/register", async (req, res) => {
    console.log("Registering user:", req.body.email);
    const { name, college, department, year, gender, phone, email, events, paymentScreenshot } = req.body;
    try {
      // Check for duplicate email
      const existing = await Registration.findOne({ email });
      if (existing) {
        console.log("Email already exists:", email);
        return res.status(400).json({ error: "Email already registered" });
      }

      // Generate Registration ID: SP26-XXXX (using persistent counter to avoid recycling)
      let counter = await Counter.findOneAndUpdate(
        { id: "registrationId" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      const registrationId = `SP26-${String(counter.seq).padStart(4, '0')}`;


      const registration = new Registration({
        registrationId,
        name,
        college,
        department,
        year,
        gender,
        phone,
        email,
        events,
        paymentScreenshot,
        paymentStatus: 'Completed'
      });

      await registration.save();
      console.log("Registration successful:", registrationId);

      res.json({
        success: true,
        registration
      });
    } catch (error) {
      console.error("Full Registration error:", error);
      res.status(500).json({
        error: "Failed to register",
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
    }
  });


  app.post("/api/admin/register", async (req, res) => {
    const { username, email, password } = req.body;
    try {
      const existing = await Admin.findOne({ username });
      if (existing) {
        return res.status(400).json({ error: "Username already exists" });
      }
      const admin = new Admin({ username, email, password });
      await admin.save();
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to register admin" });
    }
  });

  app.post("/api/admin/login", async (req, res) => {
    const { username, password } = req.body;
    try {
      const admin = await Admin.findOne({ username, password });
      if (admin) {
        res.json({ success: true, token: "mock-jwt-token" });
      } else {
        // Fallback for first time if no admins exist
        const count = await Admin.countDocuments();
        if (count === 0 && username === "admin" && password === "spirit2k26") {
          res.json({ success: true, token: "mock-jwt-token" });
        } else {
          res.status(401).json({ error: "Invalid credentials" });
        }
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Login failed" });
    }
  });


  app.get("/api/admin/registrations", async (req, res) => {

    try {
      const registrations = await Registration.find().sort({ createdAt: -1 });
      res.json(registrations);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch registrations" });
    }
  });

  app.delete("/api/admin/registrations/:id", async (req, res) => {
    const { id } = req.params;
    try {
      await Registration.findByIdAndDelete(id);
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to delete registration" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

