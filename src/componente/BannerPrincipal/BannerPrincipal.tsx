'use client';

import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import styled from 'styled-components';
import Image from 'next/image';
import { db } from '../../Configuracao/Firebase/firebaseConf';
import { collection, getDocs } from 'firebase/firestore';

const SliderContainer = styled.div`
  max-width: 100%;
  margin: auto;
  position: relative;
  padding: 30px;
  border-radius: 10px;
  overflow: hidden;

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
  border-radius: 10px;
  overflow: hidden;
`;

const BannerImage = styled(Image)`
  width: 100%;
  height: 400px;
`;

const FooterImage = styled(Image)`
  display: block;
  margin: 20px auto;
  width: auto;
  height: 100px;
`;

const BannerPrincipal: React.FC = () => {
  const [banners, setBanners] = useState<{ id: string, link: string, image: string }[]>([]);

  useEffect(() => {
    const fetchBanners = async () => {
      const querySnapshot = await getDocs(collection(db, 'banners'));
      const bannersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as { id: string, link: string, image: string }[];
      setBanners(bannersList);
    };

    fetchBanners();
  }, []);

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
          {banners.map((banner) => (
            <div key={banner.id}>
              <ImageContainer>
                <a href={banner.link} target="_blank" rel="noopener noreferrer">
                  <BannerImage src={banner.image} alt={`Banner ${banner.id}`} width={1920} height={600} />
                </a>
              </ImageContainer>
            </div>
          ))}
        </Carousel>
      </SliderContainer>
      <FooterImage src="/images/Banner/frente.png" alt="Frete" width={1200} height={150} />
    </>
  );
};

export default BannerPrincipal;
