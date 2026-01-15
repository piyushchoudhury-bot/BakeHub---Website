# 🍰 BakeHub - Homemade Dessert Marketplace

A modern, full-stack web application connecting local home bakers with dessert lovers. Built with vanilla JavaScript, Express.js, and MySQL.

![BakeHub](https://img.shields.io/badge/Version-1.0.0-pink)
![License](https://img.shields.io/badge/License-ISC-blue)
![Node](https://img.shields.io/badge/Node-18+-green)

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Usage Guide](#usage-guide)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### Customer Features
- 🏠 **Browse Desserts**: View all available homemade desserts with images and prices
- 🛒 **Shopping Cart**: Add items to cart with quantity management
- 📦 **Order Placement**: Quick order system with customer details
- 📱 **Responsive Design**: Fully responsive across all devices
- 🎨 **Modern UI**: Beautiful gradient design with smooth animations

### Admin Features
- ➕ **Add Desserts**: Add new desserts with name, price, and image URL
- 🗑️ **Delete Desserts**: Remove desserts from inventory
- 🚚 **Mark as Delivered**: Update dessert delivery status
- 📊 **Dashboard Stats**: Real-time statistics (Total, Available, Delivered)
- 📋 **Manage Orders**: View and manage customer orders

### Additional Features
- 💬 **Contact Form**: Customer inquiry submission with database storage
- ℹ️ **About Page**: Company story, values, and team information
- 🔔 **Toast Notifications**: User-friendly success/error messages
- 🎯 **Status Badges**: Visual indicators for dessert availability
- ⚡ **Fast Performance**: Optimized loading and smooth interactions

## 🛠️ Tech Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with gradients, flexbox, and grid
- **JavaScript (ES6+)** - Vanilla JS for dynamic functionality
- **Google Fonts** - Poppins & Playfair Display typography

### Backend
- **Node.js** - Runtime environment
- **Express.js 5.2.1** - Web framework
- **MySQL2 3.16.0** - Database driver
- **Body-Parser 2.2.2** - Request body parsing
- **CORS 2.8.5** - Cross-origin resource sharing

### Database
- **MySQL** - Relational database management

## 📦 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MySQL** (v8 or higher) - [Download](https://dev.mysql.com/downloads/)
- **npm** (comes with Node.js)

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/bakehub.git
cd bakehub
```

### 2. Install Dependencies
```bash
npm install
```

This will install:
- express
- mysql2
- body-parser
- cors

### 3. Configure Database Connection
Open `server.js` and update the MySQL credentials:

```javascript
const db = mysql.createConnection({
    host: "localhost",
    user: "root",              // Your MySQL username
    password: "YOUR_PASSWORD", // Your MySQL password
    database: "bakehub"
});
```

## 🗄️ Database Setup

### Method 1: Automatic Setup (Recommended)
The application will automatically create tables when you start the server. Just make sure MySQL is running and the database exists.

### Method 2: Manual Setup
Run these SQL commands in MySQL:

```sql
-- Create database
CREATE DATABASE IF NOT EXISTS bakehub;
USE bakehub;

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Desserts table
CREATE TABLE IF NOT EXISTS desserts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    image_url TEXT NOT NULL,
    status ENUM('available', 'sold-out', 'delivered') DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dessert_id INT NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    status ENUM('pending', 'processing', 'delivered') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (dessert_id) REFERENCES desserts(id) ON DELETE CASCADE
);
```

## ▶️ Running the Application

### 1. Start MySQL Service
Make sure MySQL is running on your system.

**Windows:**
```bash
net start MySQL80
```

**Mac/Linux:**
```bash
sudo systemctl start mysql
```

### 2. Start the Server
```bash
npm start
```

Or using node directly:
```bash
node server.js
```

### 3. Access the Application
Open your browser and navigate to:
```
http://localhost:3000
```

You should see:
```
✅ Connected to MySQL Database
✅ contact_messages table ready
✅ desserts table ready
✅ orders table ready
🚀 Server running at http://localhost:3000
📁 Serving static files from [your directory]
🍰 BakeHub API is ready!
```

## 📁 Project Structure

```
bakehub/
│
├── css/
│   └── style.css          # Legacy stylesheet (now embedded)
│
├── js/
│   ├── script.js          # Main JavaScript file
│   └── cart.js            # Cart functionality
│
├── images/                # Image assets
│
├── index.html             # Homepage
├── about.html             # About page
├── contact.html           # Contact page
├── admin.html             # Admin dashboard
├── cart.html              # Shopping cart page
│
├── server.js              # Express server & API
├── package.json           # Project dependencies
├── package-lock.json      # Dependency lock file
│
└── README.md              # This file
```

## 🔌 API Endpoints

### Desserts
- `GET /desserts` - Get all desserts
- `POST /desserts` - Add new dessert (requires: name, price, image_url)
- `PUT /desserts/:id/deliver` - Mark dessert as delivered
- `DELETE /desserts/:id` - Delete dessert

### Orders
- `GET /orders` - Get all orders
- `POST /orders` - Create new order (requires: dessert_id, customer_name, customer_email, quantity)
- `PUT /orders/:id/status` - Update order status

### Contact
- `POST /contact` - Submit contact form (requires: name, email, message)

### Example API Calls

**Add Dessert:**
```javascript
fetch('http://localhost:3000/desserts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        name: 'Chocolate Cake',
        price: 499,
        image_url: 'https://example.com/cake.jpg'
    })
});
```

**Place Order:**
```javascript
fetch('http://localhost:3000/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        dessert_id: 1,
        customer_name: 'John Doe',
        customer_email: 'john@example.com',
        quantity: 2
    })
});
```

## 📖 Usage Guide

### For Customers

1. **Browse Desserts**
   - Visit the homepage to see all available desserts
   - View prices, images, and availability status

2. **Add to Cart**
   - Click "🛒 Add to Cart" on any available dessert
   - Items are saved in your browser's localStorage

3. **View Cart**
   - Click "Cart" in the navigation
   - Adjust quantities or remove items
   - See total price calculation

4. **Checkout**
   - Click "Proceed to Checkout"
   - Enter your name and email
   - Orders are submitted to the database

5. **Contact Us**
   - Use the contact form for inquiries
   - Messages are saved and viewable by admins

### For Admins

1. **Access Admin Dashboard**
   - Click "Admin" in the navigation
   - View real-time statistics

2. **Add New Desserts**
   - Fill in dessert name, price, and image URL
   - Click "Add Dessert"
   - Toast notification confirms success

3. **Manage Desserts**
   - View all desserts in the table
   - Mark items as delivered
   - Delete items when needed

4. **View Orders**
   - Access order history with customer details
   - Track quantities and status

## 🎨 Design Features

### CSS Techniques Used
- **Flexbox** - Navigation and card layouts
- **CSS Grid** - Dessert gallery and admin dashboard
- **Linear Gradients** - Modern color transitions
- **Animations** - Smooth hover effects and transitions
- **Backdrop Filter** - Glassmorphism on navbar
- **Box Shadows** - Depth and elevation
- **Media Queries** - Mobile responsiveness

### Typography
- **Playfair Display** - Elegant serif for headings
- **Poppins** - Clean sans-serif for body text

### Color Palette
- Primary Pink: `#ff6b9d`
- Secondary Purple: `#c86dd7`
- Background Cream: `#fff8f0`
- Background Pink: `#ffe8e8`
- Text Dark: `#333`
- Text Light: `#666`

## 🐛 Troubleshooting

### Common Issues

**1. Server won't start:**
```
Error: connect ECONNREFUSED
```
**Solution:** Make sure MySQL is running and credentials are correct in `server.js`

**2. Port already in use:**
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Solution:** Change PORT in `server.js` or kill the process using port 3000

**3. Cart items not saving:**
- Check if browser allows localStorage
- Clear browser cache and try again

**4. Images not loading:**
- Verify image URLs are accessible
- Check for CORS issues with external images

## 🔐 Security Notes

⚠️ **Important for Production:**
- Change default MySQL password
- Add environment variables for sensitive data
- Implement authentication for admin routes
- Add input sanitization
- Use prepared statements (already implemented)
- Add rate limiting
- Implement HTTPS

## 🚀 Future Enhancements

Potential features to add:
- [ ] User authentication & login
- [ ] Payment gateway integration
- [ ] Email notifications
- [ ] Image upload functionality
- [ ] Search and filter desserts
- [ ] Customer reviews and ratings
- [ ] Order tracking system
- [ ] Admin analytics dashboard
- [ ] Social media integration
- [ ] Multi-language support

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**BakeHub Team**
- Website: [Artist Village, Maharashtra, India](https://bakehub.com)
- Email: hello@bakehub.com

## 🙏 Acknowledgments

- Google Fonts for beautiful typography
- Express.js community for excellent documentation
- All the amazing home bakers who inspired this project

---

Made with ❤️ for dessert lovers everywhere

**Happy Baking! 🍰**
