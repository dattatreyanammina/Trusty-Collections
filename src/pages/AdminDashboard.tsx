import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { collection, query, orderBy, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Package, ShoppingCart, Settings, LogOut, Plus, Search, Trash2, Edit3, ExternalLink, Filter, CheckCircle, Truck, Clock, IndianRupee, BarChart3, Zap } from 'lucide-react';
import { format } from 'date-fns';
import { AdminProductForm } from '../components/AdminProductForm';

export function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const prodSnapshot = await getDocs(query(collection(db, 'products'), orderBy('createdAt', 'desc')));
        setProducts(prodSnapshot.docs.map(d => ({ id: d.id, ...d.data() })));

        const orderSnapshot = await getDocs(query(collection(db, 'orders'), orderBy('createdAt', 'desc')));
        setOrders(orderSnapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, 'products/orders');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [location.pathname]);

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status, updatedAt: new Date() });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  const updateProductStock = async (productId: string, inStock: boolean) => {
    try {
      await updateDoc(doc(db, 'products', productId), { inStock, updatedAt: new Date() });
      setProducts(prev => prev.map(product => product.id === productId ? { ...product, inStock } : product));
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `products/${productId}`);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteDoc(doc(db, 'products', id));
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `products/${id}`);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-stone-900 text-white flex flex-col fixed h-full z-10">
        <div className="p-8 border-b border-white/10">
          <Link to="/" className="flex flex-col items-center">
            <span className="text-gold font-serif text-xl font-bold tracking-tight italic">Trusty Collections Portal</span>
          </Link>
        </div>
        
        <nav className="flex-grow p-6 space-y-2">
          <Link to="/admin" className={`flex items-center gap-4 p-4 rounded-lg text-sm font-bold uppercase tracking-widest transition-colors ${location.pathname === '/admin' ? 'bg-maroon text-white shadow-lg' : 'text-stone-400 hover:text-white'}`}>
            <ShoppingCart size={18} />
            Orders
          </Link>
          <Link to="/admin/products" className={`flex items-center gap-4 p-4 rounded-lg text-sm font-bold uppercase tracking-widest transition-colors ${location.pathname === '/admin/products' ? 'bg-maroon text-white shadow-lg' : 'text-stone-400 hover:text-white'}`}>
            <Package size={18} />
            Products
          </Link>
          <Link to="/admin/analytics" className={`flex items-center gap-4 p-4 rounded-lg text-sm font-bold uppercase tracking-widest transition-colors ${location.pathname === '/admin/analytics' ? 'bg-maroon text-white shadow-lg' : 'text-stone-400 hover:text-white'}`}>
            <BarChart3 size={18} />
            Analytics
          </Link>
          <Link to="/admin/settings" className={`flex items-center gap-4 p-4 rounded-lg text-sm font-bold uppercase tracking-widest transition-colors ${location.pathname === '/admin/settings' ? 'bg-maroon text-white shadow-lg' : 'text-stone-400 hover:text-white'}`}>
            <Settings size={18} />
            Settings
          </Link>
        </nav>

        <div className="p-6 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 p-4 text-stone-400 hover:text-red-400 transition-colors text-sm font-bold uppercase tracking-widest w-full"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-grow p-10">
        <Routes>
          {/* Orders Management */}
          <Route path="/" element={
            <div>
              <div className="flex justify-between items-center mb-10">
                <h1 className="text-4xl font-bold text-stone-800 italic">Order Management</h1>
                <div className="flex gap-4">
                  <div className="bg-white rounded-lg p-3 px-6 shadow-sm border border-stone-200 flex items-center gap-3">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Total Revenue</span>
                    <span className="text-xl font-bold text-maroon">₹{orders.filter(o => o.status === 'Paid' || o.status === 'Shipped' || o.status === 'Delivered').reduce((acc, curr) => acc + (curr.productPrice || 0), 0).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-stone-200">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-200">
                      <th className="p-6 text-[10px] uppercase tracking-widest font-bold text-stone-400">Order ID</th>
                      <th className="p-6 text-[10px] uppercase tracking-widest font-bold text-stone-400">Customer</th>
                      <th className="p-6 text-[10px] uppercase tracking-widest font-bold text-stone-400">Product</th>
                      <th className="p-6 text-[10px] uppercase tracking-widest font-bold text-stone-400">Payment</th>
                      <th className="p-6 text-[10px] uppercase tracking-widest font-bold text-stone-400">Status</th>
                      <th className="p-6 text-[10px] uppercase tracking-widest font-bold text-stone-400">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                        <td className="p-6">
                          <span className="font-bold text-maroon font-serif italic text-lg">{order.orderId}</span>
                        </td>
                        <td className="p-6">
                          <p className="font-bold text-stone-800 text-sm">{order.customerName}</p>
                          <p className="text-xs text-stone-400">{order.phone}</p>
                        </td>
                        <td className="p-6">
                          <p className="text-sm font-medium">{order.productTitle}</p>
                          <p className="text-xs text-stone-400 font-bold">₹{order.productPrice?.toLocaleString('en-IN')}</p>
                        </td>
                        <td className="p-6">
                          {order.paymentScreenshot ? (
                            <a href={order.paymentScreenshot} target="_blank" className="flex items-center gap-2 text-xs font-bold text-blue-600 hover:underline">
                              <ExternalLink size={12} />
                              View Proof
                            </a>
                          ) : (
                            <span className="text-[10px] font-bold text-stone-300 italic uppercase">No Proof</span>
                          )}
                          {order.transactionId && <p className="text-[10px] mt-1 text-stone-500">UTR: {order.transactionId}</p>}
                        </td>
                        <td className="p-6">
                          <select 
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className={`text-xs font-bold uppercase tracking-widest px-3 py-2 rounded-lg border-none outline-none ring-1 ring-stone-200 focus:ring-maroon ${order.status === 'Pending' ? 'text-amber-600 bg-amber-50' : order.status === 'Delivered' ? 'text-green-600 bg-green-50' : 'text-blue-600 bg-blue-50'}`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Paid">Paid</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </td>
                        <td className="p-6 text-xs text-stone-400 font-medium">
                          {order.createdAt ? format(order.createdAt.toDate(), 'dd MMM, HH:mm') : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          } />

          {/* Products Management */}
          <Route path="/products" element={
            <div>
              <div className="flex justify-between items-center mb-10">
                <h1 className="text-4xl font-bold text-stone-800 italic">Product Catalog</h1>
                <Link to="/admin/products/add" className="bg-maroon text-white px-8 py-4 rounded-lg font-bold uppercase tracking-widest hover:bg-stone-800 transition-all shadow-lg flex items-center gap-2 group">
                  <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                  Add New Product
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map(product => (
                  <div key={product.id} className="bg-white rounded-xl shadow-lg border border-stone-200 overflow-hidden group">
                    <div className="aspect-[3/4] relative overflow-hidden">
                      <img src={product.images[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="" />
                      <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                          className="w-10 h-10 bg-white text-stone-800 rounded-full flex items-center justify-center shadow-lg hover:bg-gold hover:text-white transition-colors"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button 
                          onClick={() => deleteProduct(product.id)}
                          className="w-10 h-10 bg-white text-red-500 rounded-full flex items-center justify-center shadow-lg hover:bg-red-500 hover:text-white transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <div className="absolute top-4 left-4">
                        <span className="bg-maroon text-white text-[10px] uppercase tracking-widest font-bold px-4 py-1 rounded-full">{product.category}</span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <h3 className="font-serif italic text-xl text-stone-800">{product.title}</h3>
                        <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${product.inStock === false ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                          {product.inStock === false ? 'Out of Stock' : 'In Stock'}
                        </span>
                      </div>
                      <p className="text-stone-500 font-bold mb-3">₹{product.price.toLocaleString('en-IN')}</p>

                      <div className="mb-4">
                        <label className="block text-[9px] uppercase tracking-widest font-bold text-stone-400 mb-1">Availability</label>
                        <select
                          value={product.inStock === false ? 'Out of Stock' : 'In Stock'}
                          onChange={(e) => updateProductStock(product.id, e.target.value === 'In Stock')}
                          className="w-full border border-stone-200 rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-widest bg-stone-50 text-stone-700 outline-none focus:border-maroon"
                        >
                          <option value="In Stock">In Stock</option>
                          <option value="Out of Stock">Out of Stock</option>
                        </select>
                      </div>

                      <Link to={`/product/${product.id}`} className="text-xs font-bold uppercase tracking-widest text-stone-400 hover:text-maroon flex items-center gap-2">
                        <ExternalLink size={12} />
                        View Store Page
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          } />

          <Route path="/products/add" element={<AdminProductForm />} />
          <Route path="/products/edit/:id" element={<AdminProductForm />} />

          {/* Analytics - Monthly Tracking */}
          <Route path="/analytics" element={
            <div>
              <h1 className="text-4xl font-bold text-stone-800 italic mb-10">Sales Analytics</h1>
              
              {/* Monthly Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-gradient-to-br from-maroon to-maroon-dark text-gold p-8 rounded-xl shadow-xl">
                  <p className="text-[10px] uppercase tracking-widest font-bold opacity-80 mb-2">Total Revenue (All Time)</p>
                  <p className="text-4xl font-bold mb-4">₹{orders.filter(o => o.status === 'Paid' || o.status === 'Shipped' || o.status === 'Delivered').reduce((acc, curr) => acc + (curr.totalPrice || curr.productPrice || 0), 0).toLocaleString('en-IN')}</p>
                  <p className="text-xs font-medium opacity-75">{orders.filter(o => o.status === 'Paid' || o.status === 'Shipped' || o.status === 'Delivered').length} orders completed</p>
                </div>
                
                <div className="bg-gradient-to-br from-amber-600 to-amber-700 text-white p-8 rounded-xl shadow-xl">
                  <p className="text-[10px] uppercase tracking-widest font-bold opacity-80 mb-2">Total Products Sold</p>
                  <p className="text-4xl font-bold mb-4">{orders.filter(o => o.status === 'Paid' || o.status === 'Shipped' || o.status === 'Delivered').reduce((acc, curr) => acc + (curr.quantity || 1), 0)}</p>
                  <p className="text-xs font-medium opacity-75">units across all orders</p>
                </div>
                
                <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white p-8 rounded-xl shadow-xl">
                  <p className="text-[10px] uppercase tracking-widest font-bold opacity-80 mb-2">Pending Orders</p>
                  <p className="text-4xl font-bold mb-4">{orders.filter(o => o.status === 'Pending').length}</p>
                  <p className="text-xs font-medium opacity-75">awaiting confirmation</p>
                </div>
              </div>

              {/* Monthly Breakdown Table */}
              <div className="bg-white rounded-xl shadow-xl border border-stone-200 overflow-hidden">
                <div className="p-6 border-b border-stone-200 bg-stone-50">
                  <h3 className="text-lg font-bold text-stone-800">Monthly Sales Breakdown</h3>
                </div>
                
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-stone-200 bg-stone-50">
                      <th className="p-6 text-[10px] uppercase tracking-widest font-bold text-stone-400">Month</th>
                      <th className="p-6 text-[10px] uppercase tracking-widest font-bold text-stone-400">Orders</th>
                      <th className="p-6 text-[10px] uppercase tracking-widest font-bold text-stone-400">Products Sold</th>
                      <th className="p-6 text-[10px] uppercase tracking-widest font-bold text-stone-400">Revenue</th>
                      <th className="p-6 text-[10px] uppercase tracking-widest font-bold text-stone-400">Top Product</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 6 }, (_, i) => {
                      const date = new Date();
                      date.setMonth(date.getMonth() - i);
                      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
                      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
                      
                      const monthOrders = orders.filter(o => {
                        const orderDate = o.createdAt?.toDate?.() || new Date(o.createdAt);
                        return orderDate >= monthStart && orderDate <= monthEnd && (o.status === 'Paid' || o.status === 'Shipped' || o.status === 'Delivered');
                      });
                      
                      const revenue = monthOrders.reduce((acc, curr) => acc + (curr.totalPrice || curr.productPrice || 0), 0);
                      const productCount = monthOrders.reduce((acc, curr) => acc + (curr.quantity || 1), 0);
                      
                      const productMap: Record<string, number> = {};
                      monthOrders.forEach(o => {
                        productMap[o.productTitle] = (productMap[o.productTitle] || 0) + (o.quantity || 1);
                      });
                      const topProduct = Object.entries(productMap).sort(([, a], [, b]) => b - a)[0]?.[0] || '-';

                      return (
                        <tr key={i} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                          <td className="p-6 font-bold text-stone-800">{monthStart.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</td>
                          <td className="p-6 font-bold text-maroon text-lg">{monthOrders.length}</td>
                          <td className="p-6 font-bold text-amber-600 text-lg">{productCount}</td>
                          <td className="p-6 font-bold text-emerald-600 text-lg">₹{revenue.toLocaleString('en-IN')}</td>
                          <td className="p-6 text-xs text-stone-600 max-w-xs truncate">{topProduct}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          } />

          <Route path="/settings" element={
            <div className="max-w-2xl">
              <h1 className="text-4xl font-bold text-stone-800 italic mb-10">Store Settings</h1>
              <div className="bg-white rounded-xl p-10 border border-stone-200 shadow-xl space-y-8">
                <div className="space-y-4">
                  <h3 className="text-xs uppercase tracking-widest font-bold text-stone-400">Payment Configuration</h3>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-sm font-bold text-stone-700">Store Payment Number</label>
                      <input 
                        type="text" 
                        defaultValue="7989840075" 
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg p-4 font-medium outline-none focus:ring-2 focus:ring-maroon" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-stone-700">UPI QR Code</label>
                      <div className="border-2 border-dashed border-stone-200 rounded-xl p-8 flex flex-col items-center justify-center bg-stone-50 group hover:border-gold transition-colors cursor-pointer">
                        <QrCode size={48} className="text-stone-300 group-hover:text-gold transition-colors mb-4" />
                        <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">Upload New QR Image</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <button className="bg-maroon text-white px-10 py-5 rounded-lg font-bold uppercase tracking-widest hover:bg-stone-800 transition-all shadow-xl">
                  Save All Settings
                </button>
              </div>
            </div>
          } />
        </Routes>
      </main>
    </div>
  );
}

// Nested dummy QrCode because I didn't import it in this file
function QrCode({ size, className }: any) {
  return <div style={{ width: size, height: size }} className={`border-4 border-current grid place-items-center ${className}`}>QR</div>;
}
