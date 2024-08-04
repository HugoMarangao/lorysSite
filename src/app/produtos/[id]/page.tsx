// src/app/produtos/[id]/page.tsx
import { notFound } from 'next/navigation';
import { products } from '../../../componente/Produtos/prducts';
import ProductDetails from '../../../componente/Produtos/ProdutosSingle/ProdutosSingle';
import Footer from '@/componente/Footer/Footer';
import Header from '@/componente/Header/Header';

type ProdutoProps = {
  params: {
    id: string;
  };
};

const Produto = ({ params }: ProdutoProps) => {
  const produtoId = parseInt(params.id);
  const produto = products.find((p) => p.id === produtoId);

  if (!produto) {
    notFound();
    return null;
  }

  return (
    <>
      <Header/>
      <ProductDetails product={produto} />
      <Footer/>
    </>
  
  );
};

export async function generateStaticParams() {
  const paths = products.map((produto) => ({
    id: produto.id.toString(),
  }));

  return paths;
}

export default Produto;
