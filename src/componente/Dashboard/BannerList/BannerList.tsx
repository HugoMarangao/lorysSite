// src/componente/Dashboard/BannerList.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { FiTrash2 } from 'react-icons/fi';
import Image from 'next/image';
import { db, storage } from '../../../Configuracao/firebase/firebaseConf';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';

interface Banner {
  id: string;
  link: string;
  image: string;
}

interface BannerListProps {
  title: string;
  collectionName: string;
}

const BannerList: React.FC<BannerListProps> = ({ title, collectionName }) => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBanners = async () => {
    setLoading(true);
    const snap = await getDocs(collection(db, collectionName));
    const data = snap.docs.map(d => ({
      id: d.id,
      ...(d.data() as { link: string; image: string }),
    }));
    setBanners(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchBanners();
  }, [collectionName]);

  const handleDelete = async (banner: Banner) => {
    // 1) Apaga do Storage
    try {
      const imgRef = ref(storage, `${collectionName}/${banner.id}`);
      await deleteObject(imgRef);
    } catch (e) {
      console.warn('erro ao apagar imagem do storage', e);
    }
    // 2) Apaga o doc do Firestore
    await deleteDoc(doc(db, collectionName, banner.id));
    // 3) Atualiza a lista local
    setBanners(banners.filter(b => b.id !== banner.id));
  };

  if (loading) return <p>Carregando {title}...</p>;
  if (banners.length === 0) return <p>Não há {title.toLowerCase()} cadastrados.</p>;

  return (
    <div className="col-span-1 md:col-span-2 lg:col-span-3 p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Preview</TableHead>
            <TableHead>Link</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {banners.map(b => (
            <TableRow key={b.id}>
              <TableCell>
                <div className="w-32 h-16 relative">
                  <Image
                    src={b.image}
                    alt={`Banner ${b.id}`}
                    fill
                    className="object-cover rounded"
                  />
                </div>
              </TableCell>
              <TableCell>
                <a
                  href={b.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {b.link}
                </a>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  onClick={() => handleDelete(b)}
                  title="Excluir banner"
                >
                  <FiTrash2 className="text-red-500" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default BannerList;