'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import ReactPixel from 'react-facebook-pixel'; // Importando o pacote do Facebook Pixel
import { analytics } from '@/Configuracao/Firebase/firebaseConf';
import { logEvent } from 'firebase/analytics';
import { db } from '@/Configuracao/Firebase/firebaseConf';
import {
  collection,
  addDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
} from 'firebase/firestore';
import { useAuth } from '../Context/AuthContext';
import { getUserId } from '../utils/getUserId';

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const { user } = useAuth();
  const userId = user ? user.uid : getUserId();
  const [startTime, setStartTime] = useState<number>(Date.now());

  useEffect(() => {
    // Inicializar o Facebook Pixel
    ReactPixel.init('3064021873666359'); // Substitua pelo seu ID do Pixel
    ReactPixel.pageView(); // Rastreia a visualização de página inicial

    const excludedRoutes = ['/dashboard', '/relatorio']; // Ajuste as rotas conforme necessário

    const logPageView = async (url: string) => {
      // Verificar se a rota está excluída
      if (excludedRoutes.some((route) => url.startsWith(route))) {
        return;
      }

      if (analytics) {
        try {
          await logEvent(analytics, 'page_view', { page_path: url });
          ReactPixel.pageView(); // Rastrear visualizações de página no Pixel

          // Registro no Firestore
          await addDoc(collection(db, 'analytics'), {
            event_type: 'page_view',
            page_path: url,
            timestamp: new Date(),
            user_id: userId,
          });

          // Atualizar dados de sessão do usuário no Firestore
          const userSessionRef = doc(db, 'user_sessions', userId);
          await updateDoc(userSessionRef, {
            page_views: increment(1),
            last_active: new Date(),
          }).catch(async (error) => {
            if (error.code === 'not-found') {
              await setDoc(userSessionRef, {
                user_id: userId,
                page_views: 1,
                sessions: 1,
                last_active: new Date(),
              });
            } else {
              throw error;
            }
          });

          // Início de uma nova sessão
          if (!sessionStorage.getItem('session_started')) {
            sessionStorage.setItem('session_started', 'true');
            await updateDoc(userSessionRef, {
              sessions: increment(1),
            }).catch(async (error) => {
              if (error.code === 'not-found') {
                await setDoc(userSessionRef, {
                  user_id: userId,
                  page_views: 1,
                  sessions: 1,
                  last_active: new Date(),
                });
              } else {
                throw error;
              }
            });
          }

          // Verifica se a página visualizada é uma página de produto
          if (url.startsWith('/produtos/')) {
            const productId = url.split('/produtos/')[1];

            // Atualizar estatísticas do produto
            const productStatsRef = doc(db, 'product_stats', productId);
            await updateDoc(productStatsRef, {
              views: increment(1),
            }).catch(async (error) => {
              if (error.code === 'not-found') {
                await setDoc(productStatsRef, {
                  views: 1,
                });
              } else {
                throw error;
              }
            });

            // Atualizar produtos visualizados recentemente pelo usuário
            const userViewsRef = doc(db, 'user_views', userId);
            const userViewsSnap = await getDoc(userViewsRef);

            if (userViewsSnap.exists()) {
              const userViewsData = userViewsSnap.data();
              let recentViews: string[] = userViewsData.recentViews || [];

              recentViews = recentViews.filter((id) => id !== productId);
              recentViews.unshift(productId);

              if (recentViews.length > 10) {
                recentViews = recentViews.slice(0, 10);
              }

              await updateDoc(userViewsRef, {
                recentViews: recentViews,
              });
            } else {
              await setDoc(userViewsRef, {
                userId: userId,
                recentViews: [productId],
              });
            }

            // Atualizar categorias visualizadas
            const productRef = doc(db, 'products', productId);
            const productSnap = await getDoc(productRef);

            if (productSnap.exists()) {
              const productData = productSnap.data();
              const categories = productData.selectedCategories || [];

              const userProfileRef = doc(db, 'user_profiles', userId);
              const userProfileSnap = await getDoc(userProfileRef);

              if (userProfileSnap.exists()) {
                const updates: any = {};

                categories.forEach((category: string) => {
                  updates[`categories_viewed.${category}`] = increment(1);
                });

                await updateDoc(userProfileRef, updates);
              } else {
                const categories_viewed: any = {};

                categories.forEach((category: string) => {
                  categories_viewed[category] = 1;
                });

                await setDoc(userProfileRef, {
                  user_id: userId,
                  categories_viewed,
                });
              }
            }
          }
        } catch (error) {
          console.error('Error logging page view:', error);
        }
      }
    };

    logPageView(pathname);

    // Capturar o tempo gasto na página quando o usuário sai ou muda de rota
    const handleRouteChange = () => {
      if (startTime && analytics) {
        const timeSpent = (Date.now() - startTime) / 1000;

        // Verificar se a rota está excluída
        if (!excludedRoutes.some((route) => pathname.startsWith(route))) {
          logEvent(analytics, 'time_spent', {
            page_path: pathname,
            time_spent: timeSpent,
          });

          addDoc(collection(db, 'analytics'), {
            event_type: 'time_spent',
            page_path: pathname,
            time_spent: timeSpent,
            timestamp: new Date(),
            user_id: userId,
          });
        }
      }
      setStartTime(Date.now());
    };

    window.addEventListener('beforeunload', handleRouteChange);
    return () => {
      window.removeEventListener('beforeunload', handleRouteChange);
    };
  }, [pathname, startTime, userId]);

  return null;
}