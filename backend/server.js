const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const log = require("./middleware/log"); // <-- your custom logger

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "sara2004", // your MySQL password
  database: "urlshortener"
});

db.connect((err) => {
  if (err) {
    log(err.stack, "error", "server.js", "MySQL connection failed");
    return console.error("DB connection error:", err.message);
  }
  console.log("Connected to MySQL");
  log("", "info", "server.js", "Connected to MySQL database");
});

// === Custom Logging Middleware ===
app.use(async (req, res, next) => {
  await log("", "info", "server.js", `Incoming request: ${req.method} ${req.url}`);
  next();
});

// === Routes ===

// Shorten URL
app.post("/api/shorten", async (req, res) => {
  const { url } = req.body;
  if (!url) {
    await log("", "warn", "server.js", "Missing URL in /shorten");
    return res.status(400).json({ error: "URL is required" });
  }

  const shortId = Math.random().toString(36).substring(2, 8);
  db.query("INSERT INTO urls (original, short) VALUES (?, ?)", [url, shortId], async (err) => {
    if (err) {
      await log(err.stack, "error", "server.js", "Failed to insert URL");
      return res.status(500).json({ error: "Database error" });
    }
    await log("", "info", "server.js", `Shortened URL created: ${shortId}`);
    res.json({ short: shortId });
  });
});

// Get all URLs
app.get("/api/urls", (req, res) => {
  db.query("SELECT * FROM urls", async (err, results) => {
    if (err) {
      await log(err.stack, "error", "server.js", "Failed to fetch URLs");
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

// Start server
app.listen(PORT, async () => {
  console.log(`Server running at http://localhost:${PORT}`);
  await log("", "info", "server.js", `Server started at http://localhost:${PORT}`);
});
