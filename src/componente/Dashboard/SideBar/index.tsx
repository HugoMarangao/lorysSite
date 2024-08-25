import React from 'react';
import { FiHome, FiBarChart2, FiSettings, FiUsers } from 'react-icons/fi';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Importa o usePathname

function Sidebar() {
  const pathname = usePathname(); // Obtém o caminho atual

  return (
    <div className="bg-gray-800 text-white h-screen p-4">
      <div className="text-center text-2xl font-bold mb-8">
        <Link href="/">
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={200}
            height={100}
          />
        </Link>
      </div>
      <ul className="space-y-6">
        <li className={`flex items-center space-x-2 cursor-pointer p-2 rounded-md ${pathname === '/dashboard' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
          <Link href="/dashboard" className="flex items-center space-x-2">
            <FiHome />
            <span>Dashboard</span>
          </Link>
        </li>
        <li className={`flex items-center space-x-2 cursor-pointer p-2 rounded-md ${pathname === '/relatorio' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
          <Link href="/relatorio" className="flex items-center space-x-2">
            <FiBarChart2 />
            <span>Relatórios</span>
          </Link>
        </li>
        <li className={`flex items-center space-x-2 cursor-pointer p-2 rounded-md ${pathname === '/clientes' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
          <Link href="/clientes" className="flex items-center space-x-2">
            <FiUsers />
            <span>Clientes</span>
          </Link>
        </li>
        <li className={`flex items-center space-x-2 cursor-pointer p-2 rounded-md ${pathname === '/configuracoes' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
          <Link href="/configuracoes" className="flex items-center space-x-2">
            <FiSettings />
            <span>Configurações</span>
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
