'use client';

import { useState } from 'react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface BuyButtonProps {
  productId: string;
  productName: string;
  price: number;
  color?: string;
}

export default function BuyButton({ productId, productName, price, color = 'orange' }: BuyButtonProps) {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleBuy = async () => {
    if (!email || !name) {
      alert('Please enter your name and email');
      return;
    }

    setLoading(true);
    
    const loaded = await loadRazorpay();
    if (!loaded) {
      alert('Razorpay failed to load');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, email, name }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'PaperPe',
        description: data.productName,
        order_id: data.orderId,
        prefill: { name, email },
        theme: { color: '#F97316' },
        handler: async (response: any) => {
          const verifyRes = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...response,
              email,
              productId,
              productName: data.productName,
            }),
          });
          
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            alert('Payment successful! Check your email for the indicator file.');
            setShowModal(false);
          } else {
            alert('Payment verification failed. Contact support.');
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      alert('Failed to initiate payment');
    } finally {
      setLoading(false);
    }
  };

  const colorClasses = {
    orange: 'bg-orange-500 hover:bg-orange-600',
    green: 'bg-green-500 hover:bg-green-600',
    blue: 'bg-blue-500 hover:bg-blue-600',
    purple: 'bg-purple-500 hover:bg-purple-600',
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`w-full py-3 px-6 rounded-lg font-bold text-white transition-colors ${colorClasses[color as keyof typeof colorClasses] || colorClasses.orange}`}
      >
        Buy Now - {String.fromCharCode(8377)}{price}
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1e222d] rounded-xl p-6 max-w-md w-full border border-[#2a2e39]">
            <h3 className="text-xl font-bold text-white mb-4">Buy {productName}</h3>
            <p className="text-gray-400 mb-4">Enter your details to receive the indicator file via email.</p>
            
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#131722] border border-[#2a2e39] text-white mb-3"
            />
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#131722] border border-[#2a2e39] text-white mb-4"
            />
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 rounded-lg border border-[#2a2e39] text-gray-400 hover:bg-[#2a2e39]"
              >
                Cancel
              </button>
              <button
                onClick={handleBuy}
                disabled={loading}
                className={`flex-1 py-3 rounded-lg font-bold text-white ${colorClasses[color as keyof typeof colorClasses] || colorClasses.orange} disabled:opacity-50`}
              >
                {loading ? 'Processing...' : `Pay ${String.fromCharCode(8377)}${price}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
