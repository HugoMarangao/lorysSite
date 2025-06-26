// src/app/meus-dados/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/componente/Dashboard/SideBar';
import { useAuth } from '@/Configuracao/Context/AuthContext';
import { db } from '@/Configuracao/Firebase/firebaseConf';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Card } from '@/components/ui/card';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table';
import Header from '@/componente/Header/Header';

interface Pedido {
  id: string;
  createdAt: { toDate: () => Date };
  total: number;
  status: string;
}

export default function MeusDadosPage() {
  const { user } = useAuth();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const q = query(
        collection(db, 'orders'),
        where('userId', '==', user.uid)
      );
      const snap = await getDocs(q);
      setPedidos(
        snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }))
      );
    })();
  }, [user]);

  if (!user) {
    return <p className="p-6 text-center">Você precisa estar logado para ver seus dados.</p>;
  }

  return (
    <div className=" flex-col md:flex-row min-h-screen">
      <Header/>

      <main className="flex-1 md:ml-64 bg-gray-100 p-6">
        <h1 className="text-2xl font-bold mb-6">Meus Dados</h1>

        {/* Card de Perfil */}
        <Card className="mb-8 p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Perfil</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Nome</p>
              <p className="font-medium">{user.nome || user.displayName}</p>
            </div>
            <div>
              <p className="text-gray-600">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-gray-600">Telefone</p>
              <p className="font-medium">{user.telefone || '—'}</p>
            </div>
            <div>
              <p className="text-gray-600">Data de Nascimento</p>
              <p className="font-medium">{user.dataNascimento || '—'}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-gray-600">Endereço</p>
              <p className="font-medium">
                {[
                  user.endereco.logradouro,
                  user.endereco.numero,
                  user.endereco.bairro,
                  user.endereco.cidade + '/' + user.endereco.uf,
                  user.endereco.cep,
                ].filter(Boolean).join(', ')}
              </p>
            </div>
          </div>
        </Card>

        {/* Histórico de Pedidos */}
        <Card className="p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Meus Pedidos</h2>
          {pedidos.length === 0 ? (
            <p className="text-gray-500">Você ainda não realizou nenhum pedido.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Total (R$)</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pedidos.map(p => (
                  <TableRow key={p.id}>
                    <TableCell>
                      {p.createdAt.toDate().toLocaleDateString('pt-BR', {
                        day: '2-digit', month: '2-digit', year: 'numeric'
                      })}
                    </TableCell>
                    <TableCell>{p.total.toFixed(2).replace('.', ',')}</TableCell>
                    <TableCell className={`font-medium ${
                      p.status === 'cancelado' ? 'text-red-500' :
                      p.status === 'entregue' ? 'text-green-500' :
                      'text-yellow-500'
                    }`}>
                      {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </main>
    </div>
  );
}