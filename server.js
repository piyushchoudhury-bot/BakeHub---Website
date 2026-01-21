// ============================
// BakeHub PostgreSQL Server.js
// ============================

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// PostgreSQL Connection
const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT || 5432,
  ssl: { rejectUnauthorized: false }
});

// Test DB Connection
pool.connect()
  .then(() => console.log("✅ Connected to PostgreSQL Database"))
  .catch(err => console.error("❌ Database connection failed:", err.message));

// ==================== CONTACT API ====================
app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "❌ All fields are required!" });
  }

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id SERIAL PRIMARY KEY,
        name TEXT,
        email TEXT,
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(
      "INSERT INTO contact_messages (name, email, message) VALUES ($1, $2, $3)",
      [name, email, message]
    );

    res.json({ message: "✅ Message received!" });
  } catch (err) {
    console.error("❌ Error saving message:", err.message);
    res.status(500).json({ message: "❌ Server error." });
  }
});

// ==================== DESSERTS API ====================
app.get("/desserts", async (req, res) => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS desserts (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        price NUMERIC(10,2) NOT NULL,
        image_url TEXT NOT NULL,
        status TEXT DEFAULT 'available',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    const { rows } = await pool.query("SELECT * FROM desserts ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching desserts:", err.message);
    res.status(500).json({ message: "Error fetching desserts" });
  }
});

app.post("/desserts", async (req, res) => {
  const { name, price, image_url } = req.body;

  if (!name || !price || !image_url) {
    return res.status(400).json({ message: "❌ All fields are required!" });
  }

  try {
    await pool.query(
      "INSERT INTO desserts (name, price, image_url) VALUES ($1, $2, $3)",
      [name, price, image_url]
    );
    res.json({ message: "🍰 Dessert added successfully!" });
  } catch (err) {
    console.error("❌ Error adding dessert:", err.message);
    res.status(500).json({ message: "Error adding dessert" });
  }
});

// ==================== ORDERS API ====================
app.post("/orders", async (req, res) => {
  const { dessert_id, customer_name, customer_email, quantity } = req.body;

  if (!dessert_id || !customer_name || !customer_email || !quantity) {
    return res.status(400).json({ message: "❌ Missing required fields." });
  }

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        dessert_id INT NOT NULL,
        customer_name TEXT NOT NULL,
        customer_email TEXT NOT NULL,
        quantity INT DEFAULT 1,
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(
      "INSERT INTO orders (dessert_id, customer_name, customer_email, quantity) VALUES ($1, $2, $3, $4)",
      [dessert_id, customer_name, customer_email, quantity]
    );

    res.json({ message: "✅ Order placed successfully!" });
  } catch (err) {
    console.error("❌ Error saving order:", err.message);
    res.status(500).json({ message: "Error saving order" });
  }
});

// ==================== SERVER START ====================
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


