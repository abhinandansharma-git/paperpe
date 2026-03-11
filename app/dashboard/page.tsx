'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { User, Package, Download, HelpCircle, LogOut, ChevronRight, Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setUser(user);
    
    // Fetch orders
    const { data: ordersData } = await supabase
      .from('orders')
      .select('*, product:products(*)')
      .eq('user_id', user.id)
      .eq('status', 'paid')
      .order('created_at', { ascending: false });
    
    setOrders(ordersData || []);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center font-bold text-white">P</div>
            <span className="font-semibold text-xl text-gray-900">PaperPe</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-gray-500 text-sm">{user?.email}</span>
            <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
          <p className="text-gray-500">Manage your purchases and downloads</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="space-y-2">
            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-600 rounded-xl font-medium">
              <Package className="w-5 h-5" />
              My Purchases
            </Link>
            <Link href="/dashboard/profile" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
              <User className="w-5 h-5" />
              Profile
            </Link>
            <Link href="/support" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
              <HelpCircle className="w-5 h-5" />
              Support
            </Link>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900">Your Purchases</h2>
              </div>

              {orders.length === 0 ? (
                <div className="p-12 text-center">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="font-medium text-gray-900 mb-2">No purchases yet</h3>
                  <p className="text-gray-500 text-sm mb-6">Your purchased indicators will appear here</p>
                  <Link href="/indicators" className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                    Browse Indicators
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    <div key={order.id} className="p-6 flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{order.product?.name}</h3>
                        <p className="text-gray-500 text-sm">Purchased on {new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-green-600 text-sm font-medium">Rs {order.amount}</span>
                        <Link 
                          href={`/api/download/${order.id}`}
                          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <Link href="/indicators" className="bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors group">
                <h3 className="font-medium text-gray-900 group-hover:text-blue-600">Browse Indicators</h3>
                <p className="text-gray-500 text-sm">View all available indicators</p>
              </Link>
              <Link href="/tools" className="bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors group">
                <h3 className="font-medium text-gray-900 group-hover:text-blue-600">Free Tools</h3>
                <p className="text-gray-500 text-sm">Use our trading calculators</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
