// // Import modules
// const express = require("express");
// const bodyParser = require("body-parser");
// const mysql = require("mysql2");
// const cors = require("cors");

// // Initialize app
// const app = express();
// app.use(cors());
// app.use(bodyParser.json());

// // Database connection
// const db = mysql.createConnection({
//     host: "localhost",
//     user: "root",              // your MySQL username
//     password: "PRC26122005", // <-- replace with your actual MySQL root password
//     database: "bakehub"
// });

// db.connect(err => {
//     if (err) {
//         console.error("❌ Database connection failed:", err);
//         return;
//     }
//     console.log("✅ Connected to MySQL Database");
// });

// // Contact form endpoint
// app.post("/contact", (req, res) => {
//     const { name, email, message } = req.body;

//     if (!name || !email || !message) {
//         return res.status(400).json({ message: "All fields are required!" });
//     }

//     const sql = "INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)";
//     db.query(sql, [name, email, message], (err, result) => {
//         if (err) {
//             console.error("❌ Error saving message:", err);
//             return res.status(500).json({ message: "Error saving message" });
//         }
//         console.log("💾 New contact form entry saved.");
//         res.json({ message: "✅ Message received! We'll get back to you soon." });
//     });
// });

// // Start server
// app.listen(3000, () => {
//     console.log("🚀 Server running at http://localhost:3000");
// });

const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// Database connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "PRC26122005", // Replace with your MySQL password
    database: "bakehub"
});

// Connect to database
db.connect(err => {
    if (err) {
        console.error("❌ Database connection failed:", err.message);
        console.error("Make sure MySQL is running and the database 'bakehub' exists");
        process.exit(1);
    }
    console.log("✅ Connected to MySQL Database");
    
    // Create tables if they don't exist
    createTables();
});

// Create necessary tables
function createTables() {
    const createContactTable = `
        CREATE TABLE IF NOT EXISTS contact_messages (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            message TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;
    
    const createDessertsTable = `
        CREATE TABLE IF NOT EXISTS desserts (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            price DECIMAL(10, 2) NOT NULL,
            image_url TEXT NOT NULL,
            status ENUM('available', 'sold-out', 'delivered') DEFAULT 'available',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;
    
    const createOrdersTable = `
        CREATE TABLE IF NOT EXISTS orders (
            id INT AUTO_INCREMENT PRIMARY KEY,
            dessert_id INT NOT NULL,
            customer_name VARCHAR(255) NOT NULL,
            customer_email VARCHAR(255) NOT NULL,
            quantity INT NOT NULL DEFAULT 1,
            status ENUM('pending', 'processing', 'delivered') DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (dessert_id) REFERENCES desserts(id) ON DELETE CASCADE
        )
    `;
    
    db.query(createContactTable, (err) => {
        if (err) console.error("Error creating contact_messages table:", err);
        else console.log("✅ contact_messages table ready");
    });
    
    db.query(createDessertsTable, (err) => {
        if (err) console.error("Error creating desserts table:", err);
        else console.log("✅ desserts table ready");
    });
    
    db.query(createOrdersTable, (err) => {
        if (err) console.error("Error creating orders table:", err);
        else console.log("✅ orders table ready");
    });
}

// ==================== CONTACT API ====================
app.post("/contact", (req, res) => {
    const { name, email, message } = req.body;
    
    // Validation
    if (!name || !email || !message) {
        return res.status(400).json({ 
            message: "❌ All fields are required!" 
        });
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ 
            message: "❌ Invalid email format!" 
        });
    }
    
    const sql = "INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)";
    
    db.query(sql, [name.trim(), email.trim(), message.trim()], (err, result) => {
        if (err) {
            console.error("❌ Error saving message:", err);
            return res.status(500).json({ 
                message: "❌ Error saving message. Please try again." 
            });
        }
        console.log(`💾 New contact form entry saved (ID: ${result.insertId})`);
        res.json({ 
            message: "✅ Thank you! We'll contact you soon." 
        });
    });
});

// ==================== DESSERTS API ====================

// Get all desserts
app.get("/desserts", (req, res) => {
    const sql = "SELECT * FROM desserts ORDER BY created_at DESC";
    
    db.query(sql, (err, results) => {
        if (err) {
            console.error("❌ Error fetching desserts:", err);
            return res.status(500).json({ 
                message: "Error fetching desserts" 
            });
        }
        res.json(results);
    });
});

// Add a new dessert
app.post("/desserts", (req, res) => {
    const { name, price, image_url } = req.body;
    
    // Validation
    if (!name || !price || !image_url) {
        return res.status(400).json({ 
            message: "❌ All fields are required!" 
        });
    }
    
    if (isNaN(price) || parseFloat(price) <= 0) {
        return res.status(400).json({ 
            message: "❌ Invalid price!" 
        });
    }
    
    const sql = "INSERT INTO desserts (name, price, image_url) VALUES (?, ?, ?)";
    
    db.query(sql, [name.trim(), parseFloat(price), image_url.trim()], (err, result) => {
        if (err) {
            console.error("❌ Error adding dessert:", err);
            return res.status(500).json({ 
                message: "❌ Error adding dessert" 
            });
        }
        console.log(`🍰 New dessert added (ID: ${result.insertId}): ${name}`);
        res.json({ 
            message: "🍰 Dessert added successfully!" 
        });
    });
});

