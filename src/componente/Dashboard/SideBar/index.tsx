'use client';

import React from 'react';
import { FiHome, FiBarChart2, FiSettings, FiUsers } from 'react-icons/fi';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="bg-gray-800 text-white p-4 md:h-screen w-full md:w-64 md:fixed top-0 md:pt-8 flex flex-col items-center md:items-start justify-between md:justify-start z-10">
      {/* Logo Centralizada no Topo */}
      <div className="w-full flex justify-center md:justify-center mb-4 md:mb-8">
        <Link href="/" passHref>
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={120}
            height={60}
            className="cursor-pointer"
          />
        </Link>
      </div>

      {/* Ícones de Navegação Alinhados em Linha no Mobile */}
      <ul className="flex w-full justify-center md:flex-col md:justify-start space-x-4 md:space-x-0 md:space-y-6 mt-4 md:mt-0">
        <SidebarItem
          href="/dashboard"
          active={pathname === '/dashboard'}
          icon={<FiHome size={24} />}
          label="Dashboard"
        />
        <SidebarItem
          href="/relatorio"
          active={pathname === '/relatorio'}
          icon={<FiBarChart2 size={24} />}
          label="Relatórios"
        />
        <SidebarItem
          href="/clientes"
          active={pathname === '/clientes'}
          icon={<FiUsers size={24} />}
          label="Clientes"
        />
        <SidebarItem
          href="/configuracoes"
          active={pathname === '/configuracoes'}
          icon={<FiSettings size={24} />}
          label="Configurações"
        />
      </ul>
    </div>
  );
}

interface SidebarItemProps {
  href: string;
  active: boolean;
  icon: React.ReactNode;
  label: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ href, active, icon, label }) => {
  return (
    <li className={`flex items-center justify-center md:justify-start p-3 md:p-2 rounded-md transition-colors ${active ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
      <Link href={href} className="flex items-center space-x-2 w-full justify-center md:justify-start">
        <span className="text-2xl md:text-base">{icon}</span>
        <span className="hidden md:inline text-sm">{label}</span>
      </Link>
    </li>
  );
};

export default Sidebar;