import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { FaArrowLeft, FaImage, FaSave, FaTimes } from 'react-icons/fa';

const EditProductContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
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

const Title = styled.h1`
  color: #333;
  font-size: 28px;
  font-weight: 600;
`;

const Form = styled.form`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 30px;
`;

const FormGroup = styled.div`
  margin-bottom: 25px;
`;

const Label = styled.label`
  display: block;
  color: #333;
  font-weight: 500;
  margin-bottom: 8px;
  font-size: 14px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;
  
  &:focus {
    border-color: #4caf50;
    outline: none;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  min-height: 120px;
  resize: vertical;
  font-family: inherit;
  transition: border-color 0.3s ease;
  
  &:focus {
    border-color: #4caf50;
    outline: none;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  background: #fff;
  cursor: pointer;
  transition: border-color 0.3s ease;
  
  &:focus {
    border-color: #4caf50;
    outline: none;
  }
`;

const ImageUpload = styled.div`
  border: 2px dashed #e1e5e9;
  border-radius: 8px;
  padding: 40px 20px;
  text-align: center;
  transition: border-color 0.3s ease;
  cursor: pointer;
  
  &:hover {
    border-color: #4caf50;
  }
`;

const ImageUploadContent = styled.div`
  color: #666;
  
  svg {
    font-size: 48px;
    margin-bottom: 16px;
    color: #4caf50;
  }
`;

const ImagePreview = styled.div`
  margin-top: 20px;
  
  img {
    width: 100%;
    max-width: 300px;
    height: 200px;
    object-fit: cover;
    border-radius: 8px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 30px;
`;

const SubmitButton = styled.button`
  flex: 1;
  background: #4caf50;
  color: #fff;
  border: none;
  padding: 14px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  &:hover {
    background: #45a049;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  flex: 1;
  background: #6c757d;
  color: #fff;
  border: none;
  padding: 14px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  &:hover {
    background: #5a6268;
  }
`;

const ErrorMessage = styled.div`
  background: #fee;
  color: #c33;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  border: 1px solid #fcc;
  margin-bottom: 20px;
`;

const SuccessMessage = styled.div`
  background: #efe;
  color: #363;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  border: 1px solid #cfc;
  margin-bottom: 20px;
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

const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    imageUrl: ''
  });
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchProduct = useCallback(async () => {
    if (!id) return;
    
    try {
      const response = await axios.get(`/api/products/${id}`);
      const productData = response.data;
      setProduct(productData);
      setFormData({
        title: productData.title,
        description: productData.description,
        category: productData.category,
        price: productData.price.toString(),
        imageUrl: productData.imageUrl
      });
    } catch (error) {
      console.error('Failed to fetch product:', error);
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProduct();
      fetchCategories();
    }
  }, [id, fetchProduct]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append('image', file);
        
        const response = await axios.post('/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        setFormData(prev => ({
          ...prev,
          imageUrl: response.data.imageUrl
        }));
      } catch (error) {
        console.error('Failed to upload image:', error);
        alert('Failed to upload image. Please try again.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        imageUrl: formData.imageUrl || '/api/placeholder/300/200'
      };

      await axios.put(`/api/products/${id}`, productData);
      setSuccess('Product updated successfully!');
      
      // Redirect to my listings after a short delay
      setTimeout(() => {
        navigate('/my-listings');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/my-listings');
  };

  if (loading) {
    return (
      <EditProductContainer>
        <LoadingSpinner />
      </EditProductContainer>
    );
  }

  if (!product) {
    return (
      <EditProductContainer>
        <ErrorMessage>Product not found</ErrorMessage>
      </EditProductContainer>
    );
  }

  return (
    <EditProductContainer>
      <Header>
        <BackButton onClick={() => navigate('/my-listings')}>
          <FaArrowLeft />
        </BackButton>
        <Title>Edit Product</Title>
      </Header>

      <Form onSubmit={handleSubmit}>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}

        <FormGroup>
          <Label>Product Title *</Label>
          <Input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter product title"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Category *</Label>
          <Select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Description *</Label>
          <TextArea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your product..."
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Price ($) *</Label>
          <Input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="0.00"
            min="0"
            step="0.01"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Product Image</Label>
          <ImageUpload onClick={() => document.getElementById('image-upload')?.click()}>
            <ImageUploadContent>
              <FaImage />
              <div>Click to upload new image or drag and drop</div>
              <div style={{ fontSize: '12px', marginTop: '8px' }}>
                PNG, JPG up to 10MB
              </div>
            </ImageUploadContent>
          </ImageUpload>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
          {formData.imageUrl && (
            <ImagePreview>
              <img src={formData.imageUrl} alt="Preview" />
            </ImagePreview>
          )}
        </FormGroup>

        <ButtonGroup>
          <CancelButton type="button" onClick={handleCancel}>
            <FaTimes />
            Cancel
          </CancelButton>
          <SubmitButton type="submit" disabled={saving}>
            <FaSave />
            {saving ? 'Saving...' : 'Save Changes'}
          </SubmitButton>
        </ButtonGroup>
      </Form>
    </EditProductContainer>
  );
};

export default EditProduct;
