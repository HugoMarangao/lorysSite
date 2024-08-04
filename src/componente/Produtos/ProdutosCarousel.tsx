'use client';

import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import styled from 'styled-components';
import Image from 'next/image';
import Link from 'next/link';
import { products } from './prducts';

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
  const [centerSlidePercentage, setCenterSlidePercentage] = useState(25);

  const updateSlidePercentage = () => {
    const width = window.innerWidth;
    if (width <= 768) {
      setCenterSlidePercentage(50); // 2 items for mobile view
    } else {
      setCenterSlidePercentage(25); // 4 items for larger screens
    }
  };

  useEffect(() => {
    updateSlidePercentage();
    window.addEventListener('resize', updateSlidePercentage);
    return () => {
      window.removeEventListener('resize', updateSlidePercentage);
    };
  }, []);

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
        {products.map((product) => (
          <ProductWrapper key={product.id}>
            {product.discount && (
              <DiscountBadge>
                {`-${Math.round(
                  ((parseFloat(product.discount.replace(/[^0-9,]/g, '').replace(',', '.')) - parseFloat(product.price.replace(/[^0-9,]/g, '').replace(',', '.'))) /
                    parseFloat(product.discount.replace(/[^0-9,]/g, '').replace(',', '.'))) *
                    100
                )}%`}
              </DiscountBadge>
            )}
            <Link href={`/produtos/${product.id}`} passHref legacyBehavior>
              <ProductContainer>
                <ProductImage src={product.images[0]} alt={product.name} width={500} height={350} />
                <PriceContainer>
                  <ProductPrice $hasDiscount={!!product.discount}>{product.price}</ProductPrice>
                  {product.discount && <ProductDiscount>{product.discount}</ProductDiscount>}
                </PriceContainer>
                <ProductName>{product.name}</ProductName>
                <ColorDots>
                  {product.colors.map((color, index) => (
                    <Dot key={index} color={color.color} />
                  ))}
                </ColorDots>
              </ProductContainer>
            </Link>
          </ProductWrapper>
        ))}
      </Carousel>
    </SliderContainer>
  );
};

export default ProductCarousel;
