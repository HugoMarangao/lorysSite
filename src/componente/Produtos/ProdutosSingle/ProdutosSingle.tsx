'use client';

import React, { useState, useCallback } from 'react';
import { Carousel, CarouselContent, CarouselItem } from '../../../components/ui/carousel';
import Image from 'next/image';
import { useCart } from '../../../Configuracao/Context/CartContext';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  price: string;
  promotion?: string;
  images: string[];
  colors: string[];
  description: string;
  sizes: string[];
  selectedCategories: string[];
  selectedSubcategories: string[];
}

type ProductDetailsProps = {
  product: Product;
};

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const {
    images,
    sizes,
    colors,
    name,
    price,
    promotion,
    description,
    selectedCategories,
  } = product;

  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const handleAddToCart = useCallback(() => {
    if (!selectedSize || !selectedColor) {
      alert('Por favor, selecione um tamanho e uma cor antes de adicionar ao carrinho.');
      return;
    }
    addToCart({ ...product, selectedSize, selectedColor });
  }, [addToCart, product, selectedSize, selectedColor]);

  return (
    <div className="flex flex-col p-5 mx-auto bg-gray-100 text-gray-600">
      {/* Breadcrumb */}
      <div className="mb-5 text-sm text-gray-600">
        <Link href="/" className="text-blue-600 hover:underline">
          Início
        </Link>{' '}
        &gt;{' '}
        {selectedCategories.map((category, index) => (
          <React.Fragment key={index}>
            <Link
              href={`/categoria/${category.toLowerCase()}`}
              className="text-blue-600 hover:underline"
            >
              {category}
            </Link>{' '}
            &gt;{' '}
          </React.Fragment>
        ))}
        <span>{name}</span>
      </div>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Imagens do Produto */}
        <div className="flex-1 max-w-xl mx-auto">
          <Carousel>
            <CarouselContent className="-ml-4">
              {images.map((img, idx) => (
                <CarouselItem key={idx}>
                  <Image
                    src={img}
                    alt={`${name} - Imagem ${idx + 1}`}
                    width={600}
                    height={600}
                    className="rounded-lg"
                    style={{ objectFit: 'cover' }}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Miniaturas (desktop) */}
          <div className="hidden md:flex mt-4 space-x-4">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => {
                  /* lógica para trocar imagem, se desejado */
                }}
                className="border rounded-lg"
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  width={80}
                  height={80}
                  className="rounded-lg"
                  style={{ objectFit: 'cover' }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Detalhes do Produto */}
        <div className="flex-1 flex flex-col">
          <h1 className="text-2xl font-bold mb-4">{name}</h1>

          <div className="flex items-baseline mb-5 space-x-2">
            <span className={`text-2xl font-bold ${promotion ? 'text-red-600' : 'text-gray-800'}`}>
              R$ {promotion || price}
            </span>
            {promotion && (
              <span className="text-lg text-gray-500 line-through transform -translate-y-1">
                R$ {price}
              </span>
            )}
          </div>

          {/* Seleção de Cores */}
          <div className="mb-5">
            <h3 className="text-lg mb-2">Cores Disponíveis:</h3>
            <div className="flex gap-3">
              {colors.map((color, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedColor(color)}
                  className={`cursor-pointer w-10 h-10 rounded-full border ${
                    selectedColor === color ? 'border-blue-500' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            {selectedColor && (
              <div className="text-xs text-gray-600 mt-2">Cor selecionada: {selectedColor}</div>
            )}
          </div>

          {/* Seleção de Tamanhos */}
          <div className="mb-5">
            <h3 className="text-lg mb-2">Tamanhos Disponíveis:</h3>
            <div className="flex gap-3">
              {sizes.map((size) => (
                <div
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`cursor-pointer px-4 py-2 border rounded-md ${
                    selectedSize === size ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {size}
                </div>
              ))}
            </div>
            {selectedSize && (
              <div className="text-xs text-gray-600 mt-2">Tamanho selecionado: {selectedSize}</div>
            )}
          </div>

          {/* Botão de Compra */}
          <button
            onClick={handleAddToCart}
            className="px-8 py-4 bg-red-600 text-white rounded-md text-lg hover:bg-red-700"
          >
            Comprar
          </button>

          {/* Descrição */}
          <p className="mt-5 text-base text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProductDetails);