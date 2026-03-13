'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  IndianRupee, Users, ShoppingBag, Package,
  TrendingUp, Download, Clock, CheckCircle,
  XCircle, Loader2, LogOut, RefreshCw,
  Plus, Edit2, Trash2, Upload, X, Save, AlertTriangle
} from 'lucide-react';

const ADMIN_EMAIL = 'data.abhinandan73@gmail.com';

type Product = {
  id: string; name: string; slug: string; description: string;
  price: number; original_price: number | null; file_url: string | null;
  is_active: boolean; created_at: string;
};

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [token, setToken] = useState('');

  // Product modal
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({ name: '', slug: '', description: '', price: '', original_price: '', is_active: true });
  const [saving, setSaving] = useState(false);

  // Upload modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadProduct, setUploadProduct] = useState<Product | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Delete confirm
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ msg: string; type: 'ok' | 'err' } | null>(null);

  const showToast = (msg: string, type: 'ok' | 'err' = 'ok') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => { init(); }, []);

  const init = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.email !== ADMIN_EMAIL) { router.push('/dashboard'); return; }
    const { data: { session } } = await supabase.auth.getSession();
    if (session) setToken(session.access_token);
    await fetchData();
  };

  const authHeaders = () => ({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' });

  const fetchData = async () => {
    setRefreshing(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    setToken(session.access_token);
    const res = await fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${session.access_token}` } });
    if (res.ok) setData(await res.json());
    setLoading(false);
    setRefreshing(false);
  };

  // ── Product CRUD ──
  const openAddProduct = () => {
    setEditingProduct(null);
    setProductForm({ name: '', slug: '', description: '', price: '', original_price: '', is_active: true });
    setShowProductModal(true);
  };

  const openEditProduct = (p: Product) => {
    setEditingProduct(p);
    setProductForm({
      name: p.name, slug: p.slug, description: p.description || '',
      price: String(p.price), original_price: p.original_price ? String(p.original_price) : '',
      is_active: p.is_active,
    });
    setShowProductModal(true);
  };

  const saveProduct = async () => {
    if (!productForm.name || !productForm.slug || !productForm.price) {
      showToast('Name, slug, and price are required', 'err'); return;
    }
    setSaving(true);
    const payload = {
      ...(editingProduct ? { id: editingProduct.id } : {}),
      name: productForm.name,
      slug: productForm.slug,
      description: productForm.description,
      price: Number(productForm.price),
      original_price: productForm.original_price ? Number(productForm.original_price) : null,
      is_active: productForm.is_active,
    };
    const res = await fetch('/api/admin/products', {
      method: editingProduct ? 'PUT' : 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    const result = await res.json();
    setSaving(false);
    if (res.ok) {
      showToast(editingProduct ? 'Product updated' : 'Product created');
      setShowProductModal(false);
      fetchData();
    } else {
      showToast(result.error || 'Failed', 'err');
    }
  };

  const confirmDelete = async () => {
    if (!deleteProduct) return;
    setDeleting(true);
    const res = await fetch(`/api/admin/products?id=${deleteProduct.id}`, {
      method: 'DELETE', headers: authHeaders(),
    });
    const result = await res.json();
    setDeleting(false);
    if (res.ok) {
      showToast('Product deleted');
      setDeleteProduct(null);
      fetchData();
    } else {
      showToast(result.error || 'Delete failed', 'err');
    }
  };

  // ── File Upload ──
  const openUpload = (p: Product) => {
    setUploadProduct(p);
    setUploadFile(null);
    setShowUploadModal(true);
  };

  const handleUpload = async () => {
    if (!uploadFile || !uploadProduct) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', uploadFile);
    fd.append('productId', uploadProduct.id);
    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });
    const result = await res.json();
    setUploading(false);
    if (res.ok) {
      showToast(`File uploaded for ${uploadProduct.name}`);
      setShowUploadModal(false);
      fetchData();
    } else {
      showToast(result.error || 'Upload failed', 'err');
    }
  };

  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/'); };

  if (loading) return (
    <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-[#00C076]" />
    </div>
  );

  const { stats, orders, users, products } = data || {};

  const statCards = [
    { label: 'Total Revenue', value: `₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`, icon: IndianRupee, color: '#00C076', sub: `${stats?.totalOrders || 0} paid orders` },
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: '#3b82f6', sub: 'Registered accounts' },
    { label: 'Products', value: stats?.totalProducts || 0, icon: Package, color: '#8b5cf6', sub: 'Active listings' },
    { label: 'Pending Orders', value: stats?.pendingOrders || 0, icon: Clock, color: '#f59e0b', sub: 'Awaiting payment' },
  ];

  return (
    <div className="min-h-screen bg-[#0D1117] text-white">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[100] px-4 py-3 rounded-xl text-sm font-medium shadow-lg border animate-fade-in-up ${
          toast.type === 'ok' ? 'bg-[#00C076]/10 border-[#00C076]/30 text-[#00C076]' : 'bg-red-500/10 border-red-500/30 text-red-400'
        }`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <header className="border-b border-[#21262D] bg-[#0D1117] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center font-bold text-white text-sm">A</div>
            <span className="font-semibold text-lg">PaperPe Admin</span>
            <span className="bg-red-500/10 text-red-400 text-xs px-2 py-0.5 rounded-full border border-red-500/20 hidden sm:inline">Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchData} disabled={refreshing} className="flex items-center gap-2 bg-[#161B22] border border-[#21262D] hover:border-gray-600 text-gray-300 px-3 py-1.5 rounded-lg text-sm transition-all">
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} /> Refresh
            </button>
            <button onClick={handleLogout} className="text-gray-400 hover:text-red-400 transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-1 bg-[#161B22] border border-[#21262D] rounded-xl p-1 mb-8 w-fit overflow-x-auto">
          {['overview', 'orders', 'users', 'products'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all whitespace-nowrap ${
                activeTab === tab ? 'bg-[#0D1117] text-white shadow' : 'text-gray-400 hover:text-white'
              }`}>{tab}</button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
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
            <div className="p-5 border-b border-[#21262D]"><h2 className="font-semibold text-white">All Orders ({orders?.length || 0})</h2></div>
            <OrdersTable orders={orders || []} />
          </div>
        )}

        {/* Users */}
        {activeTab === 'users' && (
          <div className="bg-[#161B22] border border-[#21262D] rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-[#21262D]"><h2 className="font-semibold text-white">All Users ({users?.length || 0})</h2></div>
            {(users || []).length === 0 ? (
              <div className="p-16 text-center"><Users className="w-12 h-12 text-gray-600 mx-auto mb-3" /><p className="text-gray-400">No users yet</p></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-[#21262D] text-gray-400 text-xs">
                    <th className="text-left p-4 font-medium">User</th>
                    <th className="text-left p-4 font-medium">Joined</th>
                    <th className="text-left p-4 font-medium">Phone</th>
                  </tr></thead>
                  <tbody className="divide-y divide-[#21262D]">
                    {(users || []).map((u: any) => (
                      <tr key={u.id} className="hover:bg-[#0D1117]/50">
                        <td className="p-4"><div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-[#00C076]/10 rounded-full flex items-center justify-center text-[#00C076] font-bold text-sm">{(u.full_name || 'U')[0].toUpperCase()}</div>
                          <div><p className="text-white font-medium">{u.full_name || 'Unknown'}</p><p className="text-gray-400 text-xs">{u.id?.slice(0, 16)}...</p></div>
                        </div></td>
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
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-white text-lg">Products ({products?.length || 0})</h2>
              <button onClick={openAddProduct} className="flex items-center gap-2 bg-[#00C076] hover:bg-[#00a865] text-[#0D1117] font-semibold px-4 py-2 rounded-xl text-sm transition-colors">
                <Plus className="w-4 h-4" /> Add Product
              </button>
            </div>

            {(products || []).length === 0 ? (
              <div className="bg-[#161B22] border border-[#21262D] rounded-2xl p-16 text-center">
                <Package className="w-12 h-12 text-gray-600 mx-auto mb-3" /><p className="text-gray-400">No products yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(products || []).map((p: Product) => (
                  <div key={p.id} className="bg-[#161B22] border border-[#21262D] rounded-2xl p-5 hover:border-[#30363D] transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-white">{p.name}</h3>
                          {!p.is_active && <span className="text-xs bg-red-500/10 text-red-400 px-2 py-0.5 rounded-full">Inactive</span>}
                        </div>
                        <p className="text-gray-500 text-xs mt-0.5">{p.slug}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[#00C076] font-bold text-lg">₹{p.price}</p>
                        {p.original_price && <p className="text-gray-500 text-xs line-through">₹{p.original_price}</p>}
                      </div>
                    </div>
                    {p.description && <p className="text-gray-400 text-xs mb-4 line-clamp-2">{p.description}</p>}

                    {/* File status */}
                    <div className="flex items-center justify-between mb-4">
                      {p.file_url ? (
                        <span className="flex items-center gap-1.5 text-green-400 text-xs bg-green-500/10 px-2.5 py-1 rounded-full">
                          <CheckCircle className="w-3.5 h-3.5" /> File uploaded
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-yellow-400 text-xs bg-yellow-500/10 px-2.5 py-1 rounded-full">
                          <AlertTriangle className="w-3.5 h-3.5" /> No file
                        </span>
                      )}
                      <button onClick={() => openUpload(p)} className="flex items-center gap-1.5 text-xs text-[#00C076] hover:text-white transition-colors">
                        <Upload className="w-3.5 h-3.5" /> {p.file_url ? 'Replace' : 'Upload'} file
                      </button>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-3 border-t border-[#21262D]">
                      <button onClick={() => openEditProduct(p)} className="flex items-center gap-1.5 bg-[#21262D] hover:bg-[#30363D] text-white px-3 py-1.5 rounded-lg text-xs transition-colors flex-1 justify-center">
                        <Edit2 className="w-3 h-3" /> Edit
                      </button>
                      <button onClick={() => setDeleteProduct(p)} className="flex items-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-1.5 rounded-lg text-xs transition-colors flex-1 justify-center">
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Product Modal ── */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4" onClick={() => setShowProductModal(false)}>
          <div className="bg-[#161B22] border border-[#21262D] rounded-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-[#21262D]">
              <h3 className="font-semibold text-white">{editingProduct ? 'Edit Product' : 'Add Product'}</h3>
              <button onClick={() => setShowProductModal(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Name *</label>
                <input value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full bg-[#0D1117] border border-[#21262D] rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#00C076] outline-none" placeholder="ARIA SUPREME" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Slug * <span className="text-gray-600">(URL-friendly, no spaces)</span></label>
                <input value={productForm.slug} onChange={e => setProductForm({ ...productForm, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                  className="w-full bg-[#0D1117] border border-[#21262D] rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#00C076] outline-none" placeholder="aria-supreme" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Description</label>
                <textarea value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} rows={3}
                  className="w-full bg-[#0D1117] border border-[#21262D] rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#00C076] outline-none resize-none" placeholder="Product description..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Price (₹) *</label>
                  <input type="number" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full bg-[#0D1117] border border-[#21262D] rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#00C076] outline-none" placeholder="2999" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Original Price (₹)</label>
                  <input type="number" value={productForm.original_price} onChange={e => setProductForm({ ...productForm, original_price: e.target.value })}
                    className="w-full bg-[#0D1117] border border-[#21262D] rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#00C076] outline-none" placeholder="5999" />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={productForm.is_active} onChange={e => setProductForm({ ...productForm, is_active: e.target.checked })}
                  className="w-4 h-4 rounded accent-[#00C076]" />
                <span className="text-sm text-gray-300">Active (visible on store)</span>
              </label>
            </div>
            <div className="flex justify-end gap-3 p-5 border-t border-[#21262D]">
              <button onClick={() => setShowProductModal(false)} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">Cancel</button>
              <button onClick={saveProduct} disabled={saving}
                className="flex items-center gap-2 bg-[#00C076] hover:bg-[#00a865] text-[#0D1117] font-semibold px-5 py-2 rounded-xl text-sm transition-colors disabled:opacity-50">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {editingProduct ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Upload Modal ── */}
      {showUploadModal && uploadProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4" onClick={() => setShowUploadModal(false)}>
          <div className="bg-[#161B22] border border-[#21262D] rounded-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-[#21262D]">
              <h3 className="font-semibold text-white">Upload File — {uploadProduct.name}</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              {uploadProduct.file_url && (
                <div className="flex items-center gap-2 text-xs text-yellow-400 bg-yellow-500/10 px-3 py-2 rounded-lg">
                  <AlertTriangle className="w-3.5 h-3.5" /> This will replace the existing file
                </div>
              )}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#21262D] hover:border-[#00C076]/50 rounded-xl p-8 text-center cursor-pointer transition-colors"
              >
                <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                {uploadFile ? (
                  <p className="text-white text-sm font-medium">{uploadFile.name} <span className="text-gray-500">({(uploadFile.size / 1024).toFixed(1)} KB)</span></p>
                ) : (
                  <>
                    <p className="text-gray-400 text-sm">Click to select file</p>
                    <p className="text-gray-600 text-xs mt-1">.pine, .txt, or .zip — max 5MB</p>
                  </>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept=".pine,.txt,.zip" className="hidden"
                onChange={e => setUploadFile(e.target.files?.[0] || null)} />
            </div>
            <div className="flex justify-end gap-3 p-5 border-t border-[#21262D]">
              <button onClick={() => setShowUploadModal(false)} className="px-4 py-2 text-sm text-gray-400 hover:text-white">Cancel</button>
              <button onClick={handleUpload} disabled={!uploadFile || uploading}
                className="flex items-center gap-2 bg-[#00C076] hover:bg-[#00a865] text-[#0D1117] font-semibold px-5 py-2 rounded-xl text-sm transition-colors disabled:opacity-50">
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />} Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ── */}
      {deleteProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4" onClick={() => setDeleteProduct(null)}>
          <div className="bg-[#161B22] border border-[#21262D] rounded-2xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Delete {deleteProduct.name}?</h3>
              <p className="text-gray-400 text-sm">This cannot be undone. Products with paid orders cannot be deleted.</p>
            </div>
            <div className="flex gap-3 p-5 border-t border-[#21262D]">
              <button onClick={() => setDeleteProduct(null)} className="flex-1 py-2 text-sm text-gray-400 hover:text-white bg-[#21262D] rounded-xl transition-colors">Cancel</button>
              <button onClick={confirmDelete} disabled={deleting}
                className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-xl text-sm transition-colors disabled:opacity-50">
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />} Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function OrdersTable({ orders }: { orders: any[] }) {
  if (orders.length === 0) return (
    <div className="p-16 text-center"><ShoppingBag className="w-12 h-12 text-gray-600 mx-auto mb-3" /><p className="text-gray-400">No orders yet</p></div>
  );
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead><tr className="border-b border-[#21262D] text-gray-400 text-xs">
          <th className="text-left p-4 font-medium">Order ID</th>
          <th className="text-left p-4 font-medium">Product</th>
          <th className="text-left p-4 font-medium">Amount</th>
          <th className="text-left p-4 font-medium">Status</th>
          <th className="text-left p-4 font-medium">Date</th>
          <th className="text-left p-4 font-medium">Download</th>
        </tr></thead>
        <tbody className="divide-y divide-[#21262D]">
          {orders.map((order: any) => (
            <tr key={order.id} className="hover:bg-[#0D1117]/50">
              <td className="p-4 text-gray-400 text-xs font-mono">{order.id?.slice(0, 12)}...</td>
              <td className="p-4 text-white font-medium">{order.product?.name || '—'}</td>
              <td className="p-4 text-[#00C076] font-semibold">₹{order.amount}</td>
              <td className="p-4">
                {order.status === 'paid' ? (
                  <span className="flex items-center gap-1 text-green-400 text-xs bg-green-500/10 px-2 py-1 rounded-full w-fit"><CheckCircle className="w-3 h-3" /> Paid</span>
                ) : order.status === 'created' ? (
                  <span className="flex items-center gap-1 text-yellow-400 text-xs bg-yellow-500/10 px-2 py-1 rounded-full w-fit"><Clock className="w-3 h-3" /> Pending</span>
                ) : (
                  <span className="flex items-center gap-1 text-red-400 text-xs bg-red-500/10 px-2 py-1 rounded-full w-fit"><XCircle className="w-3 h-3" /> {order.status}</span>
                )}
              </td>
              <td className="p-4 text-gray-400 text-xs">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
              <td className="p-4">{order.status === 'paid' && (
                <a href={`/api/download/${order.id}`} className="flex items-center gap-1 text-[#00C076] hover:underline text-xs"><Download className="w-3.5 h-3.5" /> Download</a>
              )}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
