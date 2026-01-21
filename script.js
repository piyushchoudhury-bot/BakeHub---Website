// =========================
// Load Desserts on Homepage
// =========================
async function loadDesserts() {
    const response = await fetch("https://bakehub-website-1.onrender.com/desserts");

    const desserts = await response.json();

    const container = document.getElementById("dessertsContainer");
    container.innerHTML = "";

    desserts.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("dessert-card");

        div.innerHTML = `
    <img src="${item.image_url}" alt="${item.name}">
    <h3>${item.name}</h3>
    <p>₹${item.price}</p>
    <p>Status: <strong>${item.status}</strong></p>
    ${item.status === 'available' ? `<button onclick="orderDessert(${item.id}, '${item.name}')">Order Now</button>` : ''}
`;


        container.appendChild(div);
    });
}


// =========================
// Add New Dessert (Admin)
// =========================
async function addDessert(name, price, image_url) {
    const response = await fetch(`https://bakehub-backend.onrender.com/desserts/${id}/deliver`, { method: "PUT" });


        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ name, price, image_url })
    });
    const result = await response.json();
    alert(result.message);
    loadDesserts();
}

// =========================
// Mark as Delivered
// =========================
async function markDelivered(id) {
    const response = await fetch(`http://localhost:3000/desserts/${id}/deliver`, { method: "PUT" });
    const result = await response.json();
    alert(result.message);
    loadDesserts();
}

// Load desserts when homepage loads
if (document.getElementById("dessertsContainer")) {
    loadDesserts();
}

// =============================
// 🛍️ Order Dessert Function
// =============================
async function orderDessert(id, name) {
    const customer_name = prompt(`Enter your name to order ${name}:`);
    const customer_email = prompt("Enter your email:");
    const quantity = prompt("Quantity:", "1");

    if (!customer_name || !customer_email) {
        alert("⚠️ All fields are required!");
        return;
    }

    try {
        const res = await fetch("https://bakehub-backend.onrender.com/orders", {

            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ dessert_id: id, customer_name, customer_email, quantity })
        });

        const result = await res.json();
        alert(result.message);
    } catch (error) {
        console.error("Error placing order:", error);
        alert("❌ Could not place order. Please try again.");
    }
}



