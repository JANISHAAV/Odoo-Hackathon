import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { FaArrowLeft, FaImage } from 'react-icons/fa';

const AddProductContainer = styled.div`
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

const AddProduct: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    imageUrl: ''
  });
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      console.log('Fetching categories...');
      const response = await axios.get('/api/categories');
      console.log('Categories response:', response.data);
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      // Set some default categories as fallback
      setCategories(['Electronics', 'Clothing', 'Home & Garden', 'Books', 'Sports', 'Beauty', 'Food', 'Other']);
    }
  };

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
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        imageUrl: formData.imageUrl || '/api/placeholder/300/200'
      };

      await axios.post('/api/products', productData);
      setSuccess('Product created successfully!');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        price: '',
        imageUrl: ''
      });
      
      // Redirect to my listings after a short delay
      setTimeout(() => {
        navigate('/my-listings');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <AddProductContainer>
      <Header>
        <BackButton onClick={() => navigate('/')}>
          <FaArrowLeft />
        </BackButton>
        <Title>Add New Product</Title>
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
            {categories.length > 0 ? categories.map(category => (
              <option key={category} value={category}>{category}</option>
            )) : (
              <option disabled>Loading categories...</option>
            )}
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
              <div>Click to upload image or drag and drop</div>
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
            Cancel
          </CancelButton>
          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Product'}
          </SubmitButton>
        </ButtonGroup>
      </Form>
    </AddProductContainer>
  );
};

export default AddProduct;