// Update dessert status to delivered
app.put("/desserts/:id/deliver", (req, res) => {
    const dessertId = parseInt(req.params.id);
    
    if (isNaN(dessertId)) {
        return res.status(400).json({ 
            message: "❌ Invalid dessert ID" 
        });
    }
    
    const sql = "UPDATE desserts SET status='delivered' WHERE id=?";
    
    db.query(sql, [dessertId], (err, result) => {
        if (err) {
            console.error("❌ Error updating status:", err);
            return res.status(500).json({ 
                message: "❌ Error updating status" 
            });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                message: "❌ Dessert not found" 
            });
        }
        
        console.log(`🚚 Dessert ${dessertId} marked as delivered`);
        res.json({ 
            message: "🚚 Dessert marked as delivered!" 
        });
    });
});

// Delete a dessert (optional)
app.delete("/desserts/:id", (req, res) => {
    const dessertId = parseInt(req.params.id);
    
    if (isNaN(dessertId)) {
        return res.status(400).json({ 
            message: "❌ Invalid dessert ID" 
        });
    }
    
    const sql = "DELETE FROM desserts WHERE id=?";
    
    db.query(sql, [dessertId], (err, result) => {
        if (err) {
            console.error("❌ Error deleting dessert:", err);
            return res.status(500).json({ 
                message: "❌ Error deleting dessert" 
            });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                message: "❌ Dessert not found" 
            });
        }
        
        console.log(`🗑️ Dessert ${dessertId} deleted`);
        res.json({ 
            message: "🗑️ Dessert deleted successfully!" 
        });
    });
});

// ==================== ORDERS API ====================

// Create a new order
app.post("/orders", (req, res) => {
    const { dessert_id, customer_name, customer_email, quantity } = req.body;
    
    // Validation
    if (!dessert_id || !customer_name || !customer_email || !quantity) {
        return res.status(400).json({ 
            message: "❌ All fields are required!" 
        });
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customer_email)) {
        return res.status(400).json({ 
            message: "❌ Invalid email format!" 
        });
    }
    
    if (isNaN(quantity) || parseInt(quantity) <= 0) {
        return res.status(400).json({ 
            message: "❌ Invalid quantity!" 
        });
    }
    
    const sql = "INSERT INTO orders (dessert_id, customer_name, customer_email, quantity) VALUES (?, ?, ?, ?)";
    
    db.query(sql, [
        parseInt(dessert_id), 
        customer_name.trim(), 
        customer_email.trim(), 
        parseInt(quantity)
    ], (err, result) => {
        if (err) {
            console.error("❌ Error placing order:", err);
            return res.status(500).json({ 
                message: "❌ Error placing order" 
            });
        }
        console.log(`🧁 New order placed (ID: ${result.insertId}) by ${customer_name}`);
        res.json({ 
            message: "🧁 Order placed successfully! We'll contact you soon." 
        });
    });
});

// Get all orders
app.get("/orders", (req, res) => {
    const sql = `
        SELECT 
            o.id, 
            d.name AS dessert_name, 
            o.customer_name, 
            o.customer_email,
            o.quantity,
            o.status, 
            o.created_at
        FROM orders o
        JOIN desserts d ON o.dessert_id = d.id
        ORDER BY o.created_at DESC
    `;
    
    db.query(sql, (err, results) => {
        if (err) {
            console.error("❌ Error fetching orders:", err);
            return res.status(500).json({ 
                message: "Error fetching orders" 
            });
        }
        res.json(results);
    });
});

// Update order status
app.put("/orders/:id/status", (req, res) => {
    const orderId = parseInt(req.params.id);
    const { status } = req.body;
    
    if (isNaN(orderId)) {
        return res.status(400).json({ 
            message: "❌ Invalid order ID" 
        });
    }
    
    const validStatuses = ['pending', 'processing', 'delivered'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ 
            message: "❌ Invalid status" 
        });
    }
    
    const sql = "UPDATE orders SET status=? WHERE id=?";
    
    db.query(sql, [status, orderId], (err, result) => {
        if (err) {
            console.error("❌ Error updating order status:", err);
            return res.status(500).json({ 
                message: "❌ Error updating order status" 
            });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                message: "❌ Order not found" 
            });
        }
        
        console.log(`📦 Order ${orderId} status updated to ${status}`);
        res.json({ 
            message: `📦 Order status updated to ${status}!` 
        });
    });
});

// ==================== ERROR HANDLING ====================
app.use((req, res) => {
    res.status(404).json({ 
        message: "❌ Route not found" 
    });
});

app.use((err, req, res, next) => {
    console.error("❌ Server error:", err);
    res.status(500).json({ 
        message: "❌ Internal server error" 
    });
});

// ==================== START SERVER ====================
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📁 Serving static files from ${__dirname}`);
    console.log(`🍰 BakeHub API is ready!`);

});
