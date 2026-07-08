// =============================================================================
// DAY 17 — LESSON 5: File Uploads & Email
// =============================================================================
// Run: npx tsx lessons/05-uploads-and-email.ts
// Install: npm install express multer nodemailer
// =============================================================================

import express from "express";
import multer from "multer";
import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";

const app = express();
const UPLOAD_DIR = path.join(process.cwd(), "uploads");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// =============================================================================
// SECTION 1: multer — multipart/form-data file uploads
// =============================================================================

const storage = multer.diskStorage({
  destination(_req, _file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename(_req, file, cb) {
    const unique = `${Date.now()}-${file.originalname}`;
    cb(null, unique);
  },
});

function fileFilter(
  _req: express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) {
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, WEBP allowed"));
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB max
});

app.post("/api/upload", upload.single("avatar"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res.status(201).json({
    filename: req.file.filename,
    size: req.file.size,
    mimetype: req.file.mimetype,
  });
});

// Production note: store in S3/R2/Cloudinary, not local disk (ephemeral containers)

// =============================================================================
// SECTION 2: nodemailer — send email (dev: Ethereal fake SMTP)
// =============================================================================

async function createTransporter() {
  // Dev: create test account at https://ethereal.email
  // Prod: use SendGrid, AWS SES, Resend — via env vars
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Fallback: log email to console in dev
  return nodemailer.createTransport({ jsonTransport: true });
}

async function sendWelcomeEmail(to: string, username: string) {
  const transporter = await createTransporter();

  const info = await transporter.sendMail({
    from: '"TrackStack" <noreply@trackstack.dev>',
    to,
    subject: "Welcome to TrackStack!",
    text: `Hi ${username}, thanks for registering.`,
    html: `<p>Hi <strong>${username}</strong>, thanks for registering.</p>`,
  });

  console.log("Email sent:", info.messageId || info);
  return info;
}

app.post("/api/register", express.json(), async (req, res) => {
  const { email, username } = req.body;
  if (!email || !username) {
    return res.status(400).json({ error: "email and username required" });
  }

  // ... save user to DB first in real app

  await sendWelcomeEmail(email, username);
  res.status(201).json({ message: "Registered — check email" });
});

// =============================================================================
// SECTION 3: Cron jobs concept (node-cron)
// =============================================================================
// import cron from "node-cron";
// cron.schedule("0 9 * * *", () => sendDailyDigest());  // 9 AM daily

// =============================================================================
// INTERVIEW Q&A
// =============================================================================
// Q: Why validate file type and size?
// A: Prevent malware uploads and disk exhaustion — never trust client mime type alone.
//
// Q: Why not store uploads on container filesystem?
// A: Containers are ephemeral — use object storage (S3) with CDN in production.
//
// Q: How handle email in dev vs prod?
// A: Dev: Ethereal or jsonTransport (console). Prod: transactional email service + env secrets.

const PORT = 3097;
app.listen(PORT, () => console.log(`Uploads/email demo on http://localhost:${PORT}`));
