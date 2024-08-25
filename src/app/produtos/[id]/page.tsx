import { notFound } from 'next/navigation';
import { db } from '../../../Configuracao/Firebase/firebaseConf';
import { collection, doc, getDoc } from 'firebase/firestore';
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

const Produto = async ({ params }: ProdutoProps) => {
  const docRef = doc(collection(db, 'products'), params.id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    notFound();
    return null;
  }

  // Extraindo todas as propriedades esperadas do documento Firestore
  const data = docSnap.data();
  const produto: Product = {
    id: docSnap.id,
    name: data.name || '',
    price: data.price || '',
    promotion: data.promotion || '',
    images: data.images || [],
    colors: data.colors || [],
    description: data.description || '',
    sizes: data.sizes || [],
    category: data.category || '',
    subcategory: data.subcategory || '',
  };

  return (
    <>
      <Header />
      <ProductDetails product={produto} />
      <Footer />
    </>
  );
};

export default Produto;
