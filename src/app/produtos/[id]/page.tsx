import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { db } from '../../../Configuracao/Firebase/firebaseConf';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import ProductDetails from '../../../componente/Produtos/ProdutosSingle/ProdutosSingle';
import Footer from '@/componente/Footer/Footer';
import Header from '@/componente/Header/Header';

type Product = {
  id: string;
  name: string;
  price: string;
  promotion?: string;
  images: string[];
  colors: string[];
  description: string;
  sizes: string[];
  category: string;
  subcategory: string;
};

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
const Produto = async ({ params }: ProdutoProps) => {
  const docRef = doc(collection(db, 'products'), params.id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    notFound();
    return null;
  }

  const product: Product = {
    id: docSnap.id,
    name: docSnap.data().name || '',
    price: docSnap.data().price || '',
    promotion: docSnap.data().promotion || '',
    images: docSnap.data().images || [],
    colors: docSnap.data().colors || [],
    description: docSnap.data().description || '',
    sizes: docSnap.data().sizes || [],
    category: docSnap.data().category || '',
    subcategory: docSnap.data().subcategory || '',
  };

  return (
    <>
      <Header />
      <ProductDetails product={product} />
      <Footer />
    </>
  );
};

export default Produto;
