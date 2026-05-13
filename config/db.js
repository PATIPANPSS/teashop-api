const mysql = require("mysql2");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "patipan110544",
  database: "teashop",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

console.log("Connected to MySQL (Pool) via config/db.js");

module.exports = db;
