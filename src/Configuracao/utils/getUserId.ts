// src/utils/getUserId.ts

export function getUserId(): string {
    let userId = '';
    if (typeof window !== 'undefined') {
      userId = localStorage.getItem('userId') || '';
      if (!userId) {
        userId = 'anon_' + Math.random().toString(36).substring(2);
        localStorage.setItem('userId', userId);
      }
    }
    return userId;
  }