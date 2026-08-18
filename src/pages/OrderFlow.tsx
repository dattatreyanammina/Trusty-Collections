import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, addDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, QrCode, ArrowRight, ShieldCheck, CreditCard, Loader2, Minus, Plus } from 'lucide-react';

const pattuLadyBanyanImg = '/images/pattu_saree_banyan_lady_1786950627044.jpg';
const brideBanyanPattuImg = '/images/banyan_pattu_bride_1786950686742.jpg';
const heritageBanyanSilkImg = '/images/heritage_banyan_silk_1786950642861.jpg';

type Step = 'Details' | 'Payment' | 'Success';

const CURATED_SAMPLE_ITEMS: Record<string, any> = {
  'lfw-kanchi-01': { title: 'Royal Crimson & Gold Temple Zari Kanchipuram Pattu Saree', price: 18500, images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop'] },
  'lfw-dharm-02': { title: 'Peacock Teal & Mustard Dharmavaram Pure Silk Saree', price: 14200, images: [pattuLadyBanyanImg] },
  'lfw-bride-03': { title: 'Muhurtham Gold Brocade Pure Bridal Pattu Saree', price: 24800, images: [brideBanyanPattuImg] },
  'lfw-gadwal-04': { title: 'Emerald Green Heritage Gadwal Zari Border Saree', price: 11900, images: [heritageBanyanSilkImg] },
  'lfw-paith-05': { title: 'Royal Magenta Vintage Paithani Silk Saree', price: 16500, images: ['https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=1200&auto=format&fit=crop'] },
  'lfw-dress-06': { title: 'Handcrafted Heritage Pattu Silk Anarkali Dress Set', price: 12500, images: ['https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=1200&auto=format&fit=crop'] }
};

export function OrderFlow() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('Details');
  const [product, setProduct] = useState<any>(null);
  const [orderDocId, setOrderDocId] = useState<string | null>(null);
  const [orderDataForEmail, setOrderDataForEmail] = useState<any>(null);
  const [generatedOrderId, setGeneratedOrderId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  useEffect(() => {
    async function fetchProduct() {
      if (!productId) return;
      if (CURATED_SAMPLE_ITEMS[productId]) {
        setProduct({ id: productId, ...CURATED_SAMPLE_ITEMS[productId] });
        return;
      }
      try {
        const snapshot = await getDoc(doc(db, 'products', productId));
        if (snapshot.exists()) {
          setProduct({ id: snapshot.id, ...snapshot.data() });
        } else {
          setProduct({ id: productId, title: 'Traditional Silk Saree', price: 15000, images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop'] });
        }
      } catch (error) {
        setProduct({ id: productId, title: 'Traditional Silk Saree', price: 15000, images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop'] });
      }
    }
    fetchProduct();
  }, [productId]);

  const onDetailsSubmit = async (data: any) => {
    setLoading(true);
    try {
      const orderId = 'LFW-' + Math.floor(100000 + Math.random() * 900000);
      const totalPrice = product.price * quantity;
      const orderData = {
        ...data,
        orderId,
        productId,
        productTitle: product.title,
        productPrice: product.price,
        quantity,
        totalPrice,
        status: 'Pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      const docRef = await addDoc(collection(db, 'orders'), orderData);
      setOrderDocId(docRef.id);
      setOrderDataForEmail(orderData);
      setGeneratedOrderId(orderId);
      
      setStep('Payment');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'orders');
    } finally {
      setLoading(false);
    }
  };

  const handleTransactionSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const transId = formData.get('transactionId') as string;
    
    if (!transId || !orderDocId) return;

    setLoading(true);
    try {
      await updateDoc(doc(db, 'orders', orderDocId), {
        transactionId: transId,
        updatedAt: serverTimestamp()
      });

      if (orderDataForEmail) {
        fetch('/api/send-confirmation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: orderDataForEmail.customerEmail,
            orderId: orderDataForEmail.orderId,
            customerName: orderDataForEmail.customerName,
            productTitle: orderDataForEmail.productTitle,
            productPrice: orderDataForEmail.productPrice,
            totalPrice: orderDataForEmail.totalPrice,
            quantity: orderDataForEmail.quantity,
            address: orderDataForEmail.address,
            pincode: orderDataForEmail.pincode,
            phone: orderDataForEmail.phone
          }),
        }).catch(err => console.error("[OrderFlow] Email trigger failed:", err));
      }

      setStep('Success');
    } catch (error: any) {
      console.error("UTR submission error:", error);
      alert(`Failed to record Reference ID: ${error.message || 'Unknown error'}`);
      try {
        handleFirestoreError(error, OperationType.UPDATE, `orders/${orderDocId}`);
      } catch (e) {}
    } finally {
      setLoading(false);
    }
  };

  if (!product) return <div className="py-20 text-center">Loading product...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 min-h-[80vh]">
      {/* Stepper */}
      <div className="flex items-center justify-center mb-16 px-4">
        {['Details', 'Payment', 'Success'].map((s, i) => (
          <div key={s} className="flex items-center">
            <div className={`w-12 h-12 rounded-none border flex items-center justify-center font-serif text-lg transition-all duration-500 shadow-sm ${step === s || (step === 'Success' && i < 3) ? 'bg-maroon text-gold border-gold' : 'bg-white text-stone-300 border-stone-100 opacity-50'}`}>
              {step === 'Success' && i < 3 ? <CheckCircle2 size={24} /> : `0${i + 1}`}
            </div>
            {i < 2 && <div className={`w-20 h-[1px] mx-1 ${step === 'Payment' || step === 'Success' ? 'bg-gold' : 'bg-stone-100'}`} />}
          </div>
        ))}
      </div>

      <div className="bg-white border border-gold/10 p-1 shadow-2xl">
        <div className="bg-white border border-gold/20 p-8 md:p-14">
          <AnimatePresence mode="wait">
            {step === 'Details' && (
              <motion.div 
                key="details"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex flex-col md:flex-row gap-8 mb-12 pb-10 border-b border-stone-100">
                  <div className="w-24 h-32 ethnic-border shrink-0">
                    <img src={product.images[0]} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="pt-2 flex-grow">
                    <h2 className="text-3xl font-serif font-bold text-stone-900 italic mb-2">{product.title}</h2>
                    <div className="inline-block bg-maroon text-gold px-3 py-1 text-xs font-bold font-serif mb-3 italic shadow-sm tracking-wide">Premium Product Selection</div>
                    <p className="text-maroon font-serif text-xl font-bold mb-4">₹{product.price.toLocaleString('en-IN')}</p>
                    
                    {/* Quantity Selector */}
                    <div className="flex items-center gap-4">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Quantity:</label>
                      <div className="flex items-center gap-2 border border-gold/30 rounded">
                        <button 
                          type="button"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="p-2 hover:bg-gold/10 transition-colors"
                        >
                          <Minus size={16} className="text-maroon" />
                        </button>
                        <span className="w-10 text-center font-bold text-lg text-maroon">{quantity}</span>
                        <button 
                          type="button"
                          onClick={() => setQuantity(quantity + 1)}
                          className="p-2 hover:bg-gold/10 transition-colors"
                        >
                          <Plus size={16} className="text-maroon" />
                        </button>
                      </div>
                      <span className="text-sm font-bold text-gold">Total: ₹{(product.price * quantity).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-10">
                  <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-gold mb-1">Reservation Form</h3>
                  <h4 className="text-2xl font-serif italic text-stone-900">Shipping Details</h4>
                </div>
                
                <form onSubmit={handleSubmit(onDetailsSubmit)} className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-2 group">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 group-focus-within:text-maroon transition-colors">Recipient Name</label>
                      <input {...register('customerName', { required: true })} className="w-full bg-white border-b border-stone-200 py-3 px-1 outline-none focus:border-maroon transition-colors font-serif text-lg" placeholder="e.g. Anjali Sharma" />
                    </div>
                    <div className="space-y-2 group">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 group-focus-within:text-maroon transition-colors">Contact Mobile</label>
                      <input {...register('phone', { required: true })} className="w-full bg-white border-b border-stone-200 py-3 px-1 outline-none focus:border-maroon transition-colors font-serif text-lg" placeholder="+91 XXXXX XXXXX" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-2 group">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 group-focus-within:text-maroon transition-colors">Email Address</label>
                      <input type="email" {...register('customerEmail', { required: true })} className="w-full bg-white border-b border-stone-200 py-3 px-1 outline-none focus:border-maroon transition-colors font-serif text-lg" placeholder="your@email.com" />
                    </div>
                    <div className="space-y-2 group">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 group-focus-within:text-maroon transition-colors">Delivery Pincode</label>
                      <input {...register('pincode', { required: true })} className="w-full bg-white border-b border-stone-200 py-3 px-1 outline-none focus:border-maroon transition-colors font-serif text-lg" placeholder="000000" />
                    </div>
                  </div>
                  <div className="space-y-2 group">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 group-focus-within:text-maroon transition-colors">Complete Dispatch Address</label>
                    <textarea {...register('address', { required: true })} rows={3} className="w-full bg-white border-b border-stone-200 py-3 px-1 outline-none focus:border-maroon transition-colors resize-none font-serif text-lg" placeholder="Apartment, Street, Landmark, City, State" />
                  </div>
                  <button 
                    disabled={loading}
                    className="w-full bg-stone-900 text-gold py-6 font-bold uppercase tracking-[0.3em] hover:bg-maroon transition-all flex items-center justify-center gap-4 shadow-2xl transform active:scale-95 group overflow-hidden relative"
                  >
                    <div className="absolute inset-0 bg-maroon translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                    <span className="relative z-10">{loading ? 'Encrypting Details...' : 'Confirm & Proceed to Payment'}</span>
                    <ArrowRight size={20} className="relative z-10 group-hover:translate-x-2 transition-transform shadow-sm" />
                  </button>
                </form>
              </motion.div>
            )}

            {step === 'Payment' && (
              <motion.div 
                key="payment"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                {/* Order Summary */}
                <div className="bg-gradient-to-r from-maroon-dark to-maroon text-gold p-8 mb-12 shadow-lg">
                  <h2 className="text-[10px] uppercase tracking-[0.4em] font-bold mb-4">Order Summary</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center max-w-md mx-auto">
                      <span className="font-serif italic">Product:</span>
                      <span className="font-bold">{product.title.substring(0, 30)}...</span>
                    </div>
                    <div className="flex justify-between items-center max-w-md mx-auto">
                      <span className="font-serif italic">Quantity:</span>
                      <span className="font-bold">{quantity} x ₹{product.price.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="border-t border-gold/30 pt-3 flex justify-between items-center max-w-md mx-auto">
                      <span className="font-serif italic text-lg font-bold">Total Amount:</span>
                      <span className="text-2xl font-bold">₹{(product.price * quantity).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Instructions */}
                <div className="bg-[#fcf8f0] border-2 border-gold p-12 mb-12 shadow-lg rounded-lg">
                  <h3 className="text-3xl font-serif font-bold text-stone-900 italic mb-2">Complete Your Payment</h3>
                  <p className="text-stone-600 text-sm mb-8 font-serif">Transfer the exact amount using UPI to confirm your order</p>
                  
                  {/* Payment Number Card */}
                  <div className="bg-white border-4 border-gold rounded-2xl p-12 mb-8 shadow-xl inline-block max-w-md w-full">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-6">UPI Payment Number</p>
                    <div className="bg-gradient-to-r from-gold-deep via-gold to-gold-light bg-clip-text text-transparent mb-8">
                      <p className="text-8xl font-bold tracking-wider leading-tight">7989840075</p>
                    </div>
                    <div className="flex justify-center">
                      <button 
                        type="button"
                        onClick={() => navigator.clipboard.writeText('7989840075')} 
                        className="w-full bg-maroon text-gold px-6 py-3 text-[11px] font-bold uppercase tracking-widest rounded-lg hover:bg-stone-900 transition-all"
                      >
                        📋 Copy Number
                      </button>
                    </div>
                  </div>

                  {/* Payment Steps */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
                    <div className="bg-stone-50 p-4 rounded-lg border-l-4 border-gold">
                      <div className="text-2xl font-bold text-gold mb-2">1</div>
                      <p className="text-xs text-stone-600">Copy the payment number above</p>
                    </div>
                    <div className="bg-stone-50 p-4 rounded-lg border-l-4 border-gold">
                      <div className="text-2xl font-bold text-gold mb-2">2</div>
                      <p className="text-xs text-stone-600">Open your UPI app (Google Pay, PhonePe, etc.)</p>
                    </div>
                    <div className="bg-stone-50 p-4 rounded-lg border-l-4 border-gold">
                      <div className="text-2xl font-bold text-gold mb-2">3</div>
                      <p className="text-xs text-stone-600">Send exact amount. Save transaction ID</p>
                    </div>
                  </div>

                  {/* UTR Form */}
                  <div className="space-y-8 max-w-sm mx-auto">
                    <form onSubmit={handleTransactionSubmit} className="space-y-4">
                      <div className="space-y-2 text-left">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">UPI Transaction Reference (UTR)</label>
                          {step === 'Upload' && <span className="text-[10px] text-green-600 font-bold flex items-center gap-1"><CheckCircle2 size={12} /> ID Recorded</span>}
                        </div>
                        <input name="transactionId" required placeholder="12-digit Numeric ID" className="w-full bg-white border-b border-gold/20 py-3 px-1 outline-none focus:border-maroon transition-colors text-lg font-serif italic placeholder-stone-200" />
                      </div>
                      <button 
                        type="submit"
                        disabled={loading}
                        className="w-full bg-stone-900 text-gold py-4 font-bold text-xs uppercase tracking-widest hover:bg-maroon transition-all shadow-md disabled:bg-stone-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <>
                            <Loader2 size={14} className="animate-spin" />
                            <span>Processing...</span>
                          </>
                        ) : (
                          <span>Submit Reference ID</span>
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 'Success' && (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10"
              >
                <div className="w-24 h-24 border border-gold flex items-center justify-center mx-auto mb-10 text-gold relative animate-pulse">
                  <div className="absolute inset-0 border-4 border-gold/10 animate-ping" />
                  <CheckCircle2 size={48} strokeWidth={1} />
                </div>
                <h2 className="text-2xl uppercase tracking-[0.4em] font-bold text-gold mb-4">Reservation Successful</h2>
                <h3 className="text-4xl md:text-6xl text-stone-900 font-bold mb-6 font-serif italic text-maroon">With Deep Gratitude</h3>
                <p className="text-stone-600 mb-12 px-10 font-serif leading-relaxed text-lg italic">Your exquisite selection is now reserved. Our curators will verify the transaction and update your journey status shortly.</p>
                
                <div className="bg-[#fcf8f0] border border-gold/10 p-10 mb-12 text-left max-w-sm mx-auto shadow-sm">
                  <div className="flex border-b border-gold/10 pb-6 mb-6 justify-between items-center">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-gold">Manifest Reference</span>
                    <span className="font-bold text-stone-900 font-serif text-lg italic">{generatedOrderId}</span>
                  </div>
                  <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-stone-400 text-center">Reference this ID for all future inquiries.</p>
                </div>

                <div className="flex flex-col gap-5 max-w-xs mx-auto">
                  <button 
                    onClick={() => navigate('/')}
                    className="bg-stone-900 text-gold py-5 font-bold uppercase tracking-[0.3em] hover:bg-maroon transition-all shadow-xl active:scale-95"
                  >
                    Examine More Curations
                  </button>
                  <button 
                    onClick={() => navigate('/track')}
                    className="text-stone-400 text-[10px] uppercase tracking-widest font-bold hover:text-maroon transition-colors border-b border-stone-100 pb-1 mx-auto"
                  >
                    Track Manifest
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
