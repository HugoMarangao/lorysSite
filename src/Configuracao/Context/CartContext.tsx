// src/Configuracao/Context/CartContext.tsx
'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

interface Product {
  id: string;
  name: string;
  price: string;
  promotion?: string;
  images: string[];
  colors: string[];
  description: string;
  sizes: string[];
  selectedCategories: string[];
  selectedSubcategories: string[];
  selectedSize?: string;  // Adicionado
  selectedColor?: string; // Adicionado
}



interface CartContextType {
  cart: Product[];
  addToCart: (product: Product) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<Product[]>([]);

  const addToCart = (product: Product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
