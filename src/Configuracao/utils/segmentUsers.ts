// src/utils/segmentUsers.ts

import { db } from '@/Configuracao/Firebase/firebaseConf';
import { doc, getDoc } from 'firebase/firestore';

export async function getUserSegment(userId: string): Promise<string[]> {
  const segments: string[] = [];

  // Obter dados de sessão do usuário
  const userSessionRef = doc(db, 'user_sessions', userId);
  const userSessionSnap = await getDoc(userSessionRef);

  if (userSessionSnap.exists()) {
    const userSessionData = userSessionSnap.data();
    const sessions = userSessionData.sessions || 0;
    const lastActive = userSessionData.last_active?.toDate();

    // Verifica se 'lastActive' é uma data válida antes de calcular
    if (lastActive instanceof Date) {
      const daysSinceLastActive = (new Date().getTime() - lastActive.getTime()) / (1000 * 3600 * 24);

      // Identifica navegadores frequentes
      if (sessions > 5 && daysSinceLastActive <= 7) {
        segments.push('navegador_frequente');
      }
    }
  }

  // Obter perfil do usuário
  const userProfileRef = doc(db, 'user_profiles', userId);
  const userProfileSnap = await getDoc(userProfileRef);

  if (userProfileSnap.exists()) {
    const userProfileData = userProfileSnap.data();
    const categoriesViewed = userProfileData.categories_viewed || {};

    // Categorias de Interesse
    for (const [category, count] of Object.entries(categoriesViewed)) {
      // Verifica se 'count' é um número antes de comparar
      if (typeof count === 'number' && count >= 3) {
        segments.push(`interesse_${category}`);
      }
    }
  }

  return segments;
}