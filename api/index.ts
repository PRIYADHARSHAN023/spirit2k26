import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://infotech:infotech%402026@cluster0.qnamgvq.mongodb.net/?appName=Cluster0";

if (mongoose.connection.readyState === 0) {
    mongoose.connect(MONGODB_URI)
        .then(() => console.log("Connected to MongoDB Atlas (Vercel)"))
        .catch((err) => console.error("MongoDB connection error:", err));
}

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

const Registration = mongoose.models.Registration || mongoose.model("Registration", registrationSchema);

const adminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema);

const counterSchema = new mongoose.Schema({
    id: { type: String, required: true },
    seq: { type: Number, default: 0 }
});

const Counter = mongoose.models.Counter || mongoose.model("Counter", counterSchema);

const app = express();
app.use(express.json({ limit: '10mb' }));

app.post("/api/register", async (req: Request, res: Response) => {
    const { name, college, department, year, gender, phone, email, events, paymentScreenshot } = req.body;
    try {
        const existing = await Registration.findOne({ email });
        if (existing) return res.status(400).json({ error: "Email already registered" });

        let counter = await Counter.findOneAndUpdate(
            { id: "registrationId" },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        const registrationId = `SP26-${String(counter.seq).padStart(4, '0')}`;

        const registration = new Registration({
            registrationId, name, college, department, year, gender, phone, email, events, paymentScreenshot,
            paymentStatus: 'Completed'
        });

        await registration.save();
        res.json({ success: true, registration });
    } catch (error) {
        res.status(500).json({ error: "Failed to register", details: error instanceof Error ? error.message : String(error) });
    }
});

app.post("/api/admin/register", async (req: Request, res: Response) => {
    const { username, email, password } = req.body;
    try {
        const existing = await Admin.findOne({ username });
        if (existing) return res.status(400).json({ error: "Username already exists" });
        const admin = new Admin({ username, email, password });
        await admin.save();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: "Failed to register admin" });
    }
});

app.post("/api/admin/login", async (req: Request, res: Response) => {
    const { username, password } = req.body;
    try {
        const admin = await Admin.findOne({ username, password });
        if (admin) {
            res.json({ success: true, token: "mock-jwt-token" });
        } else {
            const count = await Admin.countDocuments();
            if (count === 0 && username === "admin" && password === "spirit2k26") {
                res.json({ success: true, token: "mock-jwt-token" });
            } else {
                res.status(401).json({ error: "Invalid credentials" });
            }
        }
    } catch (error) {
        res.status(500).json({ error: "Login failed" });
    }
});

app.get("/api/admin/registrations", async (req: Request, res: Response) => {
    try {
        const registrations = await Registration.find().sort({ createdAt: -1 });
        res.json(registrations);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch registrations" });
    }
});

app.delete("/api/admin/registrations/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await Registration.findByIdAndDelete(id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete registration" });
    }
});

export default app;
