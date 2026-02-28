import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

// MongoDB Connection
const MONGODB_URI = (process.env.MONGODB_URI || "mongodb+srv://spirit2k26:spirit2k26%40official2026@cluster0.gsqe29q.mongodb.net/?appName=Cluster0").trim();

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
    regType: { type: String, required: true, default: 'Individual' },
    teamName: { type: String },
    teamMembers: { type: String },
    memberNames: [{ type: String }],
    name: { type: String, required: true },
    college: { type: String, required: true },
    department: { type: String, required: true },
    year: { type: String, required: true },
    gender: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true }, // Removed unique: true to allow online games repetition
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

// Email Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || "spirit2k26official@gmail.com",
        pass: process.env.EMAIL_PASS
    }
});

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
        const { regType, teamName, teamMembers, memberNames, name, college, department, year, gender, phone, email, events, paymentScreenshot } = req.body;

        const isOnlineGame = events.includes('E-Football (PES)') || events.includes('Free Fire');

        if (!isOnlineGame) {
            // Symposium Events: Check if email already exists for ANY symposium event
            const existingSymp = await Registration.findOne({
                email,
                events: { $not: { $elemMatch: { $in: ['E-Football (PES)', 'Free Fire'] } } }
            });
            if (existingSymp) return res.status(400).json({ error: "Email already registered for Symposium Events" });
        } else {
            // Online Games: Check if the exact event is already registered by this email
            for (const ev of events) {
                const existingGame = await Registration.findOne({ email, events: ev });
                if (existingGame) return res.status(400).json({ error: `Email already registered for ${ev}` });
            }
        }

        let counter = await Counter.findOneAndUpdate(
            { id: "registrationId" },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        const registrationId = `SPIRIT${String(counter.seq).padStart(3, '0')}`;

        const registration = new Registration({
            registrationId, regType, teamName, teamMembers, memberNames, name, college, department, year, gender, phone, email, events, paymentScreenshot,
            paymentStatus: 'Completed'
        });

        await registration.save();

        // Send Confirmation Email
        try {
            const mailOptions = {
                from: process.env.EMAIL_USER || "spirit2k26official@gmail.com",
                to: email,
                subject: `Registration Successful - SPIRIT 2k26 (ID: ${registrationId})`,
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                        <h2 style="color: #00f2ff; text-align: center;">SPIRIT 2k26</h2>
                        <p>Hi <strong>${name}</strong>,</p>
                        <p>Thank you for registering for SPIRIT 2k26! Your registration has been confirmed.</p>
                        
                        <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <p style="margin: 5px 0;"><strong>Registration ID:</strong> <span style="font-family: monospace; color: #bc13fe;">${registrationId}</span></p>
                            <p style="margin: 5px 0;"><strong>Category:</strong> ${regType}</p>
                            ${regType === 'Team' ? `<p style="margin: 5px 0;"><strong>Team Name:</strong> ${teamName}</p>` : ''}
                            <p style="margin: 5px 0;"><strong>College:</strong> ${college}</p>
                            <p style="margin: 5px 0;"><strong>Events:</strong> ${events.join(', ')}</p>
                        </div>
                        
                        <p>Please find your invitation card attached to your dashboard on our website. Bring the soft copy of the invitation for entry.</p>
                        
                        <div style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; font-size: 12px; color: #666;">
                            <p><strong>Venue:</strong> JJ College of Engineering and Technology (JJCET)</p>
                            <p><strong>Address:</strong> Ammapettai, Poolangulathupatti Post, Tiruchirappalli - 620009, Tamil Nadu.</p>
                            <p>For any queries, contact our organizing team.</p>
                        </div>
                    </div>
                `
            };
            await transporter.sendMail(mailOptions);
        } catch (mailErr) {
            console.error("Email failed to send:", mailErr);
            // Don't fail the whole registration if email fails
        }

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
        if ((username === "admin2k26" && password === "admin@2k26") || (username === "admin" && password === "admin123")) {
            return res.json({ success: true, token: "admin-token", role: "ALL" });
        }

        // Handler check: [EventName]@2026 / [EventName]@2026
        const lowerUser = username.toLowerCase();
        if (lowerUser.endsWith("@2026") && username === password) {
            let eventName = username.split("@")[0];
            let role = eventName;

            // Map common abbreviations to exact Event Names
            if (eventName.toLowerCase() === 'efootball' || eventName.toLowerCase() === 'e-football' || eventName.toLowerCase() === 'e-football (pes)') {
                role = 'E-Football (PES)';
            } else if (eventName.toLowerCase() === 'freefire' || eventName.toLowerCase() === 'free fire') {
                role = 'Free Fire';
            } else if (eventName.toLowerCase() === 'idea') {
                role = 'Idea Presentation';
            }

            return res.json({ success: true, token: "handler-token", role: role });
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
        const registrations = await (Registration as any).find(query).sort({ createdAt: -1 });
        res.json(registrations);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch registrations" });
    }
});

app.delete("/api/admin/registrations/:id", async (req: Request, res: Response) => {
    try {
        await connectToDatabase();
        const { id } = req.params;
        const { role } = req.query;

        console.log(`Deleting from registration ${id} with role ${role}`);

        if (role && role !== "ALL") {
            // Remove just that specific event from the array
            const registration = await (Registration as any).findById(id);
            if (registration) {
                registration.events = registration.events.filter((e: string) => e !== role);
                if (registration.events.length === 0) {
                    await (Registration as any).findByIdAndDelete(id);
                } else {
                    await registration.save();
                }
            }
        } else {
            // Super admin deletes the whole document
            await (Registration as any).findByIdAndDelete(id);
        }
        res.json({ success: true });
    } catch (error) {
        console.error("Delete error", error);
        res.status(500).json({ error: "Failed to delete" });
    }
});

export default app;
