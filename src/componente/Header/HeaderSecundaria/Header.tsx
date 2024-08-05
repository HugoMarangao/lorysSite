"use client";

import React, { useState } from 'react';
import styles from './Header.module.css';
import Link from 'next/link';
import Image from 'next/image';

const HeaderSecudaria: React.FC = () => {
  

  return (
    <header className={styles.header}>
      
      <div className={styles.headerMiddle}>
        <div className={styles.logo}>
          <Link href="/">
            <Image
                src="/images/logo.png"
                alt="Logo"
                width={200}
                height={100}
                className={styles.logo}
              />
          </Link>
        </div>
          
        <img src="/images/HeaderIcons.png" alt="Logo" />
          
       </div>
    </header>
  );
};

export default HeaderSecudaria;
