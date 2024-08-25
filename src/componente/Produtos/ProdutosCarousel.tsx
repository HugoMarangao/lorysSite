import React from 'react';
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
        <CarouselContent className="-ml-4">
          {products.map((product) => {
            const discountPercentage = calculateDiscountPercentage(product.price, product.promotion);

            return (
              <CarouselItem key={product.id} className="pl-4 md:basis-1/2 lg:basis-1/4">
                <Link href={`/produtos/${product.id}`} passHref>
                  <div className="relative rounded-lg flex flex-col items-center cursor-pointer">
                    {discountPercentage && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold py-1 px-2 rounded">
                        {`-${discountPercentage}%`}
                      </div>
                    )}
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      width={300}
                      height={200}
                      className="rounded-lg mb-3"
                      style={{ objectFit: 'cover' }}
                    />
                    <div className="relative w-full mb-2 flex items-center">
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
        <CarouselPrevious className="absolute left-0 flex bg-white bg-opacity-50 w-10 h-full" />
        <CarouselNext className="absolute right-0 flex bg-white bg-opacity-50 w-10 h-full" />
      </Carousel>
    </div>
  );
};

export default ProductCarousel;
