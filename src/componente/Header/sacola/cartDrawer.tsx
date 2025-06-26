'use client';

import React from 'react';
import { useCart } from '../../../Configuracao/Context/CartContext';
import styled from 'styled-components';
import { FiShoppingBag } from 'react-icons/fi';
import Link from 'next/link';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cart } = useCart();

  // Função para calcular total (usa promotion se existir)
  const getTotal = () => {
  const total = cart.reduce((sum, item) => {
    // escolhe promotion se existir, senão price
    const raw = item.promotion && item.promotion.trim() !== ''
      ? item.promotion
      : item.price;
    // limpa 'R$' e espaços
    let numericStr = raw.replace('R$', '').trim();
    // se contiver vírgula, trata no formato pt-BR: '.' milhares e ',' decimais
    if (numericStr.includes(',')) {
      numericStr = numericStr.replace(/\./g, '');
      numericStr = numericStr.replace(',', '.');
    }
    // senão assume formato en (decimal com ponto)
    const numeric = parseFloat(numericStr);
    return sum + (isNaN(numeric) ? 0 : numeric);
  }, 0);

  return total.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

  return (
    <DrawerContainer isOpen={isOpen}>
      <DrawerHeader>
        <FiShoppingBag size={20} />
        <h2>Minha Sacola</h2>
        <CloseButton onClick={onClose}>&times;</CloseButton>
      </DrawerHeader>
      <DrawerContent>
        {cart.length === 0 ? (
          <EmptyCart>
            <p>SUA SACOLA ESTÁ VAZIA</p>
            <span>QUE TAL APROVEITAR ALGUMAS NOVIDADES?</span>
            <ContinueShoppingButton onClick={onClose}>
              CONTINUAR COMPRANDO
            </ContinueShoppingButton>
          </EmptyCart>
        ) : (
          <>
            <ItemsWrapper>
              {cart.map((item, idx) => (
                <CartItem key={idx}>
                  <ItemImage src={item.images[0]} alt={item.name} />
                  <ItemDetails>
                    <h4>{item.name}</h4>
                    <p>Cor: {item.selectedColor}</p>
                    <p>Tamanho: {item.selectedSize}</p>
                    <p>
                      R$ {item.promotion || item.price}
                      {item.promotion && (
                        <span className="line-through ml-2">R$ {item.price}</span>
                      )}
                    </p>
                  </ItemDetails>
                </CartItem>
              ))}
            </ItemsWrapper>

            <CartFooter>
              <TotalLabel>Total:</TotalLabel>
              <TotalValue>R$ {getTotal()}</TotalValue>
              <CheckoutButton href="/checkout" onClick={onClose}>
                Finalizar Compra
              </CheckoutButton>
            </CartFooter>
          </>
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
  p { font-weight: bold; margin-bottom: 10px; }
  span { margin-bottom: 20px; }
`;

const ContinueShoppingButton = styled.button`
  background: #28a745;
  color: #fff;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;

  &:hover { background: #218838; }
`;

const ItemsWrapper = styled.div`
  max-height: 60%;
  overflow-y: auto;
  margin-bottom: 16px;
`;

const CartItem = styled.div`
  display: flex;
  margin-bottom: 16px;
`;

const ItemImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 12px;
`;

const ItemDetails = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  h4 { margin: 0; font-size: 1rem; }
  p  { margin: 2px 0; font-size: 0.9rem; }
`;

const CartFooter = styled.div`
  border-top: 1px solid #ddd;
  padding-top: 16px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 12px;
`;

const TotalLabel = styled.span`
  font-size: 1rem;
  font-weight: bold;
`;

const TotalValue = styled.span`
  font-size: 1.25rem;
  font-weight: bold;
`;

const CheckoutButton = styled(Link)`
  display: block;
  text-align: center;
  background: #ff5722;
  color: #fff;
  padding: 12px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;

  &:hover { background: #e64a19; }
`;
