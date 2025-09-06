import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';

const MyListingsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  flex-wrap: wrap;
  gap: 20px;
`;

const Title = styled.h1`
  color: #333;
  font-size: 32px;
  font-weight: 600;
`;

const AddProductButton = styled(Link)`
  background: #4caf50;
  color: #fff;
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.3s ease;
  
  &:hover {
    background: #45a049;
  }
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
`;

const ProductCard = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  }
`;

const ProductImage = styled.div`
  width: 100%;
  height: 200px;
  background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 14px;
  position: relative;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ProductInfo = styled.div`
  padding: 20px;
`;

const ProductTitle = styled.h3`
  color: #333;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  line-height: 1.4;
`;

const ProductCategory = styled.span`
  background: #e8f5e8;
  color: #2d5a27;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 12px;
  display: inline-block;
`;

const ProductPrice = styled.div`
  color: #4caf50;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 15px;
`;

const ProductActions = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 10px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
`;

const ViewButton = styled(ActionButton)`
  background: #4caf50;
  color: #fff;
  border: none;
  
  &:hover {
    background: #45a049;
  }
`;

const EditButton = styled(ActionButton)`
  background: #fff;
  color: #ff9800;
  border: 2px solid #ff9800;
  
  &:hover {
    background: #ff9800;
    color: #fff;
  }
`;

const DeleteButton = styled(ActionButton)`
  background: #fff;
  color: #f44336;
  border: 2px solid #f44336;
  
  &:hover {
    background: #f44336;
    color: #fff;
  }
`;

const NoProducts = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;
  
  h3 {
    margin-bottom: 10px;
    color: #333;
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

const ConfirmDialog = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const DialogContent = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 30px;
  max-width: 400px;
  width: 90%;
  text-align: center;
`;

const DialogTitle = styled.h3`
  color: #333;
  margin-bottom: 15px;
  font-size: 20px;
`;

const DialogMessage = styled.p`
  color: #666;
  margin-bottom: 25px;
  line-height: 1.5;
`;

const DialogButtons = styled.div`
  display: flex;
  gap: 15px;
`;

const DialogButton = styled.button`
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
`;

const ConfirmButton = styled(DialogButton)`
  background: #f44336;
  color: #fff;
  border: none;
  
  &:hover {
    background: #d32f2f;
  }
`;

const CancelDialogButton = styled(DialogButton)`
  background: #6c757d;
  color: #fff;
  border: none;
  
  &:hover {
    background: #5a6268;
  }
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
}

const MyListings: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; productId: string | null; productTitle: string }>({
    isOpen: false,
    productId: null,
    productTitle: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/user/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (productId: string, productTitle: string) => {
    setDeleteDialog({
      isOpen: true,
      productId,
      productTitle
    });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.productId) return;

    try {
      await axios.delete(`/api/products/${deleteDialog.productId}`);
      setProducts(products.filter(p => p.id !== deleteDialog.productId));
      setDeleteDialog({ isOpen: false, productId: null, productTitle: '' });
    } catch (error) {
      console.error('Failed to delete product:', error);
      alert('Failed to delete product');
    }
  };

  const cancelDelete = () => {
    setDeleteDialog({ isOpen: false, productId: null, productTitle: '' });
  };

  if (loading) {
    return (
      <MyListingsContainer>
        <LoadingSpinner />
      </MyListingsContainer>
    );
  }

  return (
    <MyListingsContainer>
      <Header>
        <Title>My Product Listings</Title>
        <AddProductButton to="/add-product">
          <FaPlus />
          Add New Product
        </AddProductButton>
      </Header>

      {products.length === 0 ? (
        <NoProducts>
          <h3>No products listed yet</h3>
          <p>Start by adding your first product to the marketplace</p>
        </NoProducts>
      ) : (
        <ProductsGrid>
          {products.map(product => (
            <ProductCard key={product.id}>
              <ProductImage>
                <img src={product.imageUrl} alt={product.title} />
              </ProductImage>
              <ProductInfo>
                <ProductTitle>{product.title}</ProductTitle>
                <ProductCategory>{product.category}</ProductCategory>
                <ProductPrice>${product.price.toFixed(2)}</ProductPrice>
                <ProductActions>
                  <ViewButton as={Link} to={`/product/${product.id}`}>
                    <FaEye />
                    View
                  </ViewButton>
                  <EditButton as={Link} to={`/edit-product/${product.id}`}>
                    <FaEdit />
                    Edit
                  </EditButton>
                  <DeleteButton onClick={() => handleDelete(product.id, product.title)}>
                    <FaTrash />
                    Delete
                  </DeleteButton>
                </ProductActions>
              </ProductInfo>
            </ProductCard>
          ))}
        </ProductsGrid>
      )}

      {deleteDialog.isOpen && (
        <ConfirmDialog>
          <DialogContent>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogMessage>
              Are you sure you want to delete "{deleteDialog.productTitle}"? 
              This action cannot be undone.
            </DialogMessage>
            <DialogButtons>
              <CancelDialogButton onClick={cancelDelete}>
                Cancel
              </CancelDialogButton>
              <ConfirmButton onClick={confirmDelete}>
                Delete
              </ConfirmButton>
            </DialogButtons>
          </DialogContent>
        </ConfirmDialog>
      )}
    </MyListingsContainer>
  );
};

export default MyListings;
