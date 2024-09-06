'use client';

import React, { useState, useEffect } from 'react';
import { Carousel, CarouselContent, CarouselItem } from '../../components/ui/carousel'; // Ajuste o caminho conforme necessário
import Image from 'next/image';

interface Banner {
  id: string;
  link: string;
  image: string;
}

const BannerPrincipal: React.FC<{ banners: Banner[] }> = ({ banners }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Função para mudar o slide automaticamente a cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000); // Tempo em milissegundos (5000ms = 5s)

    return () => clearInterval(interval); // Limpar o intervalo quando o componente for desmontado
  }, [banners.length]);


  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative w-full overflow-hidden bg-gray-100 rounded-lg">
      <Carousel>
        <CarouselContent
          className="flex transition-transform duration-500"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {banners.map((banner) => (
            <CarouselItem key={banner.id} className="w-full flex-shrink-0">
              <a href={banner.link} target="_blank" rel="noopener noreferrer" className="block">
                <div className="relative overflow-hidden">
                  <Image
                    src={banner.image}
                    alt={`Banner ${banner.id}`}
                    width={1920}
                    height={600}
                    className="object-cover"
                  />
                </div>
              </a>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Indicadores com Linhas */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-1 w-10 ${currentSlide === index ? 'bg-blue-500' : 'bg-gray-400'}`}
              aria-label={`Ir para o slide ${index + 1}`}
            />
          ))}
        </div>

    
      </Carousel>

      <div className="mt-8">
        <Image
          src="/images/Banner/frente.png"
          alt="Frete"
          width={1200}
          height={150}
          className="mx-auto"
        />
      </div>
    </div>
  );
};

export default BannerPrincipal;
