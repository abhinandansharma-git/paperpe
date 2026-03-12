'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

declare global {
  interface Window { Razorpay: any; }
}

interface BuyButtonProps {
  productId: string;
  productName: string;
  price: number;
  color?: string;
}

export default function BuyButton({ productId, productName, price, color = 'orange' }: BuyButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const loadRazorpay = () => new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  const handleBuy = async () => {
    setLoading(true);

    // Check auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login?redirect=/indicators');
      setLoading(false);
      return;
    }

    const loaded = await loadRazorpay();
    if (!loaded) {
      alert('Razorpay failed to load. Please try again.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          email: user.email,
          name: user.user_metadata?.full_name || user.email?.split('@')[0],
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create order');

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'PaperPe',
        description: data.productName,
        order_id: data.orderId,
        prefill: {
          name: user.user_metadata?.full_name || '',
          email: user.email || '',
        },
        theme: { color: '#F97316' },
        handler: async (response: any) => {
          const verifyRes = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...response,
              email: user.email,
              productId,
              productName: data.productName,
              userId: user.id,
              amount: price,
            }),
          });

          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            router.push('/dashboard?payment=success');
          } else {
            alert('Payment verification failed. Contact support@paperpe.in');
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error: any) {
      console.error(error);
      alert(error.message || 'Failed to initiate payment');
    } finally {
      setLoading(false);
    }
  };

  const colorClasses: Record<string, string> = {
    orange: 'bg-orange-500 hover:bg-orange-600',
    green: 'bg-green-500 hover:bg-green-600',
    blue: 'bg-blue-500 hover:bg-blue-600',
    purple: 'bg-purple-500 hover:bg-purple-600',
  };

  return (
    <button
      onClick={handleBuy}
      disabled={loading}
      className={`w-full py-3 px-6 rounded-lg font-bold text-white transition-colors disabled:opacity-60 ${colorClasses[color] || colorClasses.orange}`}
    >
      {loading ? 'Processing...' : `Buy Now — ₹${price}`}
    </button>
  );
}
