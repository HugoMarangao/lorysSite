// src/componente/BannerPrincipal/BannerPrincipal.tsx
'use client';

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import { Carousel, CarouselContent, CarouselItem } from '../../components/ui/carousel';
import Image from 'next/image';

interface Banner {
  id: string;
  link: string;
  image: string;
}

const BannerPrincipal: React.FC<{ banners: Banner[] }> = React.memo(({ banners }) => {
  const length = banners.length;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const intervalRef = useRef<number>();

  // avança a cada 5s, limpa e refaz sempre que mudar o número de banners
  useEffect(() => {
    if (intervalRef.current !== undefined) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = window.setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % length);
    }, 5000);
    return () => {
      if (intervalRef.current !== undefined) {
        clearInterval(intervalRef.current);
      }
    };
  }, [length]);

  const goToSlide = useCallback((idx: number) => {
    setCurrentSlide(idx);
  }, []);

  const handlePointerDown = useCallback(() => setIsDragging(true), []);
  const handlePointerUp = useCallback(() => setIsDragging(false), []);

  return (
    <div className="relative w-full overflow-hidden bg-gray-100 rounded-lg">
      <Carousel>
        <CarouselContent
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="flex"
          style={{
            transform: `translateX(-${currentSlide * 100}%)`,
            transition: isDragging ? 'none' : 'transform 0.5s ease-in-out',
          }}
        >
          {banners.map((b, i) => (
            <CarouselItem key={b.id} className="w-full flex-shrink-0">
              <a href={b.link} target="_blank" rel="noopener noreferrer" className="block">
                <div className="relative w-full aspect-[16/7]">
                  <Image
                    src={b.image}
                    alt={`Banner ${b.id}`}
                    fill
                    className="object-cover object-center"
                    priority={i === 0}
                    loading={i === 0 ? undefined : 'lazy'}
                  />
                </div>
              </a>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* indicadores */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`h-1 w-10 ${currentSlide === i ? 'bg-blue-500' : 'bg-gray-400'}`}
              aria-label={`Ir para o slide ${i + 1}`}
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
          priority
        />
      </div>
    </div>
  );
});

BannerPrincipal.displayName = 'BannerPrincipal';

export default BannerPrincipal;