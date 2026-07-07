// =============================================
// api.js - Backend se frontend connect karne ke liye
// Yeh file backend API se baat karti hai
// =============================================

const API_BASE = 'http://localhost:3000/api';

// ---- Token Helpers ----
function getToken() { return localStorage.getItem('tm_token'); }
function setToken(t) { localStorage.setItem('tm_token', t); }
function removeToken() { localStorage.removeItem('tm_token'); }
function getUser() {
  const u = localStorage.getItem('tm_user');
  return u ? JSON.parse(u) : null;
}
function setUser(u) { localStorage.setItem('tm_user', JSON.stringify(u)); }
function removeUser() { localStorage.removeItem('tm_user'); }

// ---- Generic Fetch Helper ----
async function apiFetch(url, method = 'GET', body = null, auth = false) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) headers['Authorization'] = `Bearer ${getToken()}`;

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  try {
    const res = await fetch(API_BASE + url, options);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Kuch galat ho gaya');
    return data;
  } catch (err) {
    console.error(`API Error [${url}]:`, err.message);
    throw err;
  }
}

// =============================================
// AUTH
// =============================================
async function register(name, email, password) {
  const data = await apiFetch('/auth/register', 'POST', { name, email, password });
  setToken(data.token);
  setUser(data.user);
  return data;
}

async function login(email, password) {
  const data = await apiFetch('/auth/login', 'POST', { email, password });
  setToken(data.token);
  setUser(data.user);
  return data;
}

function logout() {
  removeToken();
  removeUser();
  updateNavbar();
  alert('Aap logout ho gaye!');
  window.location.href = 'index.html';
}

async function getProfile() {
  return await apiFetch('/auth/profile', 'GET', null, true);
}

// =============================================
// PRODUCTS
// =============================================
async function getProducts(params = {}) {
  const query = new URLSearchParams(params).toString();
  return await apiFetch('/products' + (query ? '?' + query : ''));
}

async function getProduct(id) {
  return await apiFetch('/products/' + id);
}

// =============================================
// CART
// =============================================
async function getCart() {
  if (!getToken()) return null;
  return await apiFetch('/cart', 'GET', null, true);
}

