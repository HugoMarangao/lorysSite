// Sidebar.tsx
'use client';

import React from 'react';
import { FiHome, FiBarChart2, FiSettings, FiUsers } from 'react-icons/fi';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="bg-gray-800 text-white p-4 md:h-screen w-full md:w-64 md:fixed top-0 md:pt-8 flex items-center justify-between md:flex-col md:justify-start z-10">
      <div className="flex items-center justify-center w-full md:mb-8">
        <Link href="/">
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={100}
            height={50}
            className="md:mx-auto"
          />
        </Link>
      </div>
      <ul className="flex md:flex-col space-x-4 md:space-x-0 md:space-y-6 mt-4 md:mt-0">
        <li className={`flex items-center space-x-2 cursor-pointer p-2 rounded-md ${pathname === '/dashboard' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
          <Link href="/dashboard" className="flex items-center space-x-2">
            <FiHome />
            <span className="hidden md:inline">Dashboard</span>
          </Link>
        </li>
        <li className={`flex items-center space-x-2 cursor-pointer p-2 rounded-md ${pathname === '/relatorio' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
          <Link href="/relatorio" className="flex items-center space-x-2">
            <FiBarChart2 />
            <span className="hidden md:inline">Relatórios</span>
          </Link>
        </li>
        <li className={`flex items-center space-x-2 cursor-pointer p-2 rounded-md ${pathname === '/clientes' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
          <Link href="/clientes" className="flex items-center space-x-2">
            <FiUsers />
            <span className="hidden md:inline">Clientes</span>
          </Link>
        </li>
        <li className={`flex items-center space-x-2 cursor-pointer p-2 rounded-md ${pathname === '/configuracoes' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
          <Link href="/configuracoes" className="flex items-center space-x-2">
            <FiSettings />
            <span className="hidden md:inline">Configurações</span>
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
