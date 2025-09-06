# EcoFinds - Sustainable Products Marketplace

A foundational e-commerce platform focused on sustainable products, built with React, TypeScript, and Node.js.

## Features

### ✅ Core Functionality
- **User Authentication**: Secure registration and login system
- **User Dashboard**: Profile management with editable fields
- **Product Management**: Full CRUD operations for product listings
- **Product Browsing**: Search and filter products by category
- **Shopping Cart**: Add, remove, and manage cart items
- **Purchase History**: View previous purchases
- **Responsive Design**: Works on both mobile and desktop

### 🛠 Technical Features
- **Frontend**: React 18 with TypeScript
- **Backend**: Node.js with Express
- **Authentication**: JWT-based authentication
- **Styling**: Styled Components for modern UI
- **Data Management**: In-memory storage (easily replaceable with database)
- **API**: RESTful API with proper error handling

## Project Structure

```
ecofinds/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React contexts (Auth)
│   │   ├── pages/          # Page components
│   │   └── styles/         # Global styles
│   └── package.json
├── server/                 # Node.js backend
│   ├── index.js           # Main server file
│   └── package.json
├── package.json           # Root package.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecofinds
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

3. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start both the backend server (port 5000) and frontend development server (port 3000).

### Alternative Setup

If you prefer to run the servers separately:

1. **Start the backend server**
   ```bash
   cd server
   npm install
   npm run dev
   ```

2. **Start the frontend server** (in a new terminal)
   ```bash
   cd client
   npm install
   npm start
   ```

## Usage

### User Registration & Login
1. Navigate to `http://localhost:3000`
2. Click "Register" to create a new account
3. Use "Login" to sign in with existing credentials

### Product Management
1. **Add Products**: Click "Add Product" in the header (requires login)
2. **View Products**: Browse all products on the home page
3. **Search & Filter**: Use the search bar and category filter
4. **Manage Listings**: View your products in "My Listings"

### Shopping Experience
1. **Browse Products**: Use the home page to discover products
2. **View Details**: Click on any product for detailed information
3. **Add to Cart**: Use the "Add to Cart" button on product pages
4. **Manage Cart**: View and modify items in your cart
5. **Checkout**: Complete purchases through the cart page

### User Dashboard
1. **Access Dashboard**: Click on your username in the header
2. **Edit Profile**: Update your username and email
3. **View Statistics**: See your account information

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

### Products
- `GET /api/products` - Get all products (with search/filter)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/user/products` - Get user's products
- `GET /api/categories` - Get available categories

### Cart & Purchases
- `GET /api/cart` - Get cart items
- `POST /api/cart` - Add item to cart
- `DELETE /api/cart/:productId` - Remove item from cart
- `POST /api/purchases` - Complete purchase
- `GET /api/purchases` - Get purchase history

## Data Models

### User
```typescript
{
  id: string;
  email: string;
  username: string;
  password: string; // hashed
  createdAt: string;
}
```

### Product
```typescript
{
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  imageUrl: string;
  sellerId: string;
  createdAt: string;
}
```

### Cart Item
```typescript
{
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  addedAt: string;
}
```

### Purchase
```typescript
{
  id: string;
  userId: string;
  items: PurchaseItem[];
  totalAmount: number;
  purchaseDate: string;
}
```

## Categories

The platform supports the following product categories:
- Electronics
- Clothing
- Home & Garden
- Books
- Sports
- Beauty
- Food
- Other

## Security Features

- **Password Hashing**: Uses bcryptjs for secure password storage
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configured for secure cross-origin requests

## Responsive Design

The application is fully responsive and works on:
- **Desktop**: Full-featured experience with grid layouts
- **Tablet**: Optimized layouts with touch-friendly interactions
- **Mobile**: Stacked layouts with mobile-first design

## Future Enhancements

- Database integration (MongoDB/PostgreSQL)
- Image upload functionality
- Payment processing integration
- Advanced search with filters
- Product reviews and ratings
- Seller profiles and verification
- Admin dashboard
- Email notifications
- Real-time chat support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please contact the development team or create an issue in the repository.
