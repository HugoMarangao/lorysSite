import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/Configuracao/Firebase/firebaseConf';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

export async function POST(req: NextRequest) {
  try {
    const { items, successUrl, cancelUrl, customer_email, customer_uid } =
      await req.json();

    // 1) monta line_items para Stripe
    let totalCents = 0;
    const line_items = items.map((item: any) => {
      const raw = item.promotion?.trim() ? item.promotion : item.price;
      let s = raw.replace('R$', '').trim();
      if (s.includes(',')) {
        s = s.replace(/\./g, '').replace(',', '.');
      }
      const cents = Math.round(parseFloat(s) * 100);
      totalCents += cents;
      return {
        price_data: {
          currency: 'brl',
          product_data: { name: item.name },
          unit_amount: cents,
        },
        quantity: 1,
      };
    });

    // 2) grava no Firestore com status pending, total em REAIS
    const totalBRL = totalCents / 100;
    const orderRef = await addDoc(collection(db, 'orders'), {
      userEmail: customer_email,
      userId: customer_uid,
      items,
      total: totalBRL,
      amountCents: totalCents,
      status: 'pending',
      createdAt: new Date().toISOString(),
    });

    // 3) cria sessão na Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'boleto'],
      line_items,
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { orderId: orderRef.id },
      customer_email,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Stripe session error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}