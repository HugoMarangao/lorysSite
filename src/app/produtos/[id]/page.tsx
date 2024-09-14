// src/app/produtos/[id]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { db } from '../../../Configuracao/Firebase/firebaseConf';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import Footer from '@/componente/Footer/Footer';
import Header from '@/componente/Header/Header';
import ClientProductLoader from '../../../componente/Produtos/ProdutosSkeletom/ClientProductLoader'; // Importe o novo componente

interface Product {
  id: string;
  name: string;
  price: string;
  promotion?: string;
  images: string[];
  colors: string[];
  description: string;
  sizes: string[];
  selectedCategories: string[];
  selectedSubcategories: string[];
  selectedSize?: string;
  selectedColor?: string;
}

type ProdutoProps = {
  params: {
    id: string;
  };
};

// Função para gerar os caminhos estaticamente
export async function generateStaticParams() {
  const productCollection = collection(db, 'products');
  const productSnapshot = await getDocs(productCollection);
  const paths = productSnapshot.docs.map((doc) => ({
    id: doc.id,
  }));

  return paths;
}

// SEO dinâmico
export async function generateMetadata({ params }: ProdutoProps): Promise<Metadata> {
  const docRef = doc(collection(db, 'products'), params.id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return {
      title: 'Produto não encontrado',
      description: 'Este produto não foi encontrado no sistema.',
    };
  }

  const productData = docSnap.data();

  return {
    title: productData.seoTitle || productData.name,
    description: productData.seoDescription || productData.description,
  };
}

// Componente da página de produto
const Produto = ({ params }: ProdutoProps) => {
  return (
    <>
      <Header />
      <ClientProductLoader productId={params.id} />
      <Footer />
    </>
  );
};

export default Produto;