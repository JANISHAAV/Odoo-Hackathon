import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { FaUser, FaEnvelope, FaCalendarAlt, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

const DashboardContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 30px;
  font-size: 32px;
  font-weight: 600;
`;

const ProfileCard = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 30px;
  margin-bottom: 30px;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
`;

const ProfileTitle = styled.h2`
  color: #333;
  font-size: 24px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const EditButton = styled.button`
  background: #4caf50;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.3s ease;
  
  &:hover {
    background: #45a049;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  color: #333;
  font-weight: 500;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;
  
  &:focus {
    border-color: #4caf50;
    outline: none;
  }
  
  &:disabled {
    background-color: #f8f9fa;
    color: #666;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 10px;
`;

const SaveButton = styled.button`
  background: #4caf50;
  color: #fff;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.3s ease;
  
  &:hover {
    background: #45a049;
  }
`;

const CancelButton = styled.button`
  background: #6c757d;
  color: #fff;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.3s ease;
  
  &:hover {
    background: #5a6268;
  }
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
`;

const InfoIcon = styled.div`
  color: #4caf50;
  font-size: 16px;
  width: 20px;
`;

const InfoLabel = styled.span`
  font-weight: 500;
  color: #333;
  min-width: 100px;
`;

const InfoValue = styled.span`
  color: #666;
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

interface UserProfile {
  id: string;
  email: string;
  username: string;
  createdAt: string;
}

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setProfile(user);
      setFormData({
        username: user.username,
        email: user.email
      });
    }
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      username: profile?.username || '',
      email: profile?.email || ''
    });
    setError('');
    setSuccess('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.put('/api/user/profile', formData);
      setProfile(response.data.user);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardContainer>
      <Title>User Dashboard</Title>
      
      <ProfileCard>
        <ProfileHeader>
          <ProfileTitle>
            <FaUser />
            Profile Information
          </ProfileTitle>
          {!isEditing && (
            <EditButton onClick={handleEdit}>
              <FaEdit />
              Edit Profile
            </EditButton>
          )}
        </ProfileHeader>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}

        {isEditing ? (
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>
                <FaUser />
                Username
              </Label>
              <Input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>
                <FaEnvelope />
                Email
              </Label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <ButtonGroup>
              <SaveButton type="submit" disabled={loading}>
                <FaSave />
                {loading ? 'Saving...' : 'Save Changes'}
              </SaveButton>
              <CancelButton type="button" onClick={handleCancel}>
                <FaTimes />
                Cancel
              </CancelButton>
            </ButtonGroup>
          </Form>
        ) : (
          <div>
            <InfoItem>
              <InfoIcon>
                <FaUser />
              </InfoIcon>
              <InfoLabel>Username:</InfoLabel>
              <InfoValue>{profile.username}</InfoValue>
            </InfoItem>

            <InfoItem>
              <InfoIcon>
                <FaEnvelope />
              </InfoIcon>
              <InfoLabel>Email:</InfoLabel>
              <InfoValue>{profile.email}</InfoValue>
            </InfoItem>

            <InfoItem>
              <InfoIcon>
                <FaCalendarAlt />
              </InfoIcon>
              <InfoLabel>Member Since:</InfoLabel>
              <InfoValue>
                {new Date(profile.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </InfoValue>
            </InfoItem>
          </div>
        )}
      </ProfileCard>
    </DashboardContainer>
  );
};

export default UserDashboard;
