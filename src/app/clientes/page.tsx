// src/app/clientes/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/componente/Dashboard/SideBar';
import { collection, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/Configuracao/Firebase/firebaseConf';
import { FiTrash2, FiEdit } from 'react-icons/fi';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

interface Endereco {
  bairro: string;
  cep: string;
  cidade: string;
  logradouro: string;
  numero: string;
  uf: string;
}

interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  dataNascimento: string;
  endereco: Endereco;
  promocoes: boolean;
  sms: boolean;
  blocked?: boolean;
}

function ClientesTable() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [current, setCurrent] = useState<Cliente | null>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const fetch = async () => {
    const snap = await getDocs(collection(db, 'users'));
    setClientes(snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })));
  };
  useEffect(() => { fetch(); }, []);

  const openEdit = (c: Cliente) => { setCurrent(c); setDialogOpen(true); };
  const save = async () => {
    if (!current) return;
    await updateDoc(doc(db, 'users', current.id), current);
    setDialogOpen(false);
    fetch();
  };
  const toggleBlock = async (c: Cliente) => {
    await updateDoc(doc(db, 'users', c.id), { blocked: !c.blocked });
    fetch();
  };
  const remove = async (c: Cliente) => {
    await deleteDoc(doc(db, 'users', c.id));
    fetch();
  };

  const total = Math.ceil(clientes.length / perPage);
  const slice = clientes.slice((page - 1) * perPage, page * perPage);

  return (
    <section className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Clientes</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {slice.map(c => (
            <TableRow key={c.id}>
              <TableCell>{c.nome}</TableCell>
              <TableCell>{c.email}</TableCell>
              <TableCell>{c.telefone}</TableCell>
              <TableCell>{c.blocked ? 'Bloqueado' : 'Ativo'}</TableCell>
              <TableCell className="flex space-x-2">
                <Button variant="ghost" onClick={() => openEdit(c)}><FiEdit /></Button>
                <Button variant="ghost" onClick={() => toggleBlock(c)}>
                  {c.blocked ? 'Desbloquear' : 'Bloquear'}
                </Button>
                <Button variant="ghost" onClick={() => remove(c)}><FiTrash2 /></Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center mt-4">
        <Button variant="default" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Anterior</Button>
        <span>Página {page} de {total}</span>
        <Button variant="default" disabled={page === total} onClick={() => setPage(p => p + 1)}>Próxima</Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogTitle>Editar Cliente</DialogTitle>
          <DialogDescription>Atualize as informações do cliente.</DialogDescription>
          {current && (
            <div className="space-y-4 mt-4">
              <Input label="Nome" value={current.nome} onChange={e => setCurrent({ ...current, nome: e.target.value })} />
              <Input label="Email" type="email" value={current.email} onChange={e => setCurrent({ ...current, email: e.target.value })} />
              <Input label="Telefone" value={current.telefone} onChange={e => setCurrent({ ...current, telefone: e.target.value })} />
              <Input label="CPF" value={current.cpf} onChange={e => setCurrent({ ...current, cpf: e.target.value })} />
              <Input label="Data Nasc" type="date" value={current.dataNascimento} onChange={e => setCurrent({ ...current, dataNascimento: e.target.value })} />
              <fieldset className="flex space-x-4 items-center">
                <Checkbox checked={current.promocoes} onCheckedChange={val => setCurrent({ ...current, promocoes: val })} /><label>Promoções</label>
                <Checkbox checked={current.sms} onCheckedChange={val => setCurrent({ ...current, sms: val })} /><label>SMS</label>
              </fieldset>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Logradouro" value={current.endereco.logradouro} onChange={e => setCurrent({ ...current, endereco: { ...current.endereco, logradouro: e.target.value } })} />
                <Input label="Número" value={current.endereco.numero} onChange={e => setCurrent({ ...current, endereco: { ...current.endereco, numero: e.target.value } })} />
                <Input label="Bairro" value={current.endereco.bairro} onChange={e => setCurrent({ ...current, endereco: { ...current.endereco, bairro: e.target.value } })} />
                <Input label="Cidade" value={current.endereco.cidade} onChange={e => setCurrent({ ...current, endereco: { ...current.endereco, cidade: e.target.value } })} />
                <Input label="CEP" value={current.endereco.cep} onChange={e => setCurrent({ ...current, endereco: { ...current.endereco, cep: e.target.value } })} />
                <Input label="UF" value={current.endereco.uf} onChange={e => setCurrent({ ...current, endereco: { ...current.endereco, uf: e.target.value } })} />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="secondary" onClick={() => setDialogOpen(false)}>Cancelar</Button>
                <Button onClick={save}>Salvar</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

export default function ClientesPage() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />
      <main className="flex-1 md:ml-64 bg-gray-100 p-6">
        <ClientesTable />
      </main>
    </div>
  );
}