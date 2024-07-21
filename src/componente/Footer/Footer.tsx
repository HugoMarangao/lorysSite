import React from 'react';
import styles from './Footer.module.css';
import Image from 'next/image';
import { FaFacebookF, FaInstagram, FaTiktok ,FaGooglePlay, FaApple } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.socialSection}>
        <h3>Acompanhe a gente</h3>
        <div className={styles.socialIcons}>
          <FaFacebookF size={25}/>
          <FaInstagram size={25}/>
          <FaTiktok size={25}/>
        </div>
      </div>
      <div className={styles.linksSection}>
        <div>
          <h3>Importante</h3>
          <ul>
            <li>Vendas e Entrega</li>
            <li>Regulamento</li>
            <li>Formas de Pagamento</li>
            <li>Política de Privacidade</li>
            <li>Contrato Compra e Venda</li>
          </ul>
        </div>
        <div>
          <h3>Atendimento</h3>
          <ul>
            <li>Central de Atendimento</li>
            <li>Trocas e Devoluções</li>
            <li>Código do Consumidor</li>
            <li>Procon</li>
            <li>Posthaus é Confiável</li>
          </ul>
        </div>
        <div>
          <h3>Institucional</h3>
          <ul>
            <li>Sobre a Posthaus</li>
            <li>Venda na Posthaus</li>
            <li>Moda pra Gente</li>
            <li>Podcast da Posthaus</li>
          </ul>
        </div>
        <div>
          <h3>Dicas</h3>
          <ul>
            <li>Guia de Medidas</li>
            <li>Vitrine de Moda</li>
            <li>Black Friday</li>
          </ul>
        </div>
        <div>
          <h3>Minha Conta</h3>
          <ul>
            <li>Meus Dados</li>
            <li>Meus Pedidos</li>
            <li>Lista de Desejos</li>
            <li>Sacola de compras</li>
          </ul>
        </div>
      </div>
      <hr/>
      <div className={styles.bottomSection}>
        <div className={styles.paymentSection}>
          <h3>Formas de pagamento</h3>
          <div className={styles.paymentIcons}>
            <Image src="/images/footer/pagamento.png" alt="Visa" width={550} height={30} />
          </div>
        </div>
        <div className={styles.securitySection}>
          <h3>Segurança</h3>
          <div className={styles.securityIcons}>
            <Image src="/images/footer/seguranca.png" alt="RA1000" width={550} height={30} />
           
          </div>
        </div>
        <div className={styles.appSection}>
          <h3>Baixe o app</h3>
          <div className={styles.appIcons}>
            <FaGooglePlay size={40} />
            <FaApple size={40} />
          </div>
         
        </div>
      </div>
      <hr/>
      <div className={styles.companyInfo}>
        <Image src="/images/logo.png" alt="logo" width={150} height={150} />
        <p>Posthaus é uma marca da Posthaus Ltda / CNPJ: 80.462.138/0001-41</p>
        <p>Endereço: Rua Werner Duwe, 202 Bairro Badenfurt - 89.070-700 - Blumenau/SC</p>
      </div>
    </footer>
  );
};

export default Footer;
