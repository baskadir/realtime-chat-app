const pool = require("./index");

const initializeDatabase = async () => {
  try {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(28) UNIQUE NOT NULL,
          passwordhash VARCHAR(255) NOT NULL,
          userid UUID NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);
    console.log("Database initialization completed");
  } catch (err) {
    console.error("Error initializing database:", err);
    throw err;
  }
};

module.exports = { initializeDatabase };
