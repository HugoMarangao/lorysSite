'use client';

import React, { useState } from 'react';
import { useCart } from '@/Configuracao/Context/CartContext';
import { useAuth } from '@/Configuracao/Context/AuthContext';

const CheckoutPage: React.FC = () => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Calcula total em BRL
  const total = cart.reduce((sum, item) => {
    const raw = item.promotion?.trim() ? item.promotion : item.price;
    let str = raw.replace('R$', '').trim();
    if (str.includes(',')) {
      str = str.replace(/\./g, '');
      str = str.replace(',', '.');
    }
    const val = parseFloat(str);
    return sum + (isNaN(val) ? 0 : val);
  }, 0);

  const handleCheckout = async () => {
    if (!user) {
      alert('Você precisa estar logado para finalizar a compra.');
      return;
    }
    setLoading(true);

    try {
      const res = await fetch('/api/checkout/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          successUrl: `${window.location.origin}/`,
          cancelUrl: `${window.location.origin}/checkout/error`,
          customer_email: user.email,
          customer_uid: user.uid,
        }),
      });
      const { url, error } = await res.json();
      if (url) {
        clearCart();
        window.location.href = url;
      } else {
        console.error('Stripe session error:', error);
        window.location.href = '/checkout/error';
      }
    } catch (err) {
      console.error('Fetch error:', err);
      window.location.href = '/checkout/error';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-md mx-auto bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Resumo do Pedido</h1>

        <ul className="divide-y divide-gray-200 mb-6">
          {cart.map((item, i) => (
            <li key={i} className="py-2 flex justify-between">
              <span>{item.name}</span>
              <span>R$ {item.promotion?.trim() ?? item.price}</span>
            </li>
          ))}
        </ul>

        <div className="flex justify-between font-semibold text-lg mb-6">
          <span>Total:</span>
          <span>
            R${' '}
            {total.toLocaleString('pt-BR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>

        <button
          onClick={handleCheckout}
          disabled={loading || cart.length === 0}
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {loading ? 'Aguarde…' : 'Pagar Agora'}
        </button>

        <p className="mt-4 text-sm text-gray-600">
          Você será redirecionado ao Stripe para concluir o pagamento.
        </p>
      </div>
    </div>
  );
};

export default CheckoutPage;