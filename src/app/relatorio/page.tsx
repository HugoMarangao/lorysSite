'use client';
import React, { useEffect, useState } from 'react';
import { FiUsers, FiDollarSign, FiShoppingCart, FiClock, FiCalendar } from 'react-icons/fi';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import Sidebar from '@/componente/Dashboard/SideBar';
import { collection, getDoc, getDocs, query, where, doc } from 'firebase/firestore';
import { db } from '@/Configuracao/Firebase/firebaseConf';

// Registrando os componentes do Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend);

export default function Relatorio() {
  const [totalSales, setTotalSales] = useState(0);
  const [newClients, setNewClients] = useState(0);
  const [ordersToday, setOrdersToday] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [salesData, setSalesData] = useState<number[]>([]);
  const [userData, setUserData] = useState<number[]>([]);
  const [averageTimeData, setAverageTimeData] = useState<number[]>([]);
  const [conversionFunnel, setConversionFunnel] = useState<number[]>([]);
  const [clickHeatmap, setClickHeatmap] = useState<{ page: string, clicks: number }[]>([]);
  const [productViews, setProductViews] = useState<{ name: string, views: number }[]>([]);
  const [userSegments, setUserSegments] = useState<{ location: string, count: number }[]>([]);
  const [dateFilter, setDateFilter] = useState('30');

  useEffect(() => {
      const fetchData = async () => {
          const salesSnapshot = await getDocs(collection(db, 'sales'));
          const userSnapshot = await getDocs(collection(db, 'users'));
          const analyticsSnapshot = await getDocs(query(collection(db, 'analytics'), where('timestamp', '>=', new Date(new Date().setDate(new Date().getDate() - parseInt(dateFilter))))));

          const totalSalesAmount = salesSnapshot.docs.reduce((acc, doc) => acc + doc.data().amount, 0);
          const today = new Date().toDateString();
          const newClientsToday = userSnapshot.docs.filter(doc => {
              const createdAt = doc.data().createdAt;
              return createdAt && createdAt.toDate().toDateString() === today;
          }).length;

          setTotalSales(totalSalesAmount);
          setNewClients(newClientsToday);
          setOrdersToday(salesSnapshot.docs.length);
          setTotalOrders(salesSnapshot.docs.length);
          setSalesData(salesSnapshot.docs.map(doc => doc.data().amount));
          setUserData(userSnapshot.docs.map(doc => doc.data().activity || 0));

          const timeSpentData = analyticsSnapshot.docs.map(doc => doc.data().time_spent);
          setAverageTimeData(timeSpentData);

          const funnelData = [100, 60, 30];
          setConversionFunnel(funnelData);

          const clickData = analyticsSnapshot.docs.map(doc => ({ page: doc.data().page_path, clicks: doc.data().clicks || 0 }));
          setClickHeatmap(clickData);

          const productSnapshot = await getDocs(collection(db, 'products'));
          const productViewData = productSnapshot.docs.map(doc => ({ name: doc.data().name, views: doc.data().views || 0 }));
          setProductViews(productViewData);

          const segmentData = userSnapshot.docs.map(doc => ({ location: doc.data().location || 'Indefinido', count: 1 }));
          const aggregatedSegments: Record<string, number> = segmentData.reduce((acc: Record<string, number>, curr) => {
              acc[curr.location] = (acc[curr.location] || 0) + curr.count;
              return acc;
          }, {});
          setUserSegments(Object.keys(aggregatedSegments).map(key => ({ location: key, count: aggregatedSegments[key] })));
      };

      fetchData();
  }, [dateFilter]);

  return (
      <div className="flex flex-col md:flex-row min-h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col p-6 bg-gray-100 md:ml-64">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-16 md:mt-0">
                  <StatCard title="Total vendas" value={`R$ ${totalSales}`} icon={<FiDollarSign />} />
                  <StatCard title="Novos clientes" value={newClients} icon={<FiUsers />} />
                  <StatCard title="Pedidos hoje" value={ordersToday} icon={<FiShoppingCart />} />
                  <StatCard title="Tempo Médio por Página" value={`${(averageTimeData.reduce((a, b) => a + b, 0) / averageTimeData.length).toFixed(2)} seg`} icon={<FiClock />} />
              </div>
              <div className="flex justify-between items-center my-4">
                  <h2 className="text-xl font-bold">Relatórios de Vendas e Usuários</h2>
                  <DateFilter setDateFilter={setDateFilter} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <SalesOverview data={salesData} />
                  <UserOverview data={userData} />
                  <ConversionFunnel data={conversionFunnel} />
                  <ClickHeatmap />
                  <ProductViews />
                  <UserSegments data={userSegments} />
                  <RecentClients />
              </div>
          </div>
      </div>
  );
}

function DateFilter({ setDateFilter }: { setDateFilter: (value: string) => void }) {
  return (
    <div className="flex items-center space-x-2">
      <FiCalendar className="text-gray-500" />
      <select 
        onChange={(e) => setDateFilter(e.target.value)} 
        className="shadow border rounded w-full py-2 px-3 text-gray-700"
      >
        <option value="7">Últimos 7 dias</option>
        <option value="30" selected>Últimos 30 dias</option>
        <option value="90">Últimos 90 dias</option>
      </select>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string, value: string | number, icon: React.ReactNode }) {
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

function SalesOverview({ data }: { data: number[] }) {
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

function UserOverview({ data }: { data: number[] }) {
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

function ConversionFunnel({ data }: { data: number[] }) {
    const chartData = {
      labels: ['Visitas', 'Adições ao Carrinho', 'Checkouts'],
      datasets: [
        {
          label: 'Funil de Conversão',
          data: data,
          backgroundColor: ['rgba(255, 99, 132, 0.5)', 'rgba(54, 162, 235, 0.5)', 'rgba(75, 192, 192, 0.5)'],
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
        <h3 className="text-sm font-semibold text-gray-500 mb-4">Funil de Conversão</h3>
        <div className="h-64">
          <Bar data={chartData} options={options} />
        </div>
      </div>
    );
}

function ClickHeatmap() {
  const [clickData, setClickData] = useState<{ page: string, clicks: number }[]>([]);

  useEffect(() => {
      const fetchClickData = async () => {
          try {
              const clickCounts: Record<string, number> = {};

              console.log('Executando query para buscar visualizações com event_type "page_view"');
              const analyticsQuery = query(collection(db, 'analytics'), where('event_type', '==', 'page_view'));
              const analyticsSnapshot = await getDocs(analyticsQuery);

              console.log('Número de documentos de visualização encontrados:', analyticsSnapshot.size);

              if (analyticsSnapshot.empty) {
                  console.warn('Nenhum evento de visualização encontrado.');
                  return;
              }

              // Mapeia os IDs dos produtos a partir dos paths "/produtos/{product_id}"
              const productIds = new Set<string>();
              analyticsSnapshot.docs.forEach((doc, index) => {
                  const data = doc.data();
                  const { page_path } = data;
                  console.log(`Documento ${index + 1}:`, data);

                  if (page_path) {
                      if (page_path.startsWith('/produtos/')) {
                          const productId = page_path.split('/produtos/')[1];
                          if (productId) {
                              clickCounts[productId] = (clickCounts[productId] || 0) + 1;
                              productIds.add(productId);
                          }
                      } else {
                          clickCounts[page_path] = (clickCounts[page_path] || 0) + 1;
                      }
                  } else {
                      console.warn('Evento de visualização sem page_path:', doc.id);
                  }
              });

              // Busca os nomes dos produtos a partir dos IDs
              const productNames = await Promise.all(
                  Array.from(productIds).map(async (productId) => {
                      const productDoc = await getDoc(doc(db, 'products', productId));
                      if (productDoc.exists()) {
                          return { id: productId, name: productDoc.data().name || 'Produto desconhecido' };
                      } else {
                          return { id: productId, name: 'Produto desconhecido' };
                      }
                  })
              );

              // Mapeia os IDs para nomes
              const productNameMap = productNames.reduce((acc, product) => {
                  acc[product.id] = product.name;
                  return acc;
              }, {} as Record<string, string>);

              // Converte os IDs para nomes nos dados do gráfico
              const clickEntries = Object.keys(clickCounts).map(page => ({
                  page: productNameMap[page] || page, // Usa o nome do produto se disponível, senão usa o caminho
                  clicks: clickCounts[page],
              }));

              console.log('Entradas de visualizações para o gráfico:', clickEntries);

              setClickData(clickEntries);
          } catch (error) {
              console.error('Erro ao buscar dados de visualizações:', error);
          }
      };

      fetchClickData();
  }, []);

  if (clickData.length === 0) {
      return (
          <div className="bg-white shadow-md rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-500 mb-4">Heatmap de Visualizações</h3>
              <p className="text-gray-500">Nenhum dado de visualizações encontrado.</p>
          </div>
      );
  }

  const chartData = {
      labels: clickData.map(d => d.page),
      datasets: [
          {
              label: 'Visualizações por Página',
              data: clickData.map(d => d.clicks),
              backgroundColor: 'rgba(255, 206, 86, 0.5)',
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
          <h3 className="text-sm font-semibold text-gray-500 mb-4">Heatmap de Visualizações</h3>
          <div className="h-64">
              <Bar data={chartData} options={options} />
          </div>
      </div>
  );
}

function ProductViews() {
  const [productViews, setProductViews] = useState<{ name: string, views: number }[]>([]);

  useEffect(() => {
      const fetchProductViews = async () => {
          // Definindo o tipo correto para o objeto
          const productViewCounts: Record<string, number> = {}; // Objeto com chaves string e valores number
          
          // Recupera os eventos de visualização de produtos do Firestore
          const analyticsSnapshot = await getDocs(collection(db, 'analytics'));
          
          // Mapeia os IDs dos produtos a partir dos paths "/produtos/{product_id}"
          analyticsSnapshot.docs.forEach(doc => {
              const { page_path, event_type } = doc.data();
              if (event_type === 'page_view' && page_path.startsWith('/produtos/')) {
                  const productId = page_path.split('/produtos/')[1]; // Extrai o ID do produto
                  if (productId) {
                      productViewCounts[productId] = (productViewCounts[productId] || 0) + 1; // Incrementa as visualizações
                  }
              }
          });

          // Busca os nomes dos produtos a partir dos IDs
          const productEntries = await Promise.all(
              Object.keys(productViewCounts).map(async productId => {
                  const productDoc = await getDoc(doc(db, 'products', productId));
                  if (productDoc.exists()) {
                      return { name: productDoc.data().name, views: productViewCounts[productId] };
                  } else {
                      return { name: 'Produto desconhecido', views: productViewCounts[productId] };
                  }
              })
          );

          setProductViews(productEntries);
      };

      fetchProductViews();
  }, []);

  const chartData = {
      labels: productViews.map(d => d.name),
      datasets: [
          {
              label: 'Visualizações de Produtos',
              data: productViews.map(d => d.views),
              backgroundColor: 'rgba(153, 102, 255, 0.5)',
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
          <h3 className="text-sm font-semibold text-gray-500 mb-4">Visualizações de Produtos</h3>
          <div className="h-64">
              <Bar data={chartData} options={options} />
          </div>
      </div>
  );
}




function UserSegments({ data }: { data: { location: string, count: number }[] }) {
    const chartData = {
      labels: data.map(d => d.location),
      datasets: [
        {
          label: 'Segmentação de Usuários por Localização',
          data: data.map(d => d.count),
          backgroundColor: 'rgba(255, 159, 64, 0.5)',
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
        <h3 className="text-sm font-semibold text-gray-500 mb-4">Segmentação de Usuários</h3>
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
          name: doc.data().name || 'Desconhecido',
          email: doc.data().email || 'sememail@dominio.com',
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