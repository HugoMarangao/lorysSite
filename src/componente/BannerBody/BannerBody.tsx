import React from 'react';
import styles from './BannerBody.module.css';
import Image from 'next/image';

const BannerBody: React.FC = () => {
  return (
    <div className={styles.bannerContainer}>
      <div className={styles.banner}>
        <Image
          src="/images/Banner/banner2.png"
          alt="Kids"
          layout="responsive"
          width={600}
          height={400}
          className={styles.image}
        />
      </div>
      <div className={styles.banner}>
        <Image
          src="/images/Banner/banner3.png"
          alt="Plus Size"
          layout="responsive"
          width={600}
          height={400}
          className={styles.image}
        />
      </div>
    </div>
  );
};

export default BannerBody;
