const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "sara2004",
  database: "urlshortener"
});

db.connect((err) => {
  if (err) {
    console.error("MySQL Connection Failed:", err);
  } else {
    console.log("Connected to MySQL DB ");
  }
});

module.exports = db;
