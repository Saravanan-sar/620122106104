const express = require("express");
const router = express.Router();
const db = require("../db");
const { nanoid } = require("nanoid");

// POST - create short url
router.post("/shorten", (req, res) => {
  const { long_url } = req.body;
  const short_code = nanoid(6);

  const sql = "INSERT INTO urls (long_url, short_code) VALUES (?, ?)";
  db.query(sql, [long_url, short_code], (err) => {
    if (err) return res.status(500).json({ error: "DB Error" });

    res.json({ short_url: `http://localhost:5000/${short_code}` });
  });
});

// GET - resolve short url
router.get("/:shortCode", (req, res) => {
  const { shortCode } = req.params;

  const sql = "SELECT long_url FROM urls WHERE short_code = ?";
  db.query(sql, [shortCode], (err, results) => {
    if (err || results.length === 0)
      return res.status(404).json({ error: "URL not found" });

    res.redirect(results[0].long_url);
  });
});

module.exports = router;
