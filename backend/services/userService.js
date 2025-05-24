const db = require("../config/db");

async function findUserByEmail(email) {
  console.log("Searching for user with email:", email);  

  try {
    if (!email) {
      throw new Error("No email provided!");  
    }

    // Log the database query being executed
    const query = "SELECT * FROM user WHERE email = ? AND status = 'active'";
    console.log("Executing query:", query, "with parameters:", [email]);

    const [rows] = await db.query(query, [email]);

    console.log("DB query result:", rows); 

    if (rows.length === 0) {
      console.log("No active user found with email:", email);  
      return null; 
    }

    console.log("User found:", rows[0]); 
    return rows[0];  
  } catch (error) {
    console.error("Error in findUserByEmail:", error);  
    throw new Error("Error while finding user");
  }
}

module.exports = { findUserByEmail };
