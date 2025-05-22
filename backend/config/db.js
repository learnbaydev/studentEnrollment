const mysql = require('mysql2/promise');
require('dotenv').config()

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  database: process.env.MYSQL_DB,
  port: process.env.MYSQL_PORT
});

// async function connectDB() {
//   try {
//     const connection = await pool.getConnection();
//     await connection.ping();
//     console.log("✅ DB connected");
//     connection.release();
//   } catch (err) {
//     console.error("❌ DB connection failed:", err);
//     process.exit(1);
//   }
// }

module.exports = pool;
