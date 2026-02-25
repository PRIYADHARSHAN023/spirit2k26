import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://spirit2k26:spirit2k26%40official2026@cluster0.gsqe29q.mongodb.net/?appName=Cluster0";

// Connection management for Serverless - Global Cache
let cached: any = (global as any).mongoose;
if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        // Explicitly enable buffering to prevent the error in the screenshot
        mongoose.set('bufferCommands', true);

        cached.promise = mongoose.connect(MONGODB_URI, {
            bufferCommands: true,
            connectTimeoutMS: 20000,
            socketTimeoutMS: 45000,
        }).then((m) => m);
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }
    return cached.conn;
}

// Define Schemas with explicit bufferCommands setting
const schemaOptions = { bufferCommands: true };

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
}, schemaOptions);

const adminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
}, schemaOptions);

const counterSchema = new mongoose.Schema({
    id: { type: String, required: true },
    seq: { type: Number, default: 0 }
}, schemaOptions);

// Use existing models if they exist to prevent re-compilation errors
const Registration = mongoose.models.Registration || mongoose.model("Registration", registrationSchema);
const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema);
const Counter = mongoose.models.Counter || mongoose.model("Counter", counterSchema);

const app = express();

app.get("/api/health", async (req: Request, res: Response) => {
    try {
        await connectToDatabase();
        res.json({ status: "OK", connection: mongoose.connection.readyState });
    } catch (error) {
        res.status(500).json({ status: "Error", message: error instanceof Error ? error.message : String(error) });
    }
});

app.use(express.json({ limit: '10mb' }));

app.post("/api/register", async (req: Request, res: Response) => {
    try {
        await connectToDatabase();
        const { name, college, department, year, gender, phone, email, events, paymentScreenshot } = req.body;

        const existing = await Registration.findOne({ email });
        if (existing) return res.status(400).json({ error: "Email already registered" });

        let counter = await Counter.findOneAndUpdate(
            { id: "registrationId" },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        const registrationId = `SPIRIT${String(counter.seq).padStart(3, '0')}`;

        const registration = new Registration({
            registrationId, name, college, department, year, gender, phone, email, events, paymentScreenshot,
            paymentStatus: 'Completed'
        });

        await registration.save();
        res.json({ success: true, registration });
    } catch (error) {
        console.error("Registration fatal error:", error);
        res.status(500).json({ error: "Failed to register", details: error instanceof Error ? error.message : String(error) });
    }
});

app.post("/api/admin/login", async (req: Request, res: Response) => {
    try {
        await connectToDatabase();
        const { username, password } = req.body;

        // Super Admin check
        if (username === "admin2k26" && password === "admin@2k26") {
            return res.json({ success: true, token: "admin-token", role: "ALL" });
        }

        // Handler check: [EventName]@2026 / [EventName]@2026
        if (username.endsWith("@2026") && username === password) {
            const eventName = username.split("@")[0];
            return res.json({ success: true, token: "handler-token", role: eventName });
        }

        const admin = await Admin.findOne({ username, password });
        if (admin) {
            res.json({ success: true, token: "mock-jwt-token", role: "ALL" });
        } else {
            res.status(401).json({ error: "Invalid credentials" });
        }
    } catch (error) {
        res.status(500).json({ error: "Login failed" });
    }
});

app.get("/api/admin/registrations", async (req: Request, res: Response) => {
    try {
        await connectToDatabase();
        const { role } = req.query;
        let query = {};
        if (role && role !== "ALL") {
            query = { events: role };
        }
        const registrations = await Registration.find(query).sort({ createdAt: -1 });
        res.json(registrations);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch registrations" });
    }
});

app.delete("/api/admin/registrations/:id", async (req: Request, res: Response) => {
    try {
        await connectToDatabase();
        const { id } = req.params;
        await Registration.findByIdAndDelete(id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete registration" });
    }
});

export default app;
