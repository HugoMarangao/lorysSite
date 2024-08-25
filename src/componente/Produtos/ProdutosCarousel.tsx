'use client';

import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import styled from 'styled-components';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '../../Configuracao/Firebase/firebaseConf';
import { collection, getDocs } from 'firebase/firestore';

interface Product {
  id: string;
  name: string;
  price: string;
  promotion?: string;
  images: string[];
  colors: string[];
}

const SliderContainer = styled.div`
  max-width: 100%;
  margin: auto;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 10px;
`;

const ProductWrapper = styled.div`
  position: relative;
  width: 280px;
  margin: auto;
`;

const ProductContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  border-radius: 10px;
  background: #f5f5f5;
  width: 100%;
`;

const ProductImage = styled(Image)`
  border-radius: 10px;
  margin-bottom: 10px;
  width: 500px;
  height: 350px;
  object-fit: cover;
`;

const ProductName = styled.div`
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 5px;
  text-align: center;
  color: #333;
`;

const ProductPrice = styled.div<{ $hasDiscount: boolean }>`
  font-size: 24px;
  color: ${({ $hasDiscount }) => ($hasDiscount ? '#ff5252' : '#333')};
  font-weight: bold;
  margin-right: 5px;
`;

const ProductDiscount = styled.div`
  font-size: 12px;
  color: #999;
  text-decoration: line-through;
`;

const PriceContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 100%;
  padding-right: 10px;
`;

const ColorDots = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
`;

const Dot = styled.div<{ color: string }>`
  width: 15px;
  height: 15px;
  background-color: ${({ color }) => color};
  border-radius: 50%;
  margin: 0 5px;
`;

const DiscountBadge = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  background: #ff5252;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 12px;
  font-weight: bold;
  z-index: 1;
`;

const ProductCarousel: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [centerSlidePercentage, setCenterSlidePercentage] = useState(0);

  const updateSlidePercentage = () => {
    const width = window.innerWidth;
    if (width <= 768) {
      setCenterSlidePercentage(50); // 2 items for mobile view
    } else {
      setCenterSlidePercentage(25); // 4 items for larger screens
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
      setProducts(productsList);
    };

    fetchProducts();
    updateSlidePercentage();
    window.addEventListener('resize', updateSlidePercentage);

    return () => {
      window.removeEventListener('resize', updateSlidePercentage);
    };
  }, []);

  const calculateDiscountPercentage = (price: string, promotion: string = '') => {
    const priceNumber = parseFloat(price);
    const promotionNumber = parseFloat(promotion);

    if (isNaN(priceNumber) || isNaN(promotionNumber) || promotionNumber >= priceNumber) {
      return null;
    }

    return Math.round(((priceNumber - promotionNumber) / priceNumber) * 100);
  };

  return (
    <SliderContainer>
      <Carousel
        showArrows={true}
        showThumbs={false}
        showIndicators={false}
        showStatus={false}
        infiniteLoop={true}
        autoPlay={true}
        interval={5000}
        centerMode={true}
        centerSlidePercentage={centerSlidePercentage}
      >
        {products.map((product) => {
          const discountPercentage = calculateDiscountPercentage(product.price, product.promotion);

          return (
            <ProductWrapper key={product.id}>
              {discountPercentage && (
                <DiscountBadge>
                  {`-${discountPercentage}%`}
                </DiscountBadge>
              )}
              <Link href={`/produtos/${product.id}`} passHref legacyBehavior>
                <ProductContainer>
                  <ProductImage src={product.images[0]} alt={product.name} width={500} height={350} />
                  <PriceContainer>
                    <ProductPrice $hasDiscount={!!product.promotion}>
                      {product.promotion ? `R$ ${product.promotion}` : `R$ ${product.price}`}
                    </ProductPrice>
                    {product.promotion && <ProductDiscount>{`R$ ${product.price}`}</ProductDiscount>}
                  </PriceContainer>
                  <ProductName>{product.name}</ProductName>
                  <ColorDots>
                    {product.colors.map((color, index) => (
                      <Dot key={index} color={color} />
                    ))}
                  </ColorDots>
                </ProductContainer>
              </Link>
            </ProductWrapper>
          );
        })}
      </Carousel>
    </SliderContainer>
  );
};

export default ProductCarousel;
