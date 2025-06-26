import { NextResponse, NextRequest } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/Configuracao/Firebase/firebaseConf';
import { doc, setDoc } from 'firebase/firestore';

export const config = { api: { bodyParser: false } };

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-05-28.basil' });
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature')!;
  const rawBody = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature error:', err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId as string;
      await setDoc(doc(db, 'orders', orderId), {
        status: 'paid',
        paidAt: new Date().toISOString(),
        sessionId: session.id,
      }, { merge: true });
      break;
    }
    case 'checkout.session.async_payment_failed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId as string;
      await setDoc(doc(db, 'orders', orderId), {
        status: 'failed',
        updatedAt: new Date().toISOString(),
      }, { merge: true });
      break;
    }
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return new Response(null, { status: 200 });
}