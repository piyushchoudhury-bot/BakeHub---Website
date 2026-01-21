// =====================
// BakeHub Cart Script 🛒
// =====================

let cart = JSON.parse(localStorage.getItem("cart")) || [];
const cartContainer = document.getElementById("cartItems");
const cartSummary = document.getElementById("cartSummary");
const checkoutBtn = document.getElementById("checkoutBtn");

function renderCart() {
  cartContainer.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartContainer.innerHTML = `<p class="empty-cart">Your cart is empty 😔</p>`;
    cartSummary.innerHTML = "";
    checkoutBtn.style.display = "none";
    return;
  }

  checkoutBtn.style.display = "block";

  cart.forEach((item, index) => {
    total += item.price * item.quantity;

    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <img src="${item.image_url}" alt="${item.name}">
      <div class="cart-details">
        <h3>${item.name}</h3>
        <p>₹${item.price}</p>
        <label>Qty:</label>
        <input type="number" class="quantity-input" value="${item.quantity}" min="1" onchange="updateQuantity(${index}, this.value)">
      </div>
      <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
    `;

    cartContainer.appendChild(div);
  });

  cartSummary.innerHTML = `<p>Total: ₹${total.toFixed(2)}</p>`;
}

function updateQuantity(index, value) {
  cart[index].quantity = parseInt(value);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function removeItem(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

async function checkout() {
  for (const item of cart) {
    const orderData = {
      dessert_id: item.id,
      customer_name: prompt("Enter your name:"),
      customer_email: prompt("Enter your email:"),
      quantity: item.quantity
    };

    if (!orderData.customer_name || !orderData.customer_email) {
      alert("⚠️ Name and email are required to place an order!");
      return;
    }

    try {
      const res = await fetch("https://bakehub-backend.onrender.com/orders", {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
      });

      const result = await res.json();
      alert(result.message);
    } catch (error) {
      console.error("❌ Error placing order:", error);
      alert("❌ Failed to place order. Try again later.");
    }
  }

  localStorage.removeItem("cart");
  renderCart();
}

checkoutBtn.addEventListener("click", checkout);
renderCart();

