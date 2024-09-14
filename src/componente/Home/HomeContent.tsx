// src/componente/HomeContent/HomeContent.tsx
'use client';

import { useEffect, useState } from 'react';
import { db } from '@/Configuracao/Firebase/firebaseConf';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';
import { useAuth } from '../../Configuracao/Context/AuthContext';
import { getUserId } from '../../Configuracao/utils/getUserId';
import { getUserSegment } from '../../Configuracao/utils/segmentUsers';
import ProductCarousel from '@/componente/Produtos/ProdutosCarousel';
import BannerBody from '@/componente/BannerBody/BannerBody';
import { getRemoteConfig, fetchAndActivate, getValue } from 'firebase/remote-config';
import ProductSkeleton from '../Produtos/ProdutosSkeletom/ProductSkeleton';

interface Product {
  id: string;
  name: string;
  price: string;
  promotion?: string; // Campo opcional
  images: string[];
  colors: string[];
}

async function fetchProducts(): Promise<Product[]> {
  const productSnapshot = await getDocs(collection(db, 'products'));
  return productSnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name || '',
      price: data.price || '',
      promotion: data.promotion || '',
      images: data.images || [],
      colors: data.colors || []
    };
  }) as Product[];
}

async function fetchProductsByCategories(categories: string[]): Promise<Product[]> {
  const productsRef = collection(db, 'products');
  const productsQuery = query(
    productsRef,
    where('selectedCategories', 'array-contains-any', categories),
    limit(10)
  );
  const productsSnapshot = await getDocs(productsQuery);

  return productsSnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name || '',
      price: data.price || '',
      promotion: data.promotion,
      images: data.images || [],
      colors: data.colors || [],
    };
  });
}

async function fetchRecentViewedProducts(userId: string): Promise<Product[]> {
  const userViewsRef = doc(db, 'user_views', userId);
  const userViewsSnap = await getDoc(userViewsRef);

  if (userViewsSnap.exists()) {
    const userViewsData = userViewsSnap.data();
    const recentViews: string[] = userViewsData.recentViews || [];

    if (recentViews.length > 0) {
      // Buscar detalhes dos produtos
      const productsRef = collection(db, 'products');
      const productsQuery = query(productsRef, where('__name__', 'in', recentViews));
      const productsSnapshot = await getDocs(productsQuery);

      const products = productsSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || '',
          price: data.price || '',
          promotion: data.promotion,
          images: data.images || [],
          colors: data.colors || [],
        };
      });

      // Usando reduce para garantir que o array resultante seja do tipo Product[]
      const orderedProducts = recentViews.reduce((acc: Product[], id) => {
        const product = products.find((product) => product.id === id);
        if (product) {
          acc.push(product);
        }
        return acc;
      }, []);

      return orderedProducts;
    }
  }

  return [];
}

async function fetchPopularProducts(): Promise<Product[]> {
  const productStatsRef = collection(db, 'product_stats');
  const statsQuery = query(productStatsRef, orderBy('views', 'desc'), limit(10));
  const statsSnapshot = await getDocs(statsQuery);

  const popularProductIds = statsSnapshot.docs.map((doc) => doc.id);

  if (popularProductIds.length > 0) {
    const productsRef = collection(db, 'products');
    const productsQuery = query(productsRef, where('__name__', 'in', popularProductIds));
    const productsSnapshot = await getDocs(productsQuery);

    const products = productsSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || '',
        price: data.price || '',
        promotion: data.promotion,
        images: data.images || [],
        colors: data.colors || [],
      };
    });

    // Usando reduce para ordenar e filtrar os produtos
    const orderedProducts = popularProductIds.reduce((acc: Product[], id) => {
      const product = products.find((product) => product.id === id);
      if (product) {
        acc.push(product);
      }
      return acc;
    }, []);

    return orderedProducts;
  }

  return [];
}

async function fetchSpecialOffers(): Promise<Product[]> {
  const productsRef = collection(db, 'products');
  const productsQuery = query(
    productsRef,
    where('isSpecialOffer', '==', true),
    limit(10)
  );
  const productsSnapshot = await getDocs(productsQuery);

  return productsSnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name || '',
      price: data.price || '',
      promotion: data.promotion,
      images: data.images || [],
      colors: data.colors || [],
    };
  });
}

const HomeContent: React.FC = () => {
  const { user } = useAuth();
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [segmentedProducts, setSegmentedProducts] = useState<Product[]>([]);
  const [showSpecialOffers, setShowSpecialOffers] = useState(false);

  useEffect(() => {
    const userId = user ? user.uid : getUserId();

    const loadInitialProducts = async () => {
      try {
        const [recent, popular] = await Promise.all([
          fetchRecentViewedProducts(userId),
          fetchPopularProducts(),
        ]);

        setRecentProducts(recent);
        setPopularProducts(popular);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    loadInitialProducts();
  }, [user]);

  useEffect(() => {
    const loadAllProducts = async () => {
      try {
        const productsList = await fetchProducts();
        setProducts(productsList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    loadAllProducts();
  }, [user]);

  useEffect(() => {
    const fetchConfig = async () => {
      const remoteConfig = getRemoteConfig();
      remoteConfig.settings.minimumFetchIntervalMillis = 3600000; // 1 hora

      try {
        await fetchAndActivate(remoteConfig);
        const showOffers = getValue(remoteConfig, 'show_special_offers').asBoolean();
        setShowSpecialOffers(showOffers);
      } catch (error) {
        console.error('Error fetching remote config:', error);
      }
    };

    fetchConfig();
  }, []);

  useEffect(() => {
    const userId = user ? user.uid : getUserId();

    const fetchSegmentedProducts = async () => {
      const segments = await getUserSegment(userId);
      let products: Product[] = [];

      if (showSpecialOffers) {
        // Mostrar ofertas especiais
        const specialOffers = await fetchSpecialOffers();
        products = products.concat(specialOffers);
      }

      const interestSegments = segments.filter((segment) =>
        segment.startsWith('interesse_')
      );
      if (interestSegments.length > 0) {
        // Extrair categorias de interesse
        const categories = interestSegments.map((segment) =>
          segment.replace('interesse_', '')
        );
        // Buscar produtos dessas categorias
        const categoryProducts = await fetchProductsByCategories(categories);
        products = products.concat(categoryProducts);
      }

      setSegmentedProducts(products);
    };

    fetchSegmentedProducts();
  }, [user, showSpecialOffers]);

  // Dentro do seu componente HomeContent

if (loading) {
  return (
    <div className="p-4 grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
      {[...Array(6)].map((_, index) => (
        <ProductSkeleton key={index} />
      ))}
    </div>
  );
}

  return (
    <>
      {recentProducts.length > 0 && (
        <>
          <h2 className="text-xl font-bold px-5">
            Seus Produtos Visualizados Recentemente
          </h2>
          <ProductCarousel products={recentProducts} />
        </>
      )}
      {segmentedProducts.length > 0 && (
        <>
          <h2 className="text-xl font-bold px-5">Recomendações Personalizadas</h2>
          <ProductCarousel products={segmentedProducts} />
        </>
      )}
      <BannerBody />
      <h2 className="text-xl font-bold px-5">Produtos Populares</h2>
      <ProductCarousel products={popularProducts} />
      
      {products.length > 0 && (
        <>
          <h2 className="text-xl font-bold px-5">Todos os Produtos</h2>
          <ProductCarousel products={products} />
        </>
      )}
      <BannerBody />
      {/* Você pode adicionar mais componentes aqui */}
    </>
  );
};

export default HomeContent;