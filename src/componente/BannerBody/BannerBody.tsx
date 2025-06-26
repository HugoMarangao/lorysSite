// src/componente/BannerBody/BannerBody.tsx
import React from 'react';
import Image from 'next/image';

interface Banner {
  id: string;
  image: string;
  alt: string;
  link?: string;
}

const BannerBody: React.FC<{ banners: Banner[] }> = ({ banners }) => {
  return (
    <div className="flex flex-wrap justify-between gap-4 px-4 md:px-8 lg:px-12 py-6">
      {banners.map((banner) => (
        <a
          key={banner.id}
          href={banner.link ?? '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full sm:w-1/2 lg:w-1/3 overflow-hidden rounded-lg shadow-md bg-white"
        >
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <Image
              src={banner.image}
              alt={banner.alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
              loading="lazy"
            />
          </div>
        </a>
      ))}
    </div>
  );
};

export default React.memo(BannerBody);