'use client';
import React, { useEffect, useState } from 'react';
import { FiUsers, FiDollarSign, FiShoppingCart } from 'react-icons/fi';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Sidebar from '@/componente/Dashboard/SideBar';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/Configuracao/Firebase/firebaseConf';

// Registrando os componentes do Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Relatorio() {
    const [totalSales, setTotalSales] = useState(0);
    const [newClients, setNewClients] = useState(0);
    const [ordersToday, setOrdersToday] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [salesData, setSalesData] = useState<number[]>([]);
    const [userData, setUserData] = useState<number[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            // Fetch total sales, new clients, orders today, total orders from Firestore
            const salesSnapshot = await getDocs(collection(db, 'sales'));
            const userSnapshot = await getDocs(collection(db, 'users'));
            
            // Example mock data processing
            const totalSalesAmount = salesSnapshot.docs.reduce((acc, doc) => acc + doc.data().amount, 0);
            
            // Filter new clients by today's date, ensuring createdAt exists and is valid
            const today = new Date().toDateString();
            const newClientsToday = userSnapshot.docs.filter(doc => {
                const createdAt = doc.data().createdAt;
                if (!createdAt) return false; // Skip if createdAt is undefined
                const userDate = createdAt.toDate().toDateString(); // Convert to string for comparison
                return today === userDate;
            }).length;

            setTotalSales(totalSalesAmount);
            setNewClients(newClientsToday);
            setOrdersToday(salesSnapshot.docs.length); // Assumed orders today equals sales docs count
            setTotalOrders(salesSnapshot.docs.length); // Same assumption

            // Assuming sales data and user data over time is stored in arrays
            setSalesData(salesSnapshot.docs.map(doc => doc.data().amount));
            setUserData(userSnapshot.docs.map(doc => doc.data().activity)); // Mock data for user activity
        };

        fetchData();
    }, []);

    return (
      <div className="flex">
        <Sidebar />
        <div className="p-6 flex-1 bg-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard title="Total vendas" value={`R$ ${totalSales}`} icon={<FiDollarSign />} />
            <StatCard title="Novos clientes" value={newClients} icon={<FiUsers />} />
            <StatCard title="Pedidos hoje" value={ordersToday} icon={<FiShoppingCart />} />
            <StatCard title="Total pedidos" value={totalOrders} icon={<FiShoppingCart />} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <SalesOverview data={salesData} />
            <UserOverview data={userData} />
            <RecentClients />
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

interface ChartProps {
    data: number[];
}

function SalesOverview({ data }: ChartProps) {
    const chartData = {
      labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
      datasets: [
        {
          label: 'Vendas',
          data: data,
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
          <Bar data={chartData} options={options} />
        </div>
      </div>
    );
}

function UserOverview({ data }: ChartProps) {
    const chartData = {
      labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
      datasets: [
        {
          label: 'Atividade de Usuários',
          data: data,
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
        <h3 className="text-sm font-semibold text-gray-500 mb-4">Overview Usuários</h3>
        <div className="h-64">
          <Bar data={chartData} options={options} />
        </div>
      </div>
    );
}

function RecentClients() {
    const [clients, setClients] = useState<{ name: string; email: string; }[]>([]);

    useEffect(() => {
      const fetchClients = async () => {
        const userSnapshot = await getDocs(collection(db, 'users'));
        const recentClients = userSnapshot.docs.map(doc => ({
          name: doc.data().name || 'Desconhecido', // Adicione uma verificação para garantir que o nome está definido
          email: doc.data().email || 'sememail@dominio.com', // Adicione uma verificação para garantir que o email está definido
        }));
        setClients(recentClients);
      };

      fetchClients();
    }, []);

    return (
      <div className="bg-white shadow-md rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-500 mb-4">Últimos clientes</h3>
        <ul>
          {clients.map((client, index) => (
            <li key={index} className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                {client.name ? (
                  <span className="text-gray-500 font-semibold">{client.name.charAt(0)}</span>
                ) : (
                  <span className="text-gray-500 font-semibold">?</span> // Caso o nome seja indefinido, mostre um '?'
                )}
              </div>
              <div>
                <p className="text-sm font-medium">{client.name || "Desconhecido"}</p> {/* Nome de fallback */}
                <p className="text-xs text-gray-400">{client.email || "sememail@dominio.com"}</p> {/* Email de fallback */}
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
}
