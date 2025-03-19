const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database(":memory:", (err) => {
  if (err) {
    console.error("Error connecting to in-memory database:", err);
  } else {
    console.log("Connected to in-memory database");

    db.run(
      `CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE,
            password TEXT,
            role TEXT,
            name TEXT
        )`,
      (err) => {
        if (err) {
          console.error("Error creating users table:", err);
        } else {
          console.log("Users table created successfully");
        }
      }
    );

    db.run(
      `CREATE TABLE IF NOT EXISTS active_jobs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            job_title TEXT,
            company_name TEXT,
            location TEXT,
            job_type TEXT,
            salary_range TEXT,
            posted_date TEXT,
            deadline TEXT,
            image TEXT,
            description_intro TEXT,
            bid_amount TEXT,
            applicant_name TEXT,
            applicant_email TEXT,
            applicant_phone TEXT,
            applicant_message TEXT,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )`,
      (err) => {
        if (err) {
          console.error("Error creating active_jobs table:", err);
        } else {
          console.log("Active_jobs table created successfully");
        }
      }
    );
  }
});

module.exports = db;
