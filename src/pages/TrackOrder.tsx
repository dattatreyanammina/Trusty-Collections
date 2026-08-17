import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Search, Loader2, Package, MapPin, CheckCircle2, Clock, Truck, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import { useSearchParams } from 'react-router-dom';

export function TrackOrder() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('orderId') || '');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const orderIdParam = searchParams.get('orderId');
    if (orderIdParam) {
      performSearch(orderIdParam);
    }
  }, [searchParams]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    performSearch(search.trim());
  };

  const performSearch = async (queryStr: string) => {
    setLoading(true);
    setSearched(true);
    try {
      const q = query(
        collection(db, 'orders'), 
        where('orderId', '==', queryStr.toUpperCase())
      );
      const snapshot = await getDocs(q);
      
      let results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Also try searching by phone if ID fails
      if (results.length === 0) {
        const qPhone = query(
          collection(db, 'orders'),
          where('phone', '==', queryStr)
        );
        const snapshotPhone = await getDocs(qPhone);
        results = snapshotPhone.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }

      setOrders(results.sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
    } catch (error) {
      console.error(error);
      // alert("Error searching for order.");
    } finally {
      setLoading(false);
    }
  };

  const statusSteps = ['Pending', 'Paid', 'Shipped', 'Delivered'];
  const statusIcons: any = {
    'Pending': <Clock size={24} />,
    'Paid': <CheckCircle2 size={24} />,
    'Shipped': <Truck size={24} />,
    'Delivered': <Home size={24} />,
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-20 min-h-[70vh]">
      <div className="text-center mb-16 px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-maroon italic mb-4 font-serif">Track Your Heritage</h1>
        <p className="text-stone-500 uppercase tracking-widest text-[10px] font-bold">Discover the journey of your curated fashion</p>
      </div>

      <div className="bg-white border border-gold/20 p-2 shadow-2xl mb-12">
        <div className="border border-gold/30 p-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-6">
            <div className="flex-grow relative group">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-gold group-focus-within:text-maroon transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Order ID or Mobile Number" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border-b border-stone-200 py-4 pl-8 pr-4 outline-none focus:border-maroon transition-colors text-stone-800 placeholder-stone-300 font-serif"
              />
            </div>
            <button 
              disabled={loading}
              className="bg-stone-900 text-gold px-12 py-4 font-bold uppercase tracking-[0.2em] hover:bg-maroon transition-all flex items-center justify-center gap-3 shadow-lg active:scale-95 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin text-gold" size={20} /> : 'Track Journey'}
            </button>
          </form>
        </div>
      </div>

      <AnimatePresence>
        {searched && orders.length > 0 && orders.map(order => (
          <motion.div 
            key={order.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-stone-100 shadow-2xl mb-12 overflow-hidden"
          >
            <div className="bg-[#fcf8f0] p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-gold/10">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 border border-gold/30 flex items-center justify-center text-maroon italic font-serif text-3xl shrink-0">L</div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-gold block mb-2">Exclusive Order</span>
                  <span className="text-2xl font-bold text-stone-900 font-serif italic leading-none">{order.orderId}</span>
                </div>
              </div>
              <div className="text-left md:text-right flex flex-col gap-2">
                <span className="text-[10px] uppercase tracking-widest font-bold text-stone-400 block">Status Timeline</span>
                <span className={`inline-flex items-center gap-2 px-6 py-2 rounded-none text-[10px] font-bold uppercase tracking-widest shadow-sm ${order.status === 'Pending' ? 'bg-stone-900 text-gold' : order.status === 'Delivered' ? 'bg-green-700 text-white' : 'bg-maroon text-gold'}`}>
                  {order.status}
                </span>
              </div>
            </div>

            <div className="p-10">
              {/* Progress Stepper */}
              <div className="relative flex justify-between mb-24 px-4">
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-stone-100 -translate-y-1/2"></div>
                <div 
                  className="absolute top-1/2 left-0 h-[1px] bg-gold -translate-y-1/2 transition-all duration-1000"
                  style={{ width: `${(statusSteps.indexOf(order.status) / (statusSteps.length - 1)) * 100}%` }}
                ></div>

                {statusSteps.map((step, idx) => {
                  const isActive = statusSteps.indexOf(order.status) >= idx;
                  const isCurrent = order.status === step;
                  return (
                    <div key={step} className="relative z-10 flex flex-col items-center">
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-700 ${isActive ? 'bg-maroon text-gold border border-gold shadow-xl scale-110' : 'bg-white text-stone-200 border border-stone-100'}`}>
                        {statusIcons[step]}
                      </div>
                      <div className="absolute -bottom-10 flex flex-col items-center">
                        <span className={`text-[9px] uppercase tracking-[0.2em] font-bold whitespace-nowrap ${isActive ? 'text-maroon' : 'text-stone-300'}`}>
                          {step}
                        </span>
                        {isCurrent && <div className="w-1 h-1 bg-gold rounded-full mt-2 animate-bounce" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mt-16 bg-[#fcf8f0]/50 p-10 border border-gold/5">
                <div>
                  <h3 className="text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-6 flex items-center gap-3 border-b border-gold/10 pb-3">
                    <Package size={14} className="text-gold" />
                    Product Reserved
                  </h3>
                  <div className="flex gap-6">
                    <div className="w-20 h-24 bg-stone-100 ethnic-border overflow-hidden shrink-0 shadow-md">
                      <img src="https://via.placeholder.com/100" className="w-full h-full object-cover" alt="" />
                    </div>
                    <div>
                      <p className="font-serif italic text-xl text-stone-900 leading-tight mb-2">{order.productTitle}</p>
                      <p className="text-maroon font-serif text-lg">₹{order.productPrice?.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-6 flex items-center gap-3 border-b border-gold/10 pb-3">
                    <MapPin size={14} className="text-gold" />
                    Dispatch Address
                  </h3>
                  <div className="space-y-2">
                    <p className="text-stone-900 font-bold text-sm">{order.customerName}</p>
                    <p className="text-stone-500 text-xs leading-relaxed italic">{order.address}</p>
                    <p className="text-stone-700 text-xs font-bold tracking-widest">{order.pincode}</p>
                  </div>
                  <div className="mt-8 pt-6 border-t border-gold/10">
                    <p className="text-[9px] uppercase tracking-widest font-bold text-gold mb-1">Reservation Date</p>
                    <p className="text-xs font-serif italic text-stone-500">
                      {order.createdAt ? format(order.createdAt.toDate(), 'PPP p') : 'Processing...'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {searched && !loading && orders.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 bg-white border border-gold/10 shadow-lg"
          >
            <p className="text-stone-300 font-serif italic text-2xl mb-2">No records found</p>
            <p className="text-stone-400 text-[10px] uppercase tracking-widest font-bold font-sans">Please verify your credentials and retry</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
