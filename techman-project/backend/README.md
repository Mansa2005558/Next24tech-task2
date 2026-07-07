# 🛒 TechMan E-commerce - Backend API

Aapki **TechMan E-commerce** website ke liye pura Node.js + Express backend.

---

## 📁 Project Structure

```
ecommerce-backend/
├── server.js              # Main server (yahan se start hota hai)
├── .env.example           # Environment variables template
├── package.json
├── models/
│   └── db.js              # Data store (products, users, carts, orders)
├── middleware/
│   └── auth.js            # JWT token verification
└── routes/
    ├── products.js        # Product listing & search
    ├── auth.js            # Register & Login
    ├── cart.js            # Shopping cart
    ├── orders.js          # Order placement & tracking
    ├── contact.js         # Contact form
    └── coupon.js          # Coupon codes
```

---

## 🚀 Setup & Run

```bash
# 1. Folder mein jaao
cd ecommerce-backend

# 2. Dependencies install karo
npm install

# 3. .env file banao
cp .env.example .env

# 4. Server start karo
npm start

# Ya development mode (auto-restart)
npm run dev
```

Server `http://localhost:3000` par chalega ✅

---

## 📡 API Endpoints

### Base URL: `http://localhost:3000/api`

---

### 🟢 Products (No login needed)

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/products` | Sabhi products |
| GET | `/products?category=dress` | Category filter |
| GET | `/products?search=winter` | Search |
| GET | `/products?minPrice=2000&maxPrice=3000` | Price filter |
| GET | `/products?sort=price_asc` | Sort (price_asc/price_desc/rating) |
| GET | `/products/categories` | Sab categories |
| GET | `/products/:id` | Ek product detail |

**Example:**
```bash
curl http://localhost:3000/api/products?category=dress
```

---

### 👤 Auth (Register / Login)

| Method | URL | Description |
|--------|-----|-------------|
| POST | `/auth/register` | Naya account banao |
| POST | `/auth/login` | Login karo |
| GET | `/auth/profile` | Apna profile dekho 🔒 |

**Register:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Rahul Sharma","email":"rahul@email.com","password":"secret123"}'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"rahul@email.com","password":"secret123"}'
```
> Login se `token` milega — ise har protected request mein bhejein.

---

### 🛒 Cart (Login required 🔒)

Header mein token: `Authorization: Bearer <token>`

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/cart` | Apna cart dekho |
| POST | `/cart/add` | Product add karo |
| PUT | `/cart/update` | Quantity change karo |
| DELETE | `/cart/remove/:productId` | Product hatao |
| DELETE | `/cart/clear` | Poora cart saaf karo |

**Add to Cart:**
```bash
curl -X POST http://localhost:3000/api/cart/add \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"productId": 1, "qty": 2}'
```

---

### 📦 Orders (Login required 🔒)

| Method | URL | Description |
|--------|-----|-------------|
| POST | `/orders/place` | Order place karo |
| GET | `/orders` | Apne sab orders |
| GET | `/orders/:id` | Order detail |
| PUT | `/orders/:id/cancel` | Order cancel karo |

**Place Order:**
```bash
curl -X POST http://localhost:3000/api/orders/place \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "address": {
      "street": "123 MG Road",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001"
    },
    "paymentMethod": "COD"
  }'
```

---

### 📩 Contact Form

| Method | URL | Description |
|--------|-----|-------------|
| POST | `/contact` | Message bhejo |

```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Priya",
    "email": "priya@email.com",
    "subject": "Order Issue",
    "message": "Mera order 5 din se nahi aaya!"
  }'
```

---

### 🏷️ Coupons

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/coupon/list` | Available coupons |
| POST | `/coupon/apply` | Coupon lagao 🔒 |

**Available Coupon Codes:**
| Code | Offer | Min Order |
|------|-------|-----------|
| `SAVE10` | 10% Off | RS. 1000 |
| `FLAT200` | RS. 200 Off | RS. 2000 |
| `WELCOME` | 15% Off | RS. 500 |

---

## 🔗 Frontend Integration

`index.html` mein yeh script add karein:

```javascript
// Product list load karo
fetch('http://localhost:3000/api/products')
  .then(r => r.json())
  .then(data => {
    data.products.forEach(product => {
      console.log(product.name, product.price);
    });
  });

// Cart mein add karo (token required)
const token = localStorage.getItem('token');
fetch('http://localhost:3000/api/cart/add', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ productId: 1, qty: 1 })
});
```

---

## 🔮 Aage Kya Karein? (Future Improvements)

- **Database**: `db.js` ke in-memory store ko MongoDB ya MySQL se replace karein
- **Payment Gateway**: Razorpay/Stripe integration
- **Email**: Nodemailer se order confirmation emails
- **Admin Panel**: Product add/edit/delete, orders manage karna
- **Image Upload**: Multer se product images upload
- **Search**: Elasticsearch ya MongoDB text search

---

## 🛡️ Security Notes

- Production mein `.env` mein strong `JWT_SECRET` daalen
- HTTPS use karein
- Rate limiting add karein (express-rate-limit)
- Input validation already hai ✅
