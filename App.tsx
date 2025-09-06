import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import AddProduct from './pages/AddProduct';
import MyListings from './pages/MyListings';
import EditProduct from './pages/EditProduct';
import UserDashboard from './pages/UserDashboard';
import Cart from './pages/Cart';
import PurchaseHistory from './pages/PurchaseHistory';
import LoadingSpinner from './components/LoadingSpinner';

const App: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <CartProvider>
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
        
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="add-product" element={user ? <AddProduct /> : <Navigate to="/login" />} />
          <Route path="my-listings" element={user ? <MyListings /> : <Navigate to="/login" />} />
          <Route path="edit-product/:id" element={user ? <EditProduct /> : <Navigate to="/login" />} />
          <Route path="dashboard" element={user ? <UserDashboard /> : <Navigate to="/login" />} />
          <Route path="cart" element={user ? <Cart /> : <Navigate to="/login" />} />
          <Route path="purchases" element={user ? <PurchaseHistory /> : <Navigate to="/login" />} />
        </Route>
      </Routes>
    </CartProvider>
  );
};

export default App;
