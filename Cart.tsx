import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { useCart } from '../contexts/CartContext';
import { FaShoppingCart, FaTrash, FaMinus, FaPlus, FaCreditCard, FaLeaf } from 'react-icons/fa';

const CartContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  color: #333;
  font-size: 32px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CartContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 40px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 30px;
  }
`;

const CartItems = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 30px;
`;

const CartItem = styled.div`
  display: flex;
  gap: 20px;
  padding: 20px 0;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 15px;
  }
`;

const EcoBadge = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 4px;
  z-index: 2;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
`;

const ItemImage = styled.div`
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%);
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  @media (max-width: 480px) {
    width: 100%;
    height: 200px;
  }
`;

const ItemInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ItemTitle = styled.h3`
  color: #333;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  line-height: 1.4;
`;

const ItemPrice = styled.div`
  color: #4caf50;
  font-size: 20px;
  font-weight: bold;
`;

const ItemActions = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-top: auto;
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 8px;
`;

const QuantityButton = styled.button`
  background: #4caf50;
  color: #fff;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
  
  &:hover {
    background: #45a049;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const QuantityInput = styled.input`
  width: 50px;
  text-align: center;
  border: none;
  background: none;
  font-weight: 600;
  font-size: 16px;
`;

const RemoveButton = styled.button`
  background: #f44336;
  color: #fff;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  transition: background-color 0.3s ease;
  
  &:hover {
    background: #d32f2f;
  }
`;

const CartSummary = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 30px;
  height: fit-content;
  position: sticky;
  top: 100px;
`;

const SummaryTitle = styled.h3`
  color: #333;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
    font-weight: bold;
    font-size: 18px;
    color: #333;
  }
`;

const SummaryLabel = styled.span`
  color: #666;
`;

const SummaryValue = styled.span`
  color: #333;
  font-weight: 500;
`;

const CheckoutButton = styled.button`
  width: 100%;
  background: #4caf50;
  color: #fff;
  border: none;
  padding: 16px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
  
  &:hover {
    background: #45a049;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;
  
  svg {
    font-size: 64px;
    color: #ddd;
    margin-bottom: 20px;
  }
  
  h3 {
    margin-bottom: 10px;
    color: #333;
    font-size: 24px;
  }
  
  p {
    margin-bottom: 30px;
    font-size: 16px;
  }
`;

const ShopButton = styled(Link)`
  background: #4caf50;
  color: #fff;
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  display: inline-block;
  transition: background-color 0.3s ease;
  
  &:hover {
    background: #45a049;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px;
  
  &::after {
    content: '';
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #4caf50;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

interface CartItemType {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  addedAt: string;
  product: {
    id: string;
    title: string;
    price: number;
    imageUrl: string;
  };
}

const Cart: React.FC = () => {
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId);
  };

  const handleCheckout = async () => {
    setCheckingOut(true);
    try {
      // In a real app, you'd process payment here
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      clearCart();
      alert('Purchase completed successfully!');
    } catch (error) {
      console.error('Failed to checkout:', error);
      alert('Failed to complete purchase');
    } finally {
      setCheckingOut(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <CartContainer>
        <Header>
          <Title>
            <FaShoppingCart />
            Shopping Cart
          </Title>
        </Header>
        <EmptyCart>
          <FaShoppingCart />
          <h3>Your cart is empty</h3>
          <p>Add some products to get started</p>
          <ShopButton to="/">Continue Shopping</ShopButton>
        </EmptyCart>
      </CartContainer>
    );
  }

  return (
    <CartContainer>
      <Header>
        <Title>
          <FaShoppingCart />
          Shopping Cart ({cartItems.length} items)
        </Title>
      </Header>

      <CartContent>
        <CartItems>
          {cartItems.map(item => (
            <CartItem key={item.id}>
              <EcoBadge>
                <FaLeaf />
                Eco-Friendly
              </EcoBadge>
              <ItemImage>
                <img src={item.image} alt={item.name} />
              </ItemImage>
              <ItemInfo>
                <ItemTitle>{item.name}</ItemTitle>
                <ItemPrice>${item.price.toFixed(2)}</ItemPrice>
                <ItemActions>
                  <QuantityControls>
                    <QuantityButton
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                    >
                      <FaMinus />
                    </QuantityButton>
                    <QuantityInput
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value) || 1)}
                      min="1"
                    />
                    <QuantityButton
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                    >
                      <FaPlus />
                    </QuantityButton>
                  </QuantityControls>
                  <RemoveButton
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    <FaTrash />
                    Remove
                  </RemoveButton>
                </ItemActions>
              </ItemInfo>
            </CartItem>
          ))}
        </CartItems>

        <CartSummary>
          <SummaryTitle>Order Summary</SummaryTitle>
          <SummaryRow>
            <SummaryLabel>Subtotal ({cartItems.reduce((total, item) => total + item.quantity, 0)} items)</SummaryLabel>
            <SummaryValue>${getTotalPrice().toFixed(2)}</SummaryValue>
          </SummaryRow>
          <SummaryRow>
            <SummaryLabel>Shipping</SummaryLabel>
            <SummaryValue>Free</SummaryValue>
          </SummaryRow>
          <SummaryRow>
            <SummaryLabel>Tax</SummaryLabel>
            <SummaryValue>$0.00</SummaryValue>
          </SummaryRow>
          <SummaryRow>
            <SummaryLabel>Total</SummaryLabel>
            <SummaryValue>${getTotalPrice().toFixed(2)}</SummaryValue>
          </SummaryRow>
          <CheckoutButton
            onClick={handleCheckout}
            disabled={checkingOut}
          >
            <FaCreditCard />
            {checkingOut ? 'Processing...' : 'Proceed to Checkout'}
          </CheckoutButton>
        </CartSummary>
      </CartContent>
    </CartContainer>
  );
};

export default Cart;
