'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  User, Package, Download, HelpCircle, LogOut,
  TrendingUp, TrendingDown, BarChart2, IndianRupee,
  Settings, Bell, ChevronRight, Loader2, Star,
  Activity, ShoppingBag, Trophy, Zap
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => { checkUser(); }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/login'); return; }
    setUser(user);

    const [{ data: profileData }, { data: ordersData }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('orders').select('*, product:products(*)').eq('user_id', user.id).order('created_at', { ascending: false })
    ]);

    setProfile(profileData);
    setOrders(ordersData || []);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const paidOrders = orders.filter(o => o.status === 'paid');
  const memberSince = user ? new Date(user.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : '';

  if (loading) return (
    <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-[#00C076]" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0D1117] text-white">
      {/* Header */}
      <header className="border-b border-[#21262D] bg-[#0D1117] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#00C076] rounded-lg flex items-center justify-center font-bold text-[#0D1117] text-sm">P</div>
            <span className="font-semibold text-lg">PaperPe</span>
          </Link>
          <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 bg-[#161B22] border border-[#21262D] rounded-xl px-3 py-1.5">
              <div className="w-6 h-6 bg-[#00C076]/20 rounded-full flex items-center justify-center">
                <User className="w-3 h-3 text-[#00C076]" />
              </div>
              <span className="text-sm text-gray-300">{profile?.full_name || user?.email?.split('@')[0]}</span>
            </div>
            <button onClick={handleLogout} className="text-gray-400 hover:text-red-400 transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-6">

          {/* Sidebar */}
          <div className="col-span-12 md:col-span-3">
            {/* Profile Card */}
            <div className="bg-[#161B22] border border-[#21262D] rounded-2xl p-5 mb-4">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#00C076] to-[#0070f3] rounded-full flex items-center justify-center text-2xl font-bold text-white mb-3">
                  {(profile?.full_name || user?.email || 'U')[0].toUpperCase()}
                </div>
                <h3 className="font-semibold text-white">{profile?.full_name || 'Trader'}</h3>
                <p className="text-gray-400 text-xs mt-1">{user?.email}</p>
                <div className="mt-3 px-3 py-1 bg-[#00C076]/10 border border-[#00C076]/20 rounded-full text-[#00C076] text-xs">
                  Member since {memberSince}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-[#0D1117] rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-white">{paidOrders.length}</p>
                  <p className="text-xs text-gray-400">Purchases</p>
                </div>
                <div className="bg-[#0D1117] rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-[#00C076]">₹10L</p>
                  <p className="text-xs text-gray-400">Virtual</p>
                </div>
              </div>
            </div>

            {/* Nav */}
            <nav className="space-y-1">
              {[
                { id: 'overview', icon: BarChart2, label: 'Overview' },
                { id: 'purchases', icon: ShoppingBag, label: 'My Purchases' },
                { id: 'portfolio', icon: TrendingUp, label: 'Portfolio' },
                { id: 'profile', icon: User, label: 'Profile' },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeTab === item.id
                      ? 'bg-[#00C076]/10 text-[#00C076] border border-[#00C076]/20'
                      : 'text-gray-400 hover:bg-[#161B22] hover:text-white'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
              <Link href="/support" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:bg-[#161B22] hover:text-white transition-all">
                <HelpCircle className="w-4 h-4" />
                Support
              </Link>
            </nav>
          </div>

          {/* Main */}
          <div className="col-span-12 md:col-span-9 space-y-6">

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <>
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Virtual Balance', value: '₹10,00,000', icon: IndianRupee, color: '#00C076', sub: 'Starting capital' },
                    { label: "Today's P&L", value: '+₹0', icon: TrendingUp, color: '#00C076', sub: 'No trades today' },
                    { label: 'Total Trades', value: '0', icon: Activity, color: '#3b82f6', sub: 'Start trading' },
                    { label: 'Win Rate', value: '0%', icon: Trophy, color: '#f59e0b', sub: 'Make your first trade' },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-[#161B22] border border-[#21262D] rounded-2xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-gray-400 text-xs">{stat.label}</span>
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${stat.color}20` }}>
                          <stat.icon className="w-3.5 h-3.5" style={{ color: stat.color }} />
                        </div>
                      </div>
                      <p className="text-xl font-bold text-white">{stat.value}</p>
                      <p className="text-xs text-gray-500 mt-1">{stat.sub}</p>
                    </div>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="bg-[#161B22] border border-[#21262D] rounded-2xl p-6">
                  <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#00C076]" />
                    Quick Actions
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { label: 'Start Paper Trading', href: '/trade', color: '#00C076' },
                      { label: 'Browse Indicators', href: '/indicators', color: '#3b82f6' },
                      { label: 'Free Tools', href: '/tools', color: '#8b5cf6' },
                      { label: 'Leaderboard', href: '/leaderboard', color: '#f59e0b' },
                    ].map(action => (
                      <Link
                        key={action.label}
                        href={action.href}
                        className="flex items-center justify-between bg-[#0D1117] border border-[#21262D] hover:border-opacity-60 rounded-xl p-3 text-sm font-medium text-gray-300 hover:text-white transition-all group"
                        style={{ '--hover-color': action.color } as any}
                      >
                        {action.label}
                        <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400" />
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Recent Purchases */}
                <div className="bg-[#161B22] border border-[#21262D] rounded-2xl overflow-hidden">
                  <div className="p-5 border-b border-[#21262D] flex items-center justify-between">
                    <h2 className="font-semibold text-white">Recent Purchases</h2>
                    <button onClick={() => setActiveTab('purchases')} className="text-[#00C076] text-xs hover:underline">View all</button>
                  </div>
                  {paidOrders.length === 0 ? (
                    <div className="p-10 text-center">
                      <ShoppingBag className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-400 text-sm">No purchases yet</p>
                      <Link href="/indicators" className="inline-block mt-3 text-[#00C076] text-sm hover:underline">Browse indicators →</Link>
                    </div>
                  ) : (
                    <div className="divide-y divide-[#21262D]">
                      {paidOrders.slice(0, 3).map(order => (
                        <div key={order.id} className="p-4 flex items-center justify-between">
                          <div>
                            <p className="font-medium text-white text-sm">{order.product?.name}</p>
                            <p className="text-gray-500 text-xs">{new Date(order.created_at).toLocaleDateString('en-IN')}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-[#00C076] text-sm font-medium">₹{order.amount}</span>
                            <Link href={`/api/download/${order.id}`} className="flex items-center gap-1.5 bg-[#0D1117] border border-[#21262D] hover:border-[#00C076]/40 text-gray-300 hover:text-white px-3 py-1.5 rounded-lg text-xs transition-all">
                              <Download className="w-3.5 h-3.5" />
                              Download
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Purchases Tab */}
            {activeTab === 'purchases' && (
              <div className="bg-[#161B22] border border-[#21262D] rounded-2xl overflow-hidden">
                <div className="p-5 border-b border-[#21262D]">
                  <h2 className="font-semibold text-white">All Purchases ({paidOrders.length})</h2>
                </div>
                {paidOrders.length === 0 ? (
                  <div className="p-16 text-center">
                    <Package className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <h3 className="font-medium text-white mb-2">No purchases yet</h3>
                    <p className="text-gray-400 text-sm mb-6">Your purchased indicators will appear here</p>
                    <Link href="/indicators" className="inline-flex items-center gap-2 bg-[#00C076] hover:bg-[#00a865] text-[#0D1117] font-semibold px-6 py-2.5 rounded-xl transition-colors">
                      Browse Indicators
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-[#21262D]">
                    {paidOrders.map(order => (
                      <div key={order.id} className="p-5 flex items-center justify-between hover:bg-[#0D1117]/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-[#00C076]/10 rounded-xl flex items-center justify-center">
                            <Star className="w-5 h-5 text-[#00C076]" />
                          </div>
                          <div>
                            <p className="font-medium text-white">{order.product?.name}</p>
                            <p className="text-gray-400 text-sm">{order.product?.description?.slice(0, 60)}...</p>
                            <p className="text-gray-500 text-xs mt-1">Purchased {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-[#00C076] font-semibold">₹{order.amount}</p>
                            <span className="inline-block px-2 py-0.5 bg-green-500/10 text-green-400 text-xs rounded-full">Paid</span>
                          </div>
                          <Link href={`/api/download/${order.id}`} className="flex items-center gap-2 bg-[#0D1117] border border-[#21262D] hover:border-[#00C076]/40 text-gray-300 hover:text-white px-4 py-2 rounded-xl text-sm transition-all">
                            <Download className="w-4 h-4" />
                            Download
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Portfolio Tab */}
            {activeTab === 'portfolio' && (
              <div className="space-y-4">
                <div className="bg-[#161B22] border border-[#21262D] rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-gray-400 text-sm">Virtual Portfolio Balance</p>
                      <p className="text-4xl font-bold text-white mt-1">₹10,00,000</p>
                      <p className="text-[#00C076] text-sm mt-1">+₹0.00 (0.00%) today</p>
                    </div>
                    <div className="w-16 h-16 bg-[#00C076]/10 rounded-2xl flex items-center justify-center">
                      <IndianRupee className="w-8 h-8 text-[#00C076]" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: 'Invested', value: '₹0' },
                      { label: 'Available', value: '₹10,00,000' },
                      { label: 'Total P&L', value: '₹0' },
                    ].map(item => (
                      <div key={item.label} className="bg-[#0D1117] rounded-xl p-3 text-center">
                        <p className="text-gray-400 text-xs">{item.label}</p>
                        <p className="text-white font-semibold mt-1">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-[#161B22] border border-[#21262D] rounded-2xl p-10 text-center">
                  <TrendingUp className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-white mb-2">No trades yet</h3>
                  <p className="text-gray-400 text-sm mb-6">Start paper trading to see your portfolio here</p>
                  <Link href="/trade" className="inline-flex items-center gap-2 bg-[#00C076] hover:bg-[#00a865] text-[#0D1117] font-bold px-6 py-2.5 rounded-xl transition-colors">
                    Start Trading
                  </Link>
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-[#161B22] border border-[#21262D] rounded-2xl p-6">
                <h2 className="font-semibold text-white mb-6">Profile Settings</h2>
                <div className="space-y-4">
                  {[
                    { label: 'Full Name', value: profile?.full_name || 'Not set', placeholder: 'Your full name' },
                    { label: 'Email', value: user?.email, placeholder: '', readonly: true },
                    { label: 'Phone', value: profile?.phone || 'Not set', placeholder: 'Your phone number' },
                  ].map(field => (
                    <div key={field.label}>
                      <label className="block text-gray-400 text-sm mb-2">{field.label}</label>
                      <input
                        defaultValue={field.value}
                        readOnly={field.readonly}
                        className="w-full bg-[#0D1117] border border-[#21262D] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#00C076] disabled:opacity-50"
                        placeholder={field.placeholder}
                      />
                    </div>
                  ))}
                  <button className="bg-[#00C076] hover:bg-[#00a865] text-[#0D1117] font-bold px-6 py-2.5 rounded-xl transition-colors text-sm">
                    Save Changes
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
