// src/components/ProductSkeleton.tsx

'use client';

import React from 'react';

const ProductSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse flex flex-col items-center p-4 border rounded-md">
      <div className="w-full h-60 bg-gray-300 rounded-lg mb-4"></div>
      <div className="w-full">
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
      </div>
      <div className="flex space-x-2 mt-2">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="w-4 h-4 bg-gray-300 rounded-full"></div>
        ))}
      </div>
    </div>
  );
};

export default ProductSkeleton;