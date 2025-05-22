const db = require('../config/db'); // Assuming your DB config is here

class ScheduleEvaluation {
  static async createSchedule(email, dateTime) {
    const sql = `
      INSERT INTO user (user_email, scheduled_datetime, status, created_at) 
      VALUES (?, ?, 'scheduled', NOW())
    `;
    const [result] = await db.execute(sql, [email, dateTime]);
    return result;
  }

  static async getByEmail(email) {
    const sql = `SELECT * FROM user WHERE user_email = ? ORDER BY scheduled_datetime DESC LIMIT 1`;
    const [rows] = await db.execute(sql, [email]);
    return rows[0];
  }
}

module.exports = ScheduleEvaluation;