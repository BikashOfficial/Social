const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectToDb = require("./db/db.js");
const userRoutes = require("./routes/user.route.js");
const postRoutes = require("./routes/post.route.js");
const path = require('path');
const multer = require('multer');
const messageRoutes = require('./routes/message.route');
const fs = require('fs');

// Security headers middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",  // Local development
      "https://your-frontend-domain.onrender.com" // Add your frontend domain
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    exposedHeaders: ["set-cookie"],
  })
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
connectToDb();

// Add this after other middleware
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const profilesDir = path.join(__dirname, 'uploads/profiles');
if (!fs.existsSync(profilesDir)) {
    fs.mkdirSync(profilesDir, { recursive: true });
}

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Welcome to the Express Server!");
});

app.use("/user", userRoutes);
app.use("/post", postRoutes);
app.use('/api/messages', messageRoutes);

// Add this before your other error handlers
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: 'File upload error: ' + err.message
    });
  }
  next(err);
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
