import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { FaArrowLeft, FaShoppingCart, FaUser, FaCalendarAlt, FaTag } from 'react-icons/fa';

const ProductDetailContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 40px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #4caf50;
  font-size: 20px;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: #f0f8f0;
  }
`;

const ProductContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 30px;
  }
`;

const ImageSection = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const ProductImage = styled.div`
  width: 100%;
  height: 400px;
  background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 16px;
  position: relative;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const InfoSection = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 30px;
`;

const ProductTitle = styled.h1`
  color: #333;
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 15px;
  line-height: 1.3;
`;

const ProductCategory = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
`;

const CategoryTag = styled.span`
  background: #e8f5e8;
  color: #2d5a27;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
`;

const ProductPrice = styled.div`
  color: #4caf50;
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 25px;
`;

const ProductDescription = styled.div`
  margin-bottom: 30px;
  
  h3 {
    color: #333;
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 12px;
  }
  
  p {
    color: #666;
    line-height: 1.6;
    font-size: 16px;
  }
`;

const SellerInfo = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
  
  h3 {
    color: #333;
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  p {
    color: #666;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const ProductMeta = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
  
  h3 {
    color: #333;
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  p {
    color: #666;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 15px;
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const AddToCartButton = styled.button`
  flex: 1;
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
  
  &:hover {
    background: #45a049;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
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

const ErrorMessage = styled.div`
  background: #fee;
  color: #c33;
  padding: 20px;
  border-radius: 12px;
  font-size: 16px;
  border: 1px solid #fcc;
  text-align: center;
`;

interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  imageUrl: string;
  sellerId: string;
  createdAt: string;
  seller?: {
    username: string;
  };
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [error, setError] = useState('');

  const fetchProduct = useCallback(async () => {
    if (!id) return;
    
    try {
      const response = await axios.get(`/api/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Failed to fetch product:', error);
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id, fetchProduct]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!product) return;

    setAddingToCart(true);
    try {
      // Add to local cart context
      addToCart({
        id: product.id,
        name: product.title,
        price: product.price,
        image: product.imageUrl,
        seller: product.seller?.username || 'Unknown'
      });
      
      // Show success message
      alert('Product added to cart!');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('Failed to add product to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <ProductDetailContainer>
        <LoadingSpinner />
      </ProductDetailContainer>
    );
  }

  if (error || !product) {
    return (
      <ProductDetailContainer>
        <Header>
          <BackButton onClick={() => navigate('/')}>
            <FaArrowLeft />
          </BackButton>
        </Header>
        <ErrorMessage>
          {error || 'Product not found'}
        </ErrorMessage>
      </ProductDetailContainer>
    );
  }

  return (
    <ProductDetailContainer>
      <Header>
        <BackButton onClick={() => navigate('/')}>
          <FaArrowLeft />
        </BackButton>
      </Header>

      <ProductContent>
        <ImageSection>
          <ProductImage>
            <img src={product.imageUrl} alt={product.title} />
          </ProductImage>
        </ImageSection>

        <InfoSection>
          <ProductTitle>{product.title}</ProductTitle>
          
          <ProductCategory>
            <FaTag />
            <CategoryTag>{product.category}</CategoryTag>
          </ProductCategory>

          <ProductPrice>${product.price.toFixed(2)}</ProductPrice>

          <ProductDescription>
            <h3>Description</h3>
            <p>{product.description}</p>
          </ProductDescription>

          <SellerInfo>
            <h3>
              <FaUser />
              Seller Information
            </h3>
            <p>
              <FaUser />
              {product.seller?.username || 'Unknown Seller'}
            </p>
          </SellerInfo>

          <ProductMeta>
            <h3>
              <FaCalendarAlt />
              Product Details
            </h3>
            <p>
              <FaCalendarAlt />
              Listed on {new Date(product.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </ProductMeta>

          <ActionButtons>
            <AddToCartButton 
              onClick={handleAddToCart}
              disabled={addingToCart}
            >
              <FaShoppingCart />
              {addingToCart ? 'Adding...' : 'Add to Cart'}
            </AddToCartButton>
          </ActionButtons>
        </InfoSection>
      </ProductContent>
    </ProductDetailContainer>
  );
};

export default ProductDetail;
