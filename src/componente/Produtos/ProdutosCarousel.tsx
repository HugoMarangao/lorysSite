'use client';

import React, { useState } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../../components/ui/carousel';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  price: string;
  promotion?: string;
  images: string[];
  colors: string[];
}

const ProductCarousel: React.FC<{ products: Product[] }> = ({ products }) => {
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const calculateDiscountPercentage = (price: string, promotion: string = '') => {
    const priceNumber = parseFloat(price);
    const promotionNumber = parseFloat(promotion);

    if (isNaN(priceNumber) || isNaN(promotionNumber) || promotionNumber >= priceNumber) {
      return null;
    }

    return Math.round(((priceNumber - promotionNumber) / priceNumber) * 100);
  };

  return (
    <div className="relative w-full overflow-hidden p-5 bg-gray-100 rounded-lg">
      <Carousel>
        <CarouselContent className="flex">
          {products.map((product) => {
            const discountPercentage = calculateDiscountPercentage(product.price, product.promotion);

            return (
              <CarouselItem
                key={product.id}
                className="flex-shrink-0 basis-3/5 sm:basis-1/3 md:basis-1/4 px-2"
              >
                <Link href={`/produtos/${product.id}`} passHref>
                  <div className="relative flex flex-col items-center cursor-pointer">
                    <div className="relative w-full h-96 overflow-hidden"> {/* Adiciona overflow-hidden */}
                      {discountPercentage && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold py-1 px-2 rounded z-10"> {/* Certifique-se que z-10 está aplicado */}
                          {`-${discountPercentage}%`}
                        </div>
                      )}
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        layout="fill" // Mantém o layout responsivo
                        objectFit="cover" // Garante que a imagem se ajuste corretamente
                        className="rounded-lg"
                      />
                    </div>
                    <div className="relative w-full mb-2 flex items-center justify-start">
                      {product.promotion ? (
                        <>
                          <div className="text-xl font-bold text-red-800">
                            {`R$ ${product.promotion}`}
                          </div>
                          <div className="ml-2 text-sm text-gray-500 line-through transform -translate-y-1">
                            {`R$ ${product.price}`}
                          </div>
                        </>
                      ) : (
                        <div className="text-xl font-bold text-gray-800">
                          {`R$ ${product.price}`}
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-center text-gray-600">
                      {product.name}
                    </div>
                    <div className="flex justify-center mt-2">
                      {product.colors.map((color, index) => (
                        <div key={index} className="w-4 h-4 rounded-full" style={{ backgroundColor: color }} />
                      ))}
                    </div>
                  </div>
                </Link>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        {/* Arrow Esquerda - Controlado por estado */}
        <CarouselPrevious
          className={`absolute left-0 flex items-center justify-center bg-white bg-opacity-50 w-10 h-full transition-opacity duration-300 ${
            showLeftArrow ? 'opacity-100' : 'opacity-0'
          } sm:hidden md:flex`}
          onMouseEnter={() => setShowLeftArrow(true)}
          onMouseLeave={() => setShowLeftArrow(false)}
        />

        {/* Arrow Direita - Controlado por estado */}
        <CarouselNext
          className={`absolute right-0 flex items-center justify-center bg-white bg-opacity-50 w-10 h-full transition-opacity duration-300 ${
            showRightArrow ? 'opacity-100' : 'opacity-0'
          } sm:hidden md:flex`}
          onMouseEnter={() => setShowRightArrow(true)}
          onMouseLeave={() => setShowRightArrow(false)}
        />
      </Carousel>
    </div>
  );
};

export default ProductCarousel;
