const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Serve uploaded files statically
app.use('/uploads', express.static(uploadsDir));

// In-memory data storage (replace with database in production)
let users = [];
let products = [];
let cart = [];
let purchases = [];

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Validation middleware
const validateRegistration = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('username').isLength({ min: 3 }).trim().escape()
];

const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').exists()
];

const validateProduct = [
  body('title').isLength({ min: 1 }).trim().escape(),
  body('description').isLength({ min: 1 }).trim().escape(),
  body('category').isIn(['Electronics', 'Clothing', 'Home & Garden', 'Books', 'Sports', 'Beauty', 'Food', 'Other']),
  body('price').isFloat({ min: 0 })
];

// Routes

// User Registration
app.post('/api/auth/register', validateRegistration, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, username } = req.body;

    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = {
      id: uuidv4(),
      email,
      username,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };

    users.push(user);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// User Login
app.post('/api/auth/login', validateLogin, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const user = users.find(user => user.email === email);
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user profile
app.get('/api/user/profile', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    id: user.id,
    email: user.email,
    username: user.username,
    createdAt: user.createdAt
  });
});

// Update user profile
app.put('/api/user/profile', authenticateToken, [
  body('username').optional().isLength({ min: 3 }).trim().escape(),
  body('email').optional().isEmail().normalizeEmail()
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userIndex = users.findIndex(u => u.id === req.user.userId);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { username, email } = req.body;
    
    if (username) users[userIndex].username = username;
    if (email) {
      // Check if email is already taken
      const existingUser = users.find(u => u.email === email && u.id !== req.user.userId);
      if (existingUser) {
        return res.status(400).json({ error: 'Email already in use' });
      }
      users[userIndex].email = email;
    }

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: users[userIndex].id,
        email: users[userIndex].email,
        username: users[userIndex].username,
        createdAt: users[userIndex].createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Product routes

// Create product
app.post('/api/products', authenticateToken, validateProduct, (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, category, price, imageUrl } = req.body;

    const product = {
      id: uuidv4(),
      title,
      description,
      category,
      price: parseFloat(price),
      imageUrl: imageUrl || '/api/placeholder/300/200',
      sellerId: req.user.userId,
      createdAt: new Date().toISOString()
    };

    products.push(product);

    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all products with filtering and search
app.get('/api/products', (req, res) => {
  try {
    let filteredProducts = [...products];
    const { category, search, page = 1, limit = 10 } = req.query;

    // Filter by category
    if (category && category !== 'all') {
      filteredProducts = filteredProducts.filter(p => p.category === category);
    }

    // Search by title
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredProducts = filteredProducts.filter(p => 
        p.title.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm)
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    res.json({
      products: paginatedProducts,
      total: filteredProducts.length,
      page: parseInt(page),
      totalPages: Math.ceil(filteredProducts.length / limit)
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get product by ID
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  // Get seller info
  const seller = users.find(u => u.id === product.sellerId);
  res.json({
    ...product,
    seller: seller ? { username: seller.username } : null
  });
});

// Get user's products
app.get('/api/user/products', authenticateToken, (req, res) => {
  const userProducts = products.filter(p => p.sellerId === req.user.userId);
  res.json(userProducts);
});

// Update product
app.put('/api/products/:id', authenticateToken, validateProduct, (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const productIndex = products.findIndex(p => p.id === req.params.id);
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (products[productIndex].sellerId !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized to update this product' });
    }

    const { title, description, category, price, imageUrl } = req.body;
    
    products[productIndex] = {
      ...products[productIndex],
      title,
      description,
      category,
      price: parseFloat(price),
      imageUrl: imageUrl || products[productIndex].imageUrl
    };

    res.json({
      message: 'Product updated successfully',
      product: products[productIndex]
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete product
app.delete('/api/products/:id', authenticateToken, (req, res) => {
  const productIndex = products.findIndex(p => p.id === req.params.id);
  if (productIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  if (products[productIndex].sellerId !== req.user.userId) {
    return res.status(403).json({ error: 'Not authorized to delete this product' });
  }

  products.splice(productIndex, 1);
  res.json({ message: 'Product deleted successfully' });
});

// Cart routes

// Add to cart
app.post('/api/cart', authenticateToken, (req, res) => {
  const { productId, quantity = 1 } = req.body;
  
  const product = products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const existingItem = cart.find(item => 
    item.userId === req.user.userId && item.productId === productId
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      id: uuidv4(),
      userId: req.user.userId,
      productId,
      quantity,
      addedAt: new Date().toISOString()
    });
  }

  res.json({ message: 'Product added to cart' });
});

// Get cart
app.get('/api/cart', authenticateToken, (req, res) => {
  const userCart = cart.filter(item => item.userId === req.user.userId);
  const cartWithProducts = userCart.map(item => {
    const product = products.find(p => p.id === item.productId);
    return {
      ...item,
      product: product || null
    };
  }).filter(item => item.product !== null);

  res.json(cartWithProducts);
});

// Remove from cart
app.delete('/api/cart/:productId', authenticateToken, (req, res) => {
  const cartIndex = cart.findIndex(item => 
    item.userId === req.user.userId && item.productId === req.params.productId
  );

  if (cartIndex === -1) {
    return res.status(404).json({ error: 'Item not found in cart' });
  }

  cart.splice(cartIndex, 1);
  res.json({ message: 'Item removed from cart' });
});

// Purchase routes

// Create purchase
app.post('/api/purchases', authenticateToken, (req, res) => {
  const userCart = cart.filter(item => item.userId === req.user.userId);
  
  if (userCart.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  const purchase = {
    id: uuidv4(),
    userId: req.user.userId,
    items: userCart.map(item => {
      const product = products.find(p => p.id === item.productId);
      return {
        productId: item.productId,
        quantity: item.quantity,
        price: product ? product.price : 0,
        title: product ? product.title : 'Unknown Product'
      };
    }),
    totalAmount: userCart.reduce((total, item) => {
      const product = products.find(p => p.id === item.productId);
      return total + (product ? product.price * item.quantity : 0);
    }, 0),
    purchaseDate: new Date().toISOString()
  };

  purchases.push(purchase);

  // Clear user's cart
  cart = cart.filter(item => item.userId !== req.user.userId);

  res.status(201).json({
    message: 'Purchase completed successfully',
    purchase
  });
});

// Get purchase history
app.get('/api/purchases', authenticateToken, (req, res) => {
  const userPurchases = purchases.filter(p => p.userId === req.user.userId);
  res.json(userPurchases);
});

// Get categories
app.get('/api/categories', (req, res) => {
  const categories = ['Electronics', 'Clothing', 'Home & Garden', 'Books', 'Sports', 'Beauty', 'Food', 'Other'];
  res.json(categories);
});

// Image upload endpoint
app.post('/api/upload', authenticateToken, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }
    
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ 
      message: 'Image uploaded successfully',
      imageUrl: imageUrl
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
