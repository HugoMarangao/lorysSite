'use client';

import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import styled from 'styled-components';
import Image from 'next/image';

const SliderContainer = styled.div`
  max-width: 100%;
  margin: auto;
  position: relative;
  padding: 30px; /* Padding para dar espaço dentro do contêiner */
  border-radius: 10px; /* Bordas arredondadas */
  overflow: hidden; /* Garantir que o conteúdo respeite o border-radius */
  

  .carousel .control-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    height: 50px;
    width: 50px;
  }

  .carousel .control-arrow:hover {
    background: rgba(0, 0, 0, 0.8);
  }

  .carousel .control-prev.control-arrow {
    left: 10px;
  }

  .carousel .control-next.control-arrow {
    right: 10px;
  }

  .carousel .control-dots {
    display: flex !important;
    justify-content: center;
    position: absolute;
    bottom: 20px;
    width: 100%;
  }

  .carousel .control-dots .dot {
    background: #333;
    border-radius: 0;
    width: 30px;
    height: 5px;
    margin: 0 5px;
  }

  .carousel .control-dots .dot.selected {
    background: #fff;
  }
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px; /* Bordas arredondadas para as imagens */
  overflow: hidden; /* Garantir que o conteúdo respeite o border-radius */
`;

const BannerImage = styled(Image)`
  width: 100%;
  height: 400px;
  
`;
const FooterImage = styled(Image)`
  display: block;
  margin: 20px auto;
  width: auto;
  height: 100px; /* Ajuste conforme necessário */
`;
const BannerPrincipal: React.FC = () => {
  return (
    <>
      <SliderContainer>
          <Carousel
            showArrows={true}
            showThumbs={false}
            showStatus={false}
            infiniteLoop={true}
            autoPlay={true}
            interval={5000}
          >
            <div>
              <ImageContainer>
                <BannerImage src="/images/Banner/banner1.png" alt="Banner 1" width={1920} height={600} />
              </ImageContainer>
            </div>
            <div>
              <ImageContainer>
                <BannerImage src="/images/Banner/banner2.png" alt="Banner 2" width={1920} height={600} />
              </ImageContainer>
            </div>
            <div>
              <ImageContainer>
                <BannerImage src="/images/Banner/banner3.png" alt="Banner 3" width={1920} height={600} />
              </ImageContainer>
            </div>
          </Carousel>
      </SliderContainer> 
      <FooterImage src="/images/Banner/frente.png" alt="Frete" width={1200} height={150} />
    </>
  );
};

export default BannerPrincipal;
