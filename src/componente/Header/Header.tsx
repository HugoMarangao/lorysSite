'use client';

import React, { useState } from 'react';
import styles from './Header.module.css';
import { FiUser, FiHeart, FiShoppingBag, FiSearch, FiMenu } from 'react-icons/fi';
import Link from 'next/link';
import { useAuth } from '../../Configuracao/Context/AuthContext';
import { useCart } from '../../Configuracao/Context/CartContext';

const Header: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const { cart } = useCart();
  const { user, logout } = useAuth();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    const newSuggestions = ["Vestidos", "Vestido Lilica", "Vestido Longo", "Vestidos Festa", "Vestidos Plus Size", "Vestido Médio", "Vestido Jeans", "Vestidos Evangelicos", "Vestido Infantil"];
    setSuggestions(newSuggestions);
  };

  const handleMouseEnter = (category: string) => {
    setActiveCategory(category);
  };

  const handleMouseLeave = () => {
    setActiveCategory(null);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
  };

  const getFirstName = (fullName: string | null) => {
    if (!fullName) return '';
    return fullName.split(' ')[0];
  };


  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const price = parseFloat(item.price.replace('R$', '').replace(',', '.'));
      return total + price;
    }, 0).toFixed(2).replace('.', ',');
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerTop}>
        <p>Frete Grátis Sul e Sudeste R$99* - Cupom QUEROAGORA</p>
      </div>
      <div className={styles.headerMiddle}>
        <div className={styles.logo}>
          <Link href="/">
            <img src="/images/logo.png" alt="Logo" />
          </Link>
        </div>
        <div className={styles.searchContainer}>
          <input 
            type="text" 
            placeholder="O que você procura?" 
            className={styles.searchInput} 
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button className={styles.searchButton}>
            <FiSearch size={24} color='#000'/>
          </button>
          {searchTerm && (
            <div className={styles.suggestions}>
              {suggestions.map((suggestion, index) => (
                <div key={index} className={styles.suggestion}>
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className={styles.icons}>
          {user ? (
            <div className={styles.userMenu} onClick={toggleMenu}>
              <FiUser size={35}/>
              <span>Olá, {getFirstName(user.nome )|| user.email}</span>
              {menuOpen && (
                <div className={styles.dropdownMenu}>
                  <Link href="/compra-rapida">Compra Rápida</Link>
                  <Link href="/meus-pedidos">Meus Pedidos</Link>
                  <Link href="/catalogo-digital">Meu Catálogo Digital</Link>
                  <Link href="/meus-dados">Meus Dados</Link>
                  <button onClick={handleLogout}>Sair</button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login">
              
                <FiUser size={35}/>
              
            </Link>
          )}
          <button className={styles.iconButton}><FiHeart size={35}/></button>
          <div className={styles.cartContainer}>
            {cart.length >= 0 && (
              <div className={styles.cartBadge}>{cart.length}</div>
            )}
            <FiShoppingBag size={35}/>
            <span>R$ {getTotalPrice()}</span>
            
          </div>
        </div>
      </div>
      <div className={styles.headerBottom}>
        <nav className={styles.navbar}>
          <ul className={styles.navList}>
            <li className={styles.navItem} onMouseEnter={() => handleMouseEnter('Categorias')} onMouseLeave={handleMouseLeave}>
              Categorias
              {activeCategory === 'Categorias' && (
                <div className={styles.dropdown}>
                  <ul>
                    <li>Moda Feminina</li>
                    <li>Plus Size Feminino</li>
                    <li>Moda Evangélica</li>
                    <li>Roupa para Menina</li>
                    <li>Roupa para Menino</li>
                    <li>Moda Masculina</li>
                    <li>Escolhas das Influencers</li>
                    <li>Tendências</li>
                    <li>Lingerie</li>
                    <li>Moda Praia</li>
                    <li>Moda Fitness</li>
                    <li>Pijamas</li>
                    <li>Plus Size Masculino</li>
                    <li>Calçado Feminino</li>
                    <li>Calçado Masculino</li>
                    <li>Calçado para menina</li>
                    <li>Calçado para menino</li>
                    <li>Acessório Feminino</li>
                    <li>Acessório Masculino</li>
                    <li>Acessório para Menina</li>
                    <li>Acessório para Menino</li>
                  </ul>
                </div>
              )}
            </li>
            <li className={styles.navItem} onMouseEnter={() => handleMouseEnter('Feminino')} onMouseLeave={handleMouseLeave}>
              Feminino
              {activeCategory === 'Feminino' && (
                <div className={styles.submenu}>
                  <div className={styles.submenuContent}>
                    <div className={styles.submenuCategories}>
                      <strong>Moda Feminina</strong>
                      <ul>
                        <li>Blusas</li>
                        <li>Vestidos</li>
                        <li>Calças</li>
                        <li>Casacos</li>
                        <li>Saias</li>
                        <li>Shorts</li>
                        <li>Macacão</li>
                        <li>Camisas</li>
                        <li>Conjunto</li>
                        <li>Colete</li>
                      </ul>
                    </div>
                    <div className={styles.submenuImage}>
                      <img src="/images/Banner/banner3.png" alt="Moda Feminina" />
                    </div>
                  </div>
                </div>
              )}
            </li>
            <li className={styles.navItem}>Masculino</li>
            <li className={styles.navItem}>Plus Size</li>
            <li className={`${styles.navItem} ${styles.hideOnMobile}`}>Meninas</li>
            <li className={`${styles.navItem} ${styles.hideOnMobile}`}>Meninos</li>
            <li className={`${styles.navItem} ${styles.hideOnMobile}`}>Calçados</li>
            <li className={`${styles.navItem} ${styles.hideOnMobile}`}>Pijamas</li>
            <li className={`${styles.navItem} ${styles.hideOnMobile}`}>Cama</li>
            <li className={`${styles.navItem} ${styles.hideOnMobile}`}>Marcas</li>
            <li className={`${styles.navItem} ${styles.hideOnMobile}`}>Novidades</li>
            <li className={`${styles.navItem} ${styles.hideOnMobile}`}>Promoções</li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