async function addToCart(productId, qty = 1) {
  if (!getToken()) {
    alert('Cart mein add karne ke liye pehle login karein! 🔐');
    showAuthModal('login');
    return;
  }
  try {
    const data = await apiFetch('/cart/add', 'POST', { productId, qty }, true);
    showToast(data.message);
    updateCartCount();
    return data;
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function updateCartItem(productId, qty) {
  return await apiFetch('/cart/update', 'PUT', { productId, qty }, true);
}

async function removeFromCart(productId) {
  return await apiFetch('/cart/remove/' + productId, 'DELETE', null, true);
}

async function clearCart() {
  return await apiFetch('/cart/clear', 'DELETE', null, true);
}

// =============================================
// ORDERS
// =============================================
async function placeOrder(address, paymentMethod = 'COD') {
  return await apiFetch('/orders/place', 'POST', { address, paymentMethod }, true);
}

async function getMyOrders() {
  return await apiFetch('/orders', 'GET', null, true);
}

async function cancelOrder(orderId) {
  return await apiFetch('/orders/' + orderId + '/cancel', 'PUT', null, true);
}

// =============================================
// CONTACT
// =============================================
async function submitContact(name, email, phone, subject, message) {
  return await apiFetch('/contact', 'POST', { name, email, phone, subject, message });
}

// =============================================
// COUPON
// =============================================
async function applyCoupon(code) {
  return await apiFetch('/coupon/apply', 'POST', { code }, true);
}

async function getCoupons() {
  return await apiFetch('/coupon/list');
}

// =============================================
// UI HELPERS
// =============================================

// Toast Notification
function showToast(message, type = 'success') {
  const existing = document.getElementById('tm-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'tm-toast';
  toast.style.cssText = `
    position:fixed; bottom:20px; right:20px; z-index:9999;
    background:${type === 'error' ? '#e74c3c' : '#2ecc71'};
    color:white; padding:14px 20px; border-radius:8px;
    font-size:14px; max-width:320px; box-shadow:0 4px 12px rgba(0,0,0,0.2);
    animation: slideIn 0.3s ease;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

// Cart count badge
async function updateCartCount() {
  const badge = document.getElementById('cart-count-badge');
  if (!badge || !getToken()) return;
  try {
    const cart = await getCart();
    if (cart) {
      badge.textContent = cart.itemCount;
      badge.style.display = cart.itemCount > 0 ? 'flex' : 'none';
    }
  } catch (e) {}
}

// Navbar: login/logout button
function updateNavbar() {
  const user = getUser();
  const loginLink = document.getElementById('nav-login-link');
  const userGreet = document.getElementById('nav-user-greet');
  const logoutBtn = document.getElementById('nav-logout-btn');

  if (loginLink) loginLink.style.display = user ? 'none' : '';
  if (userGreet) {
    userGreet.textContent = user ? `Hi, ${user.name.split(' ')[0]}!` : '';
    userGreet.style.display = user ? '' : 'none';
  }
  if (logoutBtn) logoutBtn.style.display = user ? '' : 'none';
}

// Auth Modal
function showAuthModal(tab = 'login') {
  const existing = document.getElementById('tm-auth-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'tm-auth-modal';
  modal.innerHTML = `
    <div style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:10000;display:flex;align-items:center;justify-content:center;">
      <div style="background:#fff;border-radius:12px;padding:32px;width:360px;max-width:90vw;position:relative;">
        <button onclick="document.getElementById('tm-auth-modal').remove()" style="position:absolute;top:12px;right:16px;background:none;border:none;font-size:22px;cursor:pointer;">×</button>
        <div style="display:flex;gap:16px;margin-bottom:24px;">
          <button id="tab-login" onclick="switchTab('login')" style="flex:1;padding:10px;border:2px solid #088178;border-radius:6px;font-weight:bold;cursor:pointer;background:${tab==='login'?'#088178':'#fff'};color:${tab==='login'?'#fff':'#088178'}">Login</button>
          <button id="tab-register" onclick="switchTab('register')" style="flex:1;padding:10px;border:2px solid #088178;border-radius:6px;font-weight:bold;cursor:pointer;background:${tab==='register'?'#088178':'#fff'};color:${tab==='register'?'#fff':'#088178'}">Register</button>
        </div>
        <div id="auth-form-container">
          ${tab === 'login' ? loginFormHTML() : registerFormHTML()}
        </div>
      </div>
    </div>`;
  document.body.appendChild(modal);
}

function loginFormHTML() {
  return `
    <h3 style="margin-bottom:16px;color:#088178;">Login Karein</h3>
    <input id="auth-email" type="email" placeholder="Email" style="width:100%;padding:10px;margin-bottom:12px;border:1px solid #ddd;border-radius:6px;box-sizing:border-box;">
    <input id="auth-pass" type="password" placeholder="Password" style="width:100%;padding:10px;margin-bottom:16px;border:1px solid #ddd;border-radius:6px;box-sizing:border-box;">
    <button onclick="handleLogin()" style="width:100%;background:#088178;color:#fff;padding:12px;border:none;border-radius:6px;font-size:15px;cursor:pointer;font-weight:bold;">Login</button>
    <p id="auth-msg" style="color:red;margin-top:8px;font-size:13px;"></p>`;
}

function registerFormHTML() {
  return `
    <h3 style="margin-bottom:16px;color:#088178;">Register Karein</h3>
    <input id="auth-name" type="text" placeholder="Poora Naam" style="width:100%;padding:10px;margin-bottom:12px;border:1px solid #ddd;border-radius:6px;box-sizing:border-box;">
    <input id="auth-email" type="email" placeholder="Email" style="width:100%;padding:10px;margin-bottom:12px;border:1px solid #ddd;border-radius:6px;box-sizing:border-box;">
    <input id="auth-pass" type="password" placeholder="Password (min 6 char)" style="width:100%;padding:10px;margin-bottom:16px;border:1px solid #ddd;border-radius:6px;box-sizing:border-box;">
    <button onclick="handleRegister()" style="width:100%;background:#088178;color:#fff;padding:12px;border:none;border-radius:6px;font-size:15px;cursor:pointer;font-weight:bold;">Account Banao</button>
    <p id="auth-msg" style="color:red;margin-top:8px;font-size:13px;"></p>`;
}

function switchTab(tab) {
  document.getElementById('auth-form-container').innerHTML =
    tab === 'login' ? loginFormHTML() : registerFormHTML();
  document.getElementById('tab-login').style.background = tab === 'login' ? '#088178' : '#fff';
  document.getElementById('tab-login').style.color = tab === 'login' ? '#fff' : '#088178';
  document.getElementById('tab-register').style.background = tab === 'register' ? '#088178' : '#fff';
  document.getElementById('tab-register').style.color = tab === 'register' ? '#fff' : '#088178';
}

async function handleLogin() {
  const email = document.getElementById('auth-email').value;
  const pass  = document.getElementById('auth-pass').value;
  const msg   = document.getElementById('auth-msg');
  try {
    const data = await login(email, pass);
    document.getElementById('tm-auth-modal').remove();
    showToast(data.message);
    updateNavbar();
    updateCartCount();
  } catch (err) {
    msg.textContent = err.message;
  }
}

async function handleRegister() {
  const name  = document.getElementById('auth-name').value;
  const email = document.getElementById('auth-email').value;
  const pass  = document.getElementById('auth-pass').value;
  const msg   = document.getElementById('auth-msg');
  try {
    const data = await register(name, email, pass);
    document.getElementById('tm-auth-modal').remove();
    showToast(data.message);
    updateNavbar();
  } catch (err) {
    msg.textContent = err.message;
  }
}

// =============================================
// PAGE-SPECIFIC INIT
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  updateNavbar();
  updateCartCount();

  // Cart buttons - add to cart
  document.querySelectorAll('.pro a[href="#"] i.fa-cart-shopping, .pro .fa-cart-shopping').forEach((icon, i) => {
    const btn = icon.closest('a') || icon;
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      await addToCart(i + 1); // product id by index (simplification)
    });
  });

  // Contact form
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name    = document.getElementById('cf-name')?.value;
      const email   = document.getElementById('cf-email')?.value;
      const phone   = document.getElementById('cf-phone')?.value;
      const subject = document.getElementById('cf-subject')?.value;
      const message = document.getElementById('cf-message')?.value;
      try {
        const data = await submitContact(name, email, phone, subject, message);
        showToast(data.message);
        contactForm.reset();
      } catch (err) {
        showToast(err.message, 'error');
      }
    });
  }

  // Coupon form on cart page
  const couponBtn = document.querySelector('#coupon button');
  if (couponBtn) {
    couponBtn.addEventListener('click', async () => {
      const code = document.querySelector('#coupon input')?.value;
      if (!code) return;
      try {
        const data = await applyCoupon(code);
        showToast(data.message);
        // Update cart total display
        const totalEl = document.querySelector('#subtotal table tr:last-child td:last-child strong');
        if (totalEl) totalEl.textContent = `RS. ${data.finalAmount.toLocaleString('en-IN')}.00`;
      } catch (err) {
        showToast(err.message, 'error');
      }
    });
  }

  // Checkout button
  const checkoutBtn = document.querySelector('#subtotal button.normal');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', async () => {
      if (!getToken()) {
        showToast('Checkout ke liye pehle login karein!', 'error');
        showAuthModal('login');
        return;
      }
      const street  = prompt('Ghar ka Address (Street):');
      const city    = prompt('City:');
      const pincode = prompt('Pincode:');
      if (!street || !city || !pincode) return;
      try {
        const data = await placeOrder({ street, city, pincode }, 'COD');
        showToast(data.message);
        setTimeout(() => window.location.reload(), 2000);
      } catch (err) {
        showToast(err.message, 'error');
      }
    });
  }
});
