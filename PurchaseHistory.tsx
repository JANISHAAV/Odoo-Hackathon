import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { FaHistory, FaCalendarAlt, FaDollarSign, FaBox } from 'react-icons/fa';

const PurchaseHistoryContainer = styled.div`
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

const PurchaseList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const PurchaseCard = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 30px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  }
`;

const PurchaseHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
`;

const PurchaseId = styled.div`
  color: #333;
  font-size: 18px;
  font-weight: 600;
`;

const PurchaseDate = styled.div`
  color: #666;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PurchaseTotal = styled.div`
  color: #4caf50;
  font-size: 20px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const PurchaseItem = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 12px;
`;

const ItemImage = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%);
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemTitle = styled.h4`
  color: #333;
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 5px 0;
`;

const ItemDetails = styled.div`
  color: #666;
  font-size: 14px;
  display: flex;
  gap: 15px;
`;

const ItemPrice = styled.div`
  color: #4caf50;
  font-weight: 600;
  font-size: 16px;
`;

const EmptyState = styled.div`
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

const StatsCard = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 30px;
  margin-bottom: 30px;
`;

const StatsTitle = styled.h3`
  color: #333;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
`;

const StatItem = styled.div`
  text-align: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
`;

const StatValue = styled.div`
  color: #4caf50;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
`;

const StatLabel = styled.div`
  color: #666;
  font-size: 14px;
`;

interface PurchaseItemType {
  productId: string;
  quantity: number;
  price: number;
  title: string;
}

interface Purchase {
  id: string;
  userId: string;
  items: PurchaseItemType[];
  totalAmount: number;
  purchaseDate: string;
}

const PurchaseHistory: React.FC = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      const response = await axios.get('/api/purchases');
      setPurchases(response.data);
    } catch (error) {
      console.error('Failed to fetch purchases:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const totalPurchases = purchases.length;
    const totalSpent = purchases.reduce((sum, purchase) => sum + purchase.totalAmount, 0);
    const totalItems = purchases.reduce((sum, purchase) => 
      sum + purchase.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    );

    return { totalPurchases, totalSpent, totalItems };
  };

  if (loading) {
    return (
      <PurchaseHistoryContainer>
        <LoadingSpinner />
      </PurchaseHistoryContainer>
    );
  }

  const stats = calculateStats();

  return (
    <PurchaseHistoryContainer>
      <Header>
        <Title>
          <FaHistory />
          Purchase History
        </Title>
      </Header>

      {purchases.length > 0 && (
        <StatsCard>
          <StatsTitle>
            <FaBox />
            Purchase Statistics
          </StatsTitle>
          <StatsGrid>
            <StatItem>
              <StatValue>{stats.totalPurchases}</StatValue>
              <StatLabel>Total Orders</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>${stats.totalSpent.toFixed(2)}</StatValue>
              <StatLabel>Total Spent</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{stats.totalItems}</StatValue>
              <StatLabel>Items Purchased</StatLabel>
            </StatItem>
          </StatsGrid>
        </StatsCard>
      )}

      {purchases.length === 0 ? (
        <EmptyState>
          <FaHistory />
          <h3>No purchase history</h3>
          <p>Your completed purchases will appear here</p>
        </EmptyState>
      ) : (
        <PurchaseList>
          {purchases.map(purchase => (
            <PurchaseCard key={purchase.id}>
              <PurchaseHeader>
                <PurchaseId>Order #{purchase.id.slice(-8).toUpperCase()}</PurchaseId>
                <PurchaseDate>
                  <FaCalendarAlt />
                  {new Date(purchase.purchaseDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </PurchaseDate>
                <PurchaseTotal>
                  <FaDollarSign />
                  {purchase.totalAmount.toFixed(2)}
                </PurchaseTotal>
              </PurchaseHeader>
              
              <ItemsList>
                {purchase.items.map((item, index) => (
                  <PurchaseItem key={index}>
                    <ItemImage>
                      <img src="/api/placeholder/60/60" alt={item.title} />
                    </ItemImage>
                    <ItemInfo>
                      <ItemTitle>{item.title}</ItemTitle>
                      <ItemDetails>
                        <span>Quantity: {item.quantity}</span>
                        <span>Price: ${item.price.toFixed(2)}</span>
                      </ItemDetails>
                    </ItemInfo>
                    <ItemPrice>
                      ${(item.price * item.quantity).toFixed(2)}
                    </ItemPrice>
                  </PurchaseItem>
                ))}
              </ItemsList>
            </PurchaseCard>
          ))}
        </PurchaseList>
      )}
    </PurchaseHistoryContainer>
  );
};

export default PurchaseHistory;
