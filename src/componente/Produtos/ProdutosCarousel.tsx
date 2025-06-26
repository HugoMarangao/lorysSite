'use client';

import React, {
  useState,
  useMemo,
  useCallback,
  memo,
} from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../../components/ui/carousel';
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

function calculateDiscountPercentage(price: string, promotion: string = ''): number | null {
  const priceNumber = parseFloat(price);
  const promotionNumber = parseFloat(promotion);
  if (isNaN(priceNumber) || isNaN(promotionNumber) || promotionNumber >= priceNumber) {
    return null;
  }
  return Math.round(((priceNumber - promotionNumber) / priceNumber) * 100);
}

const ProductCarousel: React.FC<{ products: Product[] }> = ({ products }) => {
  const [showArrows, setShowArrows] = useState(false);

  const productsWithDiscount = useMemo(() => {
    return products.map((prod) => ({
      ...prod,
      discount: calculateDiscountPercentage(prod.price, prod.promotion || ''),
    }));
  }, [products]);

  const handleMouseEnter = useCallback(() => setShowArrows(true), []);
  const handleMouseLeave = useCallback(() => setShowArrows(false), []);

  return (
    <div
      className="relative w-full overflow-hidden p-5 bg-gray-100 rounded-lg"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Carousel>
        <CarouselContent className="flex">
          {productsWithDiscount.map((product) => (
            <CarouselItem
              key={product.id}
              className="flex-shrink-0 basis-3/5 sm:basis-1/3 md:basis-1/4 px-2"
            >
              <Link
                href={`/produtos/${product.id}`}
                className="relative flex flex-col items-center cursor-pointer"
              >
                <div className="relative w-full h-96 overflow-hidden">
                  {product.discount !== null && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold py-1 px-2 rounded z-10">
                      {`-${product.discount}%`}
                    </div>
                  )}
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    objectFit="cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
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
                  {product.colors.map((color, idx) => (
                    <div
                      key={idx}
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious
          className={`absolute left-0 flex items-center justify-center bg-white bg-opacity-50 w-10 h-full transition-opacity duration-300 ${
            showArrows ? 'opacity-100' : 'opacity-0'
          } sm:hidden md:flex`}
        />

        <CarouselNext
          className={`absolute right-0 flex items-center justify-center bg-white bg-opacity-50 w-10 h-full transition-opacity duration-300 ${
            showArrows ? 'opacity-100' : 'opacity-0'
          } sm:hidden md:flex`}
        />
      </Carousel>
    </div>
  );
};

export default memo(ProductCarousel);