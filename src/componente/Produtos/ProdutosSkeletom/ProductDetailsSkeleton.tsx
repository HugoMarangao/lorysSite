// src/components/ProductDetailsSkeleton.tsx

'use client';

import React from 'react';

const ProductDetailsSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col p-5 mx-auto bg-gray-100 text-gray-600 animate-pulse">
      {/* Breadcrumb */}
      <div className="mb-5 h-4 bg-gray-300 w-1/2"></div>
      <div className="flex flex-col md:flex-row gap-10">
        {/* Imagem */}
        <div className="flex-1 max-w-xl mx-auto">
          <div className="w-full h-80 bg-gray-300 rounded-lg"></div>
          <div className="hidden md:flex mt-4 space-x-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="w-20 h-20 bg-gray-300 rounded-lg"></div>
            ))}
          </div>
        </div>
        {/* Detalhes do Produto */}
        <div className="flex-1 flex flex-col">
          <div className="h-8 bg-gray-300 w-3/4 mb-4"></div>
          <div className="h-6 bg-gray-300 w-1/4 mb-5"></div>
          {/* Cores */}
          <div className="mb-5">
            <div className="h-6 bg-gray-300 w-1/4 mb-2"></div>
            <div className="flex gap-3">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="w-10 h-10 bg-gray-300 rounded-full"></div>
              ))}
            </div>
          </div>
          {/* Tamanhos */}
          <div className="mb-5">
            <div className="h-6 bg-gray-300 w-1/4 mb-2"></div>
            <div className="flex gap-3">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="w-12 h-8 bg-gray-300 rounded-md"></div>
              ))}
            </div>
          </div>
          <div className="w-full h-12 bg-gray-300 rounded-md mb-5"></div>
          <div className="h-24 bg-gray-300 w-full"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsSkeleton;