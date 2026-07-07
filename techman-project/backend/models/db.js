// =============================================
// db.js - In-Memory Data Store
// (Production mein MongoDB/MySQL use karein)
// =============================================

// ---- PRODUCTS ----
const products = [
  {
    id: 1,
    name: 'SIKURA WINTER DRESS',
    brand: 'Alamode By Akansha',
    price: 2799,
    image: 'img/product/p1.webp',
    category: 'dress',
    rating: 5,
    stock: 15,
    description: 'Elegant winter dress with modern design, perfect for the cold season.'
  },
  {
    id: 2,
    name: 'TARON KNITTED A-LINE DRESS',
    brand: 'Alamode By Akansha',
    price: 2450,
    image: 'img/product/p2.webp',
    category: 'dress',
    rating: 5,
    stock: 20,
    description: 'Classic A-line knitted dress for a stylish winter look.'
  },
  {
    id: 3,
    name: 'LAUDER DRESS AND TOP SET',
    brand: 'Alamode By Akansha',
    price: 2999,
    image: 'img/product/p3.jpeg',
    category: 'set',
    rating: 5,
    stock: 10,
    description: 'Trendy dress and top coordinated set for the modern woman.'
  },
  {
    id: 4,
    name: 'MADINE VINTAGE COORD SET WITH BELT',
    brand: 'Alamode By Akansha',
    price: 3150,
    image: 'img/product/p4.jpg',
    category: 'set',
    rating: 5,
    stock: 8,
    description: 'Vintage-inspired coord set with matching belt for a complete look.'
  },
  {
    id: 5,
    name: 'HILDA STATEMENT DRESS',
    brand: 'Alamode By Akansha',
    price: 2350,
    image: 'img/product/p5.jpeg',
    category: 'dress',
    rating: 5,
    stock: 12,
    description: 'Make a bold statement with this stunning dress.'
  },
  {
    id: 6,
    name: 'LUCID MAXI DRESS',
    brand: 'Alamode By Akansha',
    price: 2650,
    image: 'img/product/p6.jpg',
    category: 'dress',
    rating: 4,
    stock: 18,
    description: 'Flowy maxi dress for effortless elegance.'
  },
  {
    id: 7,
    name: 'SUMMER BLOOM KURTA',
    brand: 'Alamode By Akansha',
    price: 1850,
    image: 'img/product/p7.jpg',
    category: 'kurta',
    rating: 4,
    stock: 25,
    description: 'Light and breezy kurta with floral prints.'
  },
  {
    id: 8,
    name: 'REGAL ANARKALI SUIT',
    brand: 'Alamode By Akansha',
    price: 3500,
    image: 'img/product/p8.webp',
    category: 'suit',
    rating: 5,
    stock: 7,
    description: 'Graceful Anarkali suit for festive occasions.'
  },
  {
    id: 9,
    name: 'Acrylic,Polyester Plain Winter Women Top',
    brand: 'Indiamart',
    price: 499,
    image: 'img/product/n/n11.webp',
    category: 'top',
    rating: 5,
    stock: 30,
    description: 'Warm and comfortable winter top, one size fits most.'
  },
  {
    id: 10,
    name: 'Pink Dress for women',
    brand: 'Aloob',
    price: 899,
    image: 'img/product/n/n22.jpg',
    category: 'dress',
    rating: 5,
    stock: 28,
    description: 'Vibrant pink dress, perfect for casual outings.'
  },
  {
    id: 11,
    name: 'Men Solid Acrylic Winter Beanie',
    brand: 'Bharatasya',
    price: 2999,
    image: 'img/product/n/n33.jpg',
    category: 'accessory',
    rating: 5,
    stock: 16,
    description: 'Cozy acrylic beanie to keep you warm this winter.'
  },
  {
    id: 12,
    name: 'Women Winter Classic Woolen Dresses',
    brand: 'Studiofit Women',
    price: 999,
    image: 'img/product/n/n4.webp',
    category: 'dress',
    rating: 5,
    stock: 19,
    description: 'Classic woolen dress designed for winter comfort.'
  },
  {
    id: 13,
    name: 'WnTCo Winter is Here Dress',
    brand: 'Wardrobenthings',
    price: 699,
    image: 'img/product/n/n5.jpeg',
    category: 'dress',
    rating: 5,
    stock: 24,
    description: 'Trendy winter dress with a cozy fit.'
  },
  {
    id: 14,
    name: 'White V-Neck Winter Top',
    brand: 'Aloob',
    price: 3099,
    image: 'img/product/n/n6.jpg',
    category: 'top',
    rating: 5,
    stock: 11,
    description: 'Elegant white V-neck top for the winter season.'
  },
  {
    id: 15,
    name: 'White Dresses for Women',
    brand: 'Aloob',
    price: 2899,
    image: 'img/product/n/n7.avif',
    category: 'dress',
    rating: 5,
    stock: 13,
    description: 'Simple and elegant white dress for any occasion.'
  },
  {
    id: 16,
    name: 'Winter Green Bodycon Dress',
    brand: 'Aloob',
    price: 3450,
    image: 'img/product/n/n8.jpg',
    category: 'dress',
    rating: 5,
    stock: 9,
    description: 'Chic green bodycon dress for a bold winter statement.'
  }
];

// ---- COUPONS ----
const coupons = [
  { code: 'SAVE10', discount: 10, type: 'percent',  minOrder: 1000 },
  { code: 'FLAT200', discount: 200, type: 'flat',   minOrder: 2000 },
  { code: 'WELCOME', discount: 15, type: 'percent', minOrder: 500  }
];

// ---- IN-MEMORY STORES ----
// (Real app mein yeh database mein hoga)
let users  = [];   // { id, name, email, passwordHash }
let carts  = {};   // { userId: [{ productId, qty }] }
let orders = [];   // order objects
let contacts = []; // contact form submissions

let userIdCounter  = 1;
let orderIdCounter = 1;

module.exports = { products, coupons, users, carts, orders, contacts, get userIdCounter() { return userIdCounter; }, incUserId() { return ++userIdCounter; }, get orderIdCounter() { return orderIdCounter; }, incOrderId() { return ++orderIdCounter; } };
