'use client';

import React from 'react';
import { useCart } from '../../../Configuracao/Context/CartContext';
import styled from 'styled-components';
import {  FiShoppingBag} from 'react-icons/fi';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cart } = useCart();

  return (
    <DrawerContainer isOpen={isOpen}>
      <DrawerHeader>
        <FiShoppingBag  size={20} />
        <h2>Minha Sacola</h2>
        <CloseButton onClick={onClose}>&times;</CloseButton>
      </DrawerHeader>
      <DrawerContent>
        {cart.length === 0 ? (
          <EmptyCart>
            
            <p>SUA SACOLA ESTÁ VAZIA</p>
            <span>QUE TAL APROVEITAR ALGUMAS NOVIDADES?</span>
            <ContinueShoppingButton onClick={onClose}>CONTINUAR COMPRANDO</ContinueShoppingButton>
          </EmptyCart>
        ) : (
          // Aqui você pode adicionar a lógica para listar os produtos no carrinho
          <div>
            {/* Lógica para mostrar os produtos no carrinho */}
          </div>
        )}
      </DrawerContent>
    </DrawerContainer>
  );
};

export default CartDrawer;

// Styled Components
const DrawerContainer = styled.div<{ isOpen: boolean }>`
    color: black;
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  width: 400px;
  max-width: 90%;
  background: white;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.5);
  transform: ${({ isOpen }) => (isOpen ? 'translateX(0)' : 'translateX(100%)')};
  transition: transform 0.3s ease-in-out;
  z-index: 1000;
`;

const DrawerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #ddd;
  font-weight: bold;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
`;

const DrawerContent = styled.div`
  padding: 20px;
  overflow-y: auto;
  height: calc(100% - 70px);
`;

const EmptyCart = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  img {
    width: 60px;
    height: 60px;
    margin-bottom: 20px;
  }
  p {
    font-weight: bold;
    margin-bottom: 10px;
  }
  span {
    margin-bottom: 20px;
  }
`;

const ContinueShoppingButton = styled.button`
  background: #28a745;
  color: #fff;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;

  &:hover {
    background: #218838;
  }
`;
