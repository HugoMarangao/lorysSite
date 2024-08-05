"use client";

import React, { useState } from 'react';
import styles from './Header.module.css';
import Link from 'next/link';

const HeaderSecudaria: React.FC = () => {
  

  return (
    <header className={styles.header}>
      
      <div className={styles.headerMiddle}>
        <div className={styles.logo}>
          <Link href="/">
            <img src="/images/logo.png" alt="Logo" />
          </Link>
        </div>
          
        <img src="/images/HeaderIcons.png" alt="Logo" />
          
       </div>
    </header>
  );
};

export default HeaderSecudaria;
