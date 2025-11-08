console.log("JS Loaded!");


const API = "http://localhost:5000/api"; // backend URL

async function loadProducts() {
  try {
    const res = await fetch(`${API}/products`);
    const products = await res.json();
    const productList = document.getElementById("productList");

    if (!products.length) {
      productList.innerHTML = "<p>No products found 🛒</p>";
      return;
    }

  productList.innerHTML = products.map(p => `
  <div class="col-md-3 col-sm-6">
    <div class="card h-100 shadow-sm border-0">
      <img src="${p.image}" class="card-img-top rounded-top" alt="${p.name}">
      <div class="card-body d-flex flex-column">
        <h5 class="fw-bold text-dark">${p.name}</h5>
        <p class="text-muted small flex-grow-1">${p.description}</p>
        <div class="d-flex justify-content-between align-items-center mt-2">
          <span class="fw-semibold text-success fs-6">₹${p.price}</span>
          <button class="btn btn-sm btn-primary" onclick="addToCart('${p._id}', '${p.name}', ${p.price})">
            <i class="bi bi-cart-plus"></i> Add
          </button>
        </div>
      </div>
    </div>
  </div>
`).join('');


  } catch (err) {
    console.error("Error loading products:", err);
    document.getElementById("productList").innerHTML = "<p>⚠️ Unable to load products</p>";
  }
}

function addToCart(id, name, price) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, name, price, qty: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("✅ Added to cart!");
}


// ================== CART FUNCTIONS ==================

// Load cart items and show them on the cart page
function loadCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartContainer = document.getElementById("cartItems");
  const totalContainer = document.getElementById("total");

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty 🛍️</p>";
    totalContainer.textContent = "";
    return;
  }

  let total = 0;
  cartContainer.innerHTML = cart.map((item, i) => {
    total += item.price * item.qty;
    return `
      <div class="card">
        <h3>${item.name}</h3>
        <p>₹${item.price} × ${item.qty}</p>
        <button class="btn" onclick="removeItem(${i})">Remove</button>
      </div>
    `;
  }).join("");

  totalContainer.textContent = `Total: ₹${total}`;
}

// Remove an item from the cart
function removeItem(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

// Clear all items
function clearCart() {
  localStorage.removeItem("cart");
  loadCart();
  alert("🧹 Cart cleared!");
}


// ================== PLACE ORDER ==================
async function placeOrder() {
  const token = localStorage.getItem("token");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (!token) {
    alert("Please login first before placing an order.");
    window.location.href = "login.html";
    return;
  }

  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  try {
    const res = await fetch(`${API}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ items: cart, total })
    });

    const data = await res.json();
    alert(data.message || "Order placed!");
    localStorage.removeItem("cart");
    window.location.href = "index.html";
  } catch (err) {
    console.error(err);
    alert("Something went wrong while placing the order.");
  }
}
