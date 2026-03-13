'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  IndianRupee, Users, ShoppingBag, Package,
  TrendingUp, Download, Clock, CheckCircle,
  XCircle, Loader2, LogOut, RefreshCw,
  Plus, Edit2, Trash2, Eye
} from 'lucide-react';

const ADMIN_EMAIL = 'data.abhinandan73@gmail.com';

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { init(); }, []);

  const init = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.email !== ADMIN_EMAIL) {
      router.push('/dashboard');
      return;
    }
    await fetchData();
  };

  const fetchData = async () => {
    setRefreshing(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const res = await fetch('/api/admin/stats', {
      headers: { Authorization: `Bearer ${session.access_token}` }
    });
    if (res.ok) {
      setData(await res.json());
    }
    setLoading(false);
    setRefreshing(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-[#00C076]" />
    </div>
  );

  const { stats, orders, users, products } = data || {};

  const statCards = [
    { label: 'Total Revenue', value: `₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`, icon: IndianRupee, color: '#00C076', sub: `${stats?.totalOrders} paid orders` },
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: '#3b82f6', sub: 'Registered accounts' },
    { label: 'Products', value: stats?.totalProducts || 0, icon: Package, color: '#8b5cf6', sub: 'Active listings' },
    { label: 'Pending Orders', value: stats?.pendingOrders || 0, icon: Clock, color: '#f59e0b', sub: 'Awaiting payment' },
  ];

  return (
    <div className="min-h-screen bg-[#0D1117] text-white">
      {/* Header */}
      <header className="border-b border-[#21262D] bg-[#0D1117] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center font-bold text-white text-sm">A</div>
            <span className="font-semibold text-lg">PaperPe Admin</span>
            <span className="bg-red-500/10 text-red-400 text-xs px-2 py-0.5 rounded-full border border-red-500/20">Admin Panel</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchData} disabled={refreshing} className="flex items-center gap-2 bg-[#161B22] border border-[#21262D] hover:border-gray-600 text-gray-300 px-3 py-1.5 rounded-lg text-sm transition-all">
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button onClick={handleLogout} className="text-gray-400 hover:text-red-400 transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-1 bg-[#161B22] border border-[#21262D] rounded-xl p-1 mb-8 w-fit">
          {['overview', 'orders', 'users', 'products'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                activeTab === tab ? 'bg-[#0D1117] text-white shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {statCards.map(card => (
                <div key={card.label} className="bg-[#161B22] border border-[#21262D] rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-400 text-xs">{card.label}</span>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${card.color}20` }}>
                      <card.icon className="w-4 h-4" style={{ color: card.color }} />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-white">{card.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{card.sub}</p>
                </div>
              ))}
            </div>

            {/* Recent Orders */}
            <div className="bg-[#161B22] border border-[#21262D] rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-[#21262D] flex items-center justify-between">
                <h2 className="font-semibold text-white">Recent Orders</h2>
                <button onClick={() => setActiveTab('orders')} className="text-[#00C076] text-xs hover:underline">View all</button>
              </div>
              <OrdersTable orders={(orders || []).slice(0, 10)} />
            </div>
          </div>
        )}

        {/* Orders */}
        {activeTab === 'orders' && (
          <div className="bg-[#161B22] border border-[#21262D] rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-[#21262D]">
              <h2 className="font-semibold text-white">All Orders ({orders?.length || 0})</h2>
            </div>
            <OrdersTable orders={orders || []} />
          </div>
        )}

        {/* Users */}
        {activeTab === 'users' && (
          <div className="bg-[#161B22] border border-[#21262D] rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-[#21262D]">
              <h2 className="font-semibold text-white">All Users ({users?.length || 0})</h2>
            </div>
            {(users || []).length === 0 ? (
              <div className="p-16 text-center">
                <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">No users yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#21262D] text-gray-400 text-xs">
                      <th className="text-left p-4 font-medium">User</th>
                      <th className="text-left p-4 font-medium">Joined</th>
                      <th className="text-left p-4 font-medium">Phone</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#21262D]">
                    {(users || []).map((u: any) => (
                      <tr key={u.id} className="hover:bg-[#0D1117]/50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-[#00C076]/10 rounded-full flex items-center justify-center text-[#00C076] font-bold text-sm">
                              {(u.full_name || 'U')[0].toUpperCase()}
                            </div>
                            <div>
                              <p className="text-white font-medium">{u.full_name || 'Unknown'}</p>
                              <p className="text-gray-400 text-xs">{u.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-gray-400 text-xs">{new Date(u.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                        <td className="p-4 text-gray-400 text-xs">{u.phone || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Products */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button className="flex items-center gap-2 bg-[#00C076] hover:bg-[#00a865] text-[#0D1117] font-semibold px-4 py-2 rounded-xl text-sm transition-colors">
                <Plus className="w-4 h-4" />
                Add Product
              </button>
            </div>
            <div className="bg-[#161B22] border border-[#21262D] rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-[#21262D]">
                <h2 className="font-semibold text-white">Products ({products?.length || 0})</h2>
              </div>
              {(products || []).length === 0 ? (
                <div className="p-16 text-center">
                  <Package className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">No products yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#21262D] text-gray-400 text-xs">
                        <th className="text-left p-4 font-medium">Product</th>
                        <th className="text-left p-4 font-medium">Price</th>
                        <th className="text-left p-4 font-medium">File</th>
                        <th className="text-left p-4 font-medium">Created</th>
                        <th className="text-left p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#21262D]">
                      {(products || []).map((p: any) => (
                        <tr key={p.id} className="hover:bg-[#0D1117]/50 transition-colors">
                          <td className="p-4">
                            <p className="text-white font-medium">{p.name}</p>
                            <p className="text-gray-400 text-xs mt-0.5 line-clamp-1">{p.description}</p>
                          </td>
                          <td className="p-4 text-[#00C076] font-semibold">₹{p.price}</td>
                          <td className="p-4">
                            {p.file_url ? (
                              <span className="flex items-center gap-1 text-green-400 text-xs">
                                <CheckCircle className="w-3.5 h-3.5" /> Uploaded
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-yellow-400 text-xs">
                                <Clock className="w-3.5 h-3.5" /> Missing
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-gray-400 text-xs">{new Date(p.created_at).toLocaleDateString('en-IN')}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <button className="p-1.5 hover:bg-[#21262D] rounded-lg transition-colors text-gray-400 hover:text-white">
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors text-gray-400 hover:text-red-400">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function OrdersTable({ orders }: { orders: any[] }) {
  if (orders.length === 0) return (
    <div className="p-16 text-center">
      <ShoppingBag className="w-12 h-12 text-gray-600 mx-auto mb-3" />
      <p className="text-gray-400">No orders yet</p>
    </div>
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#21262D] text-gray-400 text-xs">
            <th className="text-left p-4 font-medium">Order ID</th>
            <th className="text-left p-4 font-medium">Product</th>
            <th className="text-left p-4 font-medium">Amount</th>
            <th className="text-left p-4 font-medium">Status</th>
            <th className="text-left p-4 font-medium">Date</th>
            <th className="text-left p-4 font-medium">Download</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#21262D]">
          {orders.map((order: any) => (
            <tr key={order.id} className="hover:bg-[#0D1117]/50 transition-colors">
              <td className="p-4 text-gray-400 text-xs font-mono">{order.id?.slice(0, 12)}...</td>
              <td className="p-4 text-white font-medium">{order.product?.name || '—'}</td>
              <td className="p-4 text-[#00C076] font-semibold">₹{order.amount}</td>
              <td className="p-4">
                {order.status === 'paid' ? (
                  <span className="flex items-center gap-1 text-green-400 text-xs bg-green-500/10 px-2 py-1 rounded-full w-fit">
                    <CheckCircle className="w-3 h-3" /> Paid
                  </span>
                ) : order.status === 'created' ? (
                  <span className="flex items-center gap-1 text-yellow-400 text-xs bg-yellow-500/10 px-2 py-1 rounded-full w-fit">
                    <Clock className="w-3 h-3" /> Pending
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-red-400 text-xs bg-red-500/10 px-2 py-1 rounded-full w-fit">
                    <XCircle className="w-3 h-3" /> {order.status}
                  </span>
                )}
              </td>
              <td className="p-4 text-gray-400 text-xs">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
              <td className="p-4">
                {order.status === 'paid' && (
                  <a href={`/api/download/${order.id}`} className="flex items-center gap-1 text-[#00C076] hover:underline text-xs">
                    <Download className="w-3.5 h-3.5" /> Download
                  </a>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
