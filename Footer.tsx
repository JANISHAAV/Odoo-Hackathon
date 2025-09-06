import React from 'react';
import styled from 'styled-components';
import { FaLeaf } from 'react-icons/fa';

const FooterContainer = styled.footer`
  background: #2d5a27;
  color: #fff;
  padding: 40px 20px 20px;
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  
  svg {
    margin-right: 8px;
    color: #4caf50;
  }
`;

const Description = styled.p`
  margin-bottom: 20px;
  opacity: 0.9;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const Copyright = styled.p`
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding-top: 20px;
  opacity: 0.7;
  font-size: 14px;
`;

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <Logo>
          <FaLeaf />
          EcoFinds
        </Logo>
        <Description>
          Your sustainable marketplace for eco-friendly products. 
          Discover, buy, and sell products that make a positive impact on our planet.
        </Description>
        <Copyright>
          © 2024 EcoFinds. All rights reserved.
        </Copyright>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
