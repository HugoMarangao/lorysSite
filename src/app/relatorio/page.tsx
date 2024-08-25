'use client';
import React from 'react';
import { FiUsers, FiDollarSign, FiShoppingCart } from 'react-icons/fi';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Sidebar from '@/componente/Dashboard/SideBar';

// Registrando os componentes do Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Relatorio() {
    return (
      <div className="flex">
        <Sidebar />
        <div className="p-6 flex-1 bg-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard title="Total vendas" value="R$ 40.000" icon={<FiDollarSign />} />
            <StatCard title="Novos clientes" value="R$ 40.000" icon={<FiUsers />} />
            <StatCard title="Pedidos hoje" value="65" icon={<FiShoppingCart />} />
            <StatCard title="Total pedidos" value="235" icon={<FiShoppingCart />} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <SalesOverview />
            <RecentClients />
            <UserOverview/>
          </div>
        </div>
      </div>
    );
  }

  interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
  }

function StatCard({ title, value, icon }: StatCardProps) {
    return (
      <div className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-500">{title}</h3>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className="text-4xl text-gray-400">{icon}</div>
      </div>
    );
  }
  function SalesOverview() {
    const data = {
      labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
      datasets: [
        {
          label: 'Vendas',
          data: [12000, 19000, 3000, 5000, 20000, 30000],
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
        },
      ],
    };
  
    const options = {
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    };
  
    return (
      <div className="bg-white shadow-md rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-500 mb-4">Overview Vendas</h3>
        <div className="h-64">
          <Bar data={data} options={options} />
        </div>
      </div>
    );
  }

  function UserOverview() {
    const data = {
      labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
      datasets: [
        {
          label: 'Vendas',
          data: [100, 200, 300, 5000, 20000, 30000],
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
        },
      ],
    };
  
    const options = {
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    };
  
    return (
      <div className="bg-white shadow-md rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-500 mb-4">Overview User</h3>
        <div className="h-64">
          <Bar data={data} options={options} />
        </div>
      </div>
    );
  }


  function RecentClients() {
    const clients = [
      { name: 'Sujeito Programador', email: 'sujeitoprogramador@gmail.com' },
      { name: 'Sujeito Programador', email: 'sujeitoprogramador@gmail.com' },
    ];
  
    return (
      <div className="bg-white shadow-md rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-500 mb-4">Últimos clientes</h3>
        <ul>
          {clients.map((client, index) => (
            <li key={index} className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                {/* Aqui você pode adicionar a inicial do cliente ou um ícone */}
                <span className="text-gray-500 font-semibold">{client.name.charAt(0)}</span>
              </div>
              <div>
                <p className="text-sm font-medium">{client.name}</p>
                <p className="text-xs text-gray-400">{client.email}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }