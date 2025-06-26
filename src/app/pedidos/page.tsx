'use client';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Sidebar from '@/componente/Dashboard/SideBar';
import {
  collection,
  getDocs,
  orderBy,
  query,
  QueryDocumentSnapshot,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '@/Configuracao/Firebase/firebaseConf';

interface OrderItem {
  id: string;
  name: string;
  quantity?: number;
  price: number | string;
}

interface Order {
  id: string;
  amountCents: number;
  createdAt: string;
  items: OrderItem[];
  status: string;
  total: number;
  userEmail: string;
  userId: string;
}

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const list = snapshot.docs.map((doc: QueryDocumentSnapshot) => ({
          id: doc.id,
          ...(doc.data() as Omit<Order, 'id'>),
        } as Order));
        setOrders(list);
      } catch (err) {
        console.error('Erro ao carregar pedidos:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
      setOrders(prev =>
        prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
    }
  };

  const openModal = (order: Order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  if (loading) return <Message>Carregando pedidos...</Message>;

  return (
    <Layout>
      <SidebarContainer>
        <Sidebar />
      </SidebarContainer>
      <Main>
        <Title>Pedidos Recebidos</Title>
        <Table>
          <thead>
            <tr>
              <th>ID do Pedido</th>
              <th>Data</th>
              <th>Cliente</th>
              <th>Total (R$)</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{new Date(order.createdAt).toLocaleString('pt-BR')}</td>
                <td>{order.userEmail}</td>
                <td>{(order.amountCents / 100).toFixed(2)}</td>
                <td>
                  <Select
                    value={order.status}
                    onChange={e => handleStatusChange(order.id, e.target.value)}
                  >
                    {STATUS_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>
                        {opt.charAt(0).toUpperCase() + opt.slice(1)}
                      </option>
                    ))}
                  </Select>
                </td>
                <td>
                  <ActionButton onClick={() => openModal(order)}>
                    Ver Detalhes
                  </ActionButton>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {showModal && selectedOrder && (
          <ModalOverlay onClick={closeModal}>
            <ModalContent onClick={e => e.stopPropagation()}>
              <CloseButton onClick={closeModal}>×</CloseButton>
              <h2>Detalhes do Pedido</h2>
              <p><strong>ID:</strong> {selectedOrder.id}</p>
              <p><strong>Data:</strong> {new Date(selectedOrder.createdAt).toLocaleString('pt-BR')}</p>
              <p><strong>Cliente:</strong> {selectedOrder.userEmail}</p>
              <p>
                <strong>Status:</strong>{' '}
                <Select
                  value={selectedOrder.status}
                  onChange={e => handleStatusChange(selectedOrder.id, e.target.value)}
                >
                  {STATUS_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>
                      {opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </option>
                  ))}
                </Select>
              </p>
              <h3>Itens</h3>
              <ul>
                {selectedOrder.items.map(item => (
                  <li key={item.id}>
                    {item.name} x {item.quantity || 1} = R$ {Number(item.price).toFixed(2)}
                  </li>
                ))}
              </ul>
              <p><strong>Total:</strong> R$ {selectedOrder.total.toFixed(2)}</p>
            </ModalContent>
          </ModalOverlay>
        )}
      </Main>
    </Layout>
  );
};

export default AdminOrders;

// Styled Components
const Layout = styled.div`
  display: flex;
  min-height: 100vh;
`;

const SidebarContainer = styled.div`
  width: 240px;
  flex-shrink: 0;
  margin-right: 20px;
`;

const Main = styled.main`
  flex: 1;
  padding: 40px;
  overflow-x: auto;
`;

const Title = styled.h1`
  font-size: 28px;
  margin-bottom: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  th,
  td {
    padding: 12px;
    border-bottom: 1px solid #ddd;
    text-align: left;
  }
  th {
    background: #f0f0f0;
  }
`;

const Select = styled.select`
  padding: 6px;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

const ActionButton = styled.button`
  padding: 6px 12px;
  background: #0070f3;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background: #005bb5;
  }
`;

const Message = styled.p`
  text-align: center;
  margin-top: 100px;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
`;
