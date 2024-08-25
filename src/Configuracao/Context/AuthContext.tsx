'use client';

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { auth, db } from '../Firebase/firebaseConf';
import { doc, getDoc } from 'firebase/firestore';

interface User {
  type: string;
  nome: string;
  uid: string;
  email: string;
  displayName: string;
  cpf: string;
  dataNascimento: string;
  telefone: string;
  endereco: {
    cep: string;
    logradouro: string;
    bairro: string;
    cidade: string;
    uf: string;
    numero: string;
  };
  promocoes: boolean;
  sms: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('onAuthStateChanged triggered');
      if (firebaseUser) {
        console.log('User is authenticated:', firebaseUser.uid);
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            console.log('User document exists:', userDoc.data());
            setUser({ uid: firebaseUser.uid, email: firebaseUser.email || '', ...userDoc.data() } as User);
          } else {
            console.log('User document does not exist');
          }
        } catch (error) {
          console.error('Error fetching user document:', error);
        }
        setLoading(false);
      } else {
        console.log('User is not authenticated');
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    console.log('Logging out');
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
