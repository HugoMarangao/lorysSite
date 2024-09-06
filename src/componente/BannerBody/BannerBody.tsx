'use client';

import React from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import Image from 'next/image';

const BannerBody: React.FC = () => {
  return (
    <div className="flex flex-wrap md:flex-nowrap justify-between gap-4 px-4 md:px-8 lg:px-12">
      <div className="w-full md:w-[50%] lg:w-[50%]">
        <AspectRatio ratio={3 / 1} className="relative">
          <Image
            src="/images/Banner/banner2.png"
            alt="Kids"
            layout="fill"
            className="object-cover rounded-lg"
          />
        </AspectRatio>
      </div>
      <div className="w-full md:w-[50%] lg:w-[50%]">
        <AspectRatio ratio={3 / 1} className="relative">
          <Image
            src="/images/Banner/banner3.png"
            alt="Plus Size"
            layout="fill"
            className="object-cover rounded-lg"
          />
        </AspectRatio>
      </div>
    </div>
  );
};

export default BannerBody;
