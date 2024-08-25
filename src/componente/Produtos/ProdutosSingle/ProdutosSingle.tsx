'use client';

import styled from 'styled-components';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { useEffect } from 'react';
import { useCart } from '../../../Configuracao/Context/CartContext';
interface Product {
  id: string;
  name: string;
  price: string;
  promotion?: string;
  images: string[];
  colors: string[];
  description: string;
  sizes: string[];
  category: string;
  subcategory: string;
}


type ProductDetailsProps = {
  product: Product;
};


const ProductDetails = ({ product }: ProductDetailsProps) => {
  const { images, sizes, colors, name, price, promotion, description, category, subcategory } = product;
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
  };

  useEffect(() => {
    console.log("Produto carregado:", product);
  }, [product]);

  return (
    <Container>
      <Breadcrumb>
        <a href="/">Início</a> &gt; {category} &gt; {subcategory} &gt; {name}
      </Breadcrumb>
      <ProductWrapper>
        <ImageContainer>
          <Carousel showArrows={true} showThumbs={true} showIndicators={false} infiniteLoop={true}>
            {images.map((image, index) => (
              <img src={image} alt={name} key={index} />
            ))}
          </Carousel>
        </ImageContainer>
        <DetailsContainer>
          <ProductName>{name}</ProductName>
          <ProductPrice>
            {promotion && <DiscountPrice>R$ {price}</DiscountPrice>}
            <CurrentPrice>R$ {promotion || price}</CurrentPrice>
          </ProductPrice>
          
          <ProductColors>
            <ColorTitle>Cores Disponíveis:</ColorTitle>
            <Colors>
              {colors.map((color, index) => (
                <ColorOption key={index}>
                  <ColorCircle color={color} />
                  <ColorName>{color}</ColorName>
                </ColorOption>
              ))}
            </Colors>
          </ProductColors>
          <ProductSizes>
            <SizeTitle>Tamanhos Disponíveis:</SizeTitle>
            <Sizes>
              {sizes.map((size) => (
                <Size key={size}>{size}</Size>
              ))}
            </Sizes>
          </ProductSizes>
          <BuyButton onClick={handleAddToCart}>Comprar</BuyButton>
          <ProductDescription>{description}</ProductDescription>
        </DetailsContainer>
      </ProductWrapper>
    </Container>
  );
};

export default ProductDetails;

// Styled Components

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  margin: auto;
  background-color: #f5f5f5;
  color: #666;
`;

const Breadcrumb = styled.div`
  margin-bottom: 20px;
  font-size: 14px;
  color: #666;

  a {
    color: #0070f3;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
`;

const ProductWrapper = styled.div`
  display: flex;
  gap: 40px;
`;

const ImageContainer = styled.div`
  flex: 1;

  .carousel .slide img {
    width: 100%;
    height: auto;
    max-height: 500px;
    object-fit: cover;
  }

  .carousel .thumbs-wrapper {
    margin-top: 10px;
  }

  .carousel .thumb {
    border: 2px solid transparent;
  }

  .carousel .thumb.selected,
  .carousel .thumb:hover {
    border: 2px solid #0070f3;
  }
`;

const DetailsContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ProductName = styled.h1`
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const ProductPrice = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const DiscountPrice = styled.span`
  font-size: 18px;
  color: #999;
  text-decoration: line-through;
  margin-right: 10px;
`;

const CurrentPrice = styled.span`
  font-size: 24px;
  color: #ff5252;
  font-weight: bold;
`;

const ProductDescription = styled.p`
  margin-bottom: 20px;
  font-size: 16px;
  color: #666;
`;

const ProductColors = styled.div`
  margin-bottom: 20px;
`;

const ColorTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 10px;
`;

const Colors = styled.div`
  display: flex;
  gap: 10px;
`;

const ColorOption = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;

  img {
    width: 50px;
    height: 50px;
    border-radius: 5px;
    border: 1px solid #ddd;
    object-fit: cover;
  }

  &:hover img {
    border-color: #0070f3;
  }
`;

const ColorName = styled.span`
  font-size: 12px;
  color: #666;
  margin-top: 5px;
`;

const ProductSizes = styled.div`
  margin-bottom: 20px;
`;

const SizeTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 10px;
`;

const Sizes = styled.div`
  display: flex;
  gap: 10px;
`;

const Size = styled.div`
  padding: 10px 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background: #f5f5f5;
  }
`;

const BuyButton = styled.button`
  padding: 15px 30px;
  background: #ff5252;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 18px;
  align-self: start;

  &:hover {
    background: #ff7675;
  }
`;

const ColorCircle = styled.div<{ color: string }>`
  width: 30px;
  height: 30px;
  background-color: ${({ color }) => color};
  border-radius: 50%;
  border: 1px solid #ddd;
`;
