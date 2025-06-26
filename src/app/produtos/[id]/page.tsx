// src/app/produtos/[id]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import dynamic from 'next/dynamic';
import { db } from '@/Configuracao/Firebase/firebaseConf';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import Header from '@/componente/Header/Header';
import Footer from '@/componente/Footer/Footer';
import ProductDetailsSkeleton from '@/componente/Produtos/ProdutosSkeletom/ProductDetailsSkeleton';

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
}

// ① Server‐side cache para fetch único por instância
const fetchProduct = cache(async (id: string): Promise<Product | null> => {
  const docRef = doc(collection(db, 'products'), id);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    id: snap.id,
    name: data.name || '',
    price: data.price || '',
    promotion: data.promotion || '',
    images: data.images || [],
    colors: data.colors || [],
    description: data.description || '',
    sizes: data.sizes || [],
    selectedCategories: data.selectedCategories || [],
    selectedSubcategories: data.selectedSubcategories || [],
  };
});

// ② Pré‐gera rotas estáticas
export async function generateStaticParams() {
  const col = collection(db, 'products');
  const snaps = await getDocs(col);
  return snaps.docs.map(d => ({ id: d.id }));
}

// ③ ISR: revalida a cada 120s
export const revalidate = 120;

// ④ Metadata Dinâmico
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const product = await fetchProduct(params.id);
  if (!product) {
    return { title: 'Produto não encontrado', description: '' };
  }
  return {
    title: product.name,
    description: product.description.slice(0, 150),
  };
}

// ⑤ Component carregado somente no cliente, interativo
const ClientProductDetails = dynamic(
  () => import('@/componente/Produtos/ProdutosSingle/ProdutosSingle'),
  {
    ssr: false,
    loading: () => <ProductDetailsSkeleton />,
  }
);

export default async function ProdutoPage({ params }: { params: { id: string } }) {
  const product = await fetchProduct(params.id);
  if (!product) return notFound();

  return (
    <>
      <Header />
      <ClientProductDetails product={product} />
      <Footer />
    </>
  );
}