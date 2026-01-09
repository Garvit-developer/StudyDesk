const db = require("../config/db.js");

const initUserTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      profile_pic VARCHAR(500),
      mobile VARCHAR(255) DEFAULT NULL,
      address VARCHAR(500) DEFAULT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      otp VARCHAR(10) ,
      expires_at DATETIME ,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await db.query(query);
    console.log("Users table created or already exists.");
  } catch (err) {
    console.error("Error creating users table:", err.message);
  }
};

const findUserByEmail = async (email) => {
  const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0];
};

const findUserById = async (id) => {
  const sql = "SELECT * FROM users WHERE id = ?";
  const [rows] = await db.execute(sql, [id]);
  return rows[0];
};

const createUser = async (name, email, password) => {
  const [result] = await db.query(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, password]
  );
  return result.insertId;
};

const updateProfilePicPath = async (userId, newPath) => {
  const sql = "UPDATE users SET profile_pic = ? WHERE id = ?";
  const [result] = await db.execute(sql, [newPath, userId]);
  return result;
};

const updateUserProfile = async (userId, fields) => {
  const sql = `UPDATE users SET name = ?, email = ?, address = ?, mobile = ? WHERE id = ?`;
  const values = [
    fields.name,
    fields.email,
    fields.address,
    fields.mobile,
    userId,
  ];
  const [result] = await db.execute(sql, values);
  return result;
};

const updateOTP = async (id, otp, expiry) => {
    try {
      await db.query(
        "UPDATE users SET otp = ? , expires_at = ? WHERE id = ?",
        [otp, expiry, id]
      );
    } catch (err) {
      throw err;
    }  
  }


  const clearOTP = async (id) => {
    try {
      await db.query(
        "UPDATE users SET otp = NULL, expires_at = NULL WHERE id = ?",
        [id]
      );
    } catch (err) {
      throw err;
    }
  }

// Update password
  const updatePassword = async (id, hashedPassword) => {
    try {
      await db.query(
        "UPDATE users SET password = ? WHERE id = ?",
        [hashedPassword, id]
      );
    } catch (err) {
      throw err;
    }
  }

module.exports = {
  initUserTable,
  findUserByEmail,
  createUser,
  updateProfilePicPath,
  findUserById,
  updateUserProfile,
  updateOTP,
  clearOTP,
  updatePassword
};
