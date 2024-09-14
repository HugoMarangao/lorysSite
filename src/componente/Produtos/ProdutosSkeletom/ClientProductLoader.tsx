// src/components/Produtos/ClientProductLoader.tsx
'use client';

import React, { useState, useEffect } from 'react';
import ProductDetails from '../ProdutosSingle/ProdutosSingle';
import ProductDetailsSkeleton from './ProductDetailsSkeleton';
import { db } from '../../../Configuracao/Firebase/firebaseConf';
import { doc, getDoc, collection } from 'firebase/firestore';

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
  selectedSize?: string;
  selectedColor?: string;
}

type ClientProductLoaderProps = {
  productId: string;
};

const ClientProductLoader: React.FC<ClientProductLoaderProps> = ({ productId }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(collection(db, 'products'), productId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          setLoading(false);
          return;
        }

        const productData = docSnap.data();
        setProduct({
          id: docSnap.id,
          name: productData.name || '',
          price: productData.price || '',
          promotion: productData.promotion || '',
          images: productData.images || [],
          colors: productData.colors || [],
          description: productData.description || '',
          sizes: productData.sizes || [],
          selectedCategories: productData.selectedCategories || [],
          selectedSubcategories: productData.selectedSubcategories || [],
        });
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar o produto:', error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return <ProductDetailsSkeleton />;
  }

  if (!product) {
    return <div>Produto não encontrado.</div>;
  }

  return <ProductDetails product={product} />;
};

export default ClientProductLoader;