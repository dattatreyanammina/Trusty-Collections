import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, getDoc, addDoc, collection, serverTimestamp, updateDoc } from 'firebase/firestore';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save, X, Loader2, Image as ImageIcon } from 'lucide-react';

export function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  
  const [imageUrlInput, setImageUrlInput] = useState('');
  
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    async function fetchProduct() {
      if (!isEdit) return;
      try {
        const snapshot = await getDoc(doc(db, 'products', id));
        if (snapshot.exists()) {
          const data = snapshot.data();
          reset(data);
          setImageUrls(data.images || []);
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, `products/${id}`);
      }
    }
    fetchProduct();
  }, [id, isEdit, reset]);

  const removeImage = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: any) => {
    if (imageUrls.length === 0) {
      alert("Please upload at least one image.");
      return;
    }

    setLoading(true);
    const opPath = isEdit ? `products/${id}` : 'products';
    const opType = isEdit ? OperationType.UPDATE : OperationType.CREATE;

    try {
      const productData = {
        ...data,
        price: Number(data.price),
        images: imageUrls,
        updatedAt: serverTimestamp(),
      };

      if (isEdit) {
        await updateDoc(doc(db, 'products', id), productData);
      } else {
        await addDoc(collection(db, 'products'), {
          ...productData,
          createdAt: serverTimestamp(),
        });
      }
      navigate('/admin/products');
    } catch (err) {
      handleFirestoreError(err, opType, opPath);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-10">
        <button onClick={() => navigate('/admin/products')} className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-stone-400 hover:text-maroon shadow transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-4xl font-bold text-stone-800 italic">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Left Column: Details */}
          <div className="bg-white p-8 rounded-xl shadow-xl border border-stone-200 space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Product Title</label>
              <input {...register('title', { required: true })} className="w-full border-b-2 border-stone-100 py-3 outline-none focus:border-gold transition-colors font-serif italic text-xl" placeholder="Ex: Premium Silk Saree" />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Price (₹)</label>
                <input type="number" {...register('price', { required: true })} className="w-full border-b-2 border-stone-100 py-3 outline-none focus:border-gold transition-colors font-bold" placeholder="5999" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Category</label>
                <select {...register('category', { required: true })} className="w-full border-b-2 border-stone-100 py-4 outline-none focus:border-gold transition-colors text-xs font-bold uppercase tracking-widest bg-transparent">
                  <option value="Saree">Saree</option>
                  <option value="Dress">Dress</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Description</label>
              <textarea {...register('description')} rows={6} className="w-full bg-stone-50 rounded-lg p-4 outline-none focus:ring-1 focus:ring-maroon transition-colors text-sm font-medium resize-none" placeholder="Details about fabric, work, occasion..." />
            </div>
          </div>

          {/* Right Column: Images */}
          <div className="bg-white p-8 rounded-xl shadow-xl border border-stone-200 space-y-6">
            <h3 className="text-xs uppercase tracking-widest font-bold text-stone-400 mb-4">Product Images ({imageUrls.length}/10)</h3>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              {imageUrls.map((url, i) => (
                <div key={i} className="aspect-square relative group rounded-lg overflow-hidden border border-stone-100">
                  <img src={url} className="w-full h-full object-cover" alt="" />
                  <button 
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                  {i === 0 && <span className="absolute bottom-0 left-0 w-full bg-gold text-[8px] font-bold uppercase text-white py-1 text-center">Primary</span>}
                </div>
              ))}
            </div>

            <div className="bg-stone-50 p-4 rounded-lg space-y-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="text-gold shrink-0" size={16} />
                <span className="text-[10px] uppercase tracking-widest font-bold text-stone-500">Add by URL (Fallback)</span>
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  className="flex-grow bg-white border border-stone-200 px-3 py-2 text-xs outline-none focus:border-gold transition-colors"
                  placeholder="https://images.unsplash.com/..."
                />
                <button 
                  type="button"
                  onClick={() => {
                    const url = imageUrlInput.trim();
                    if (!url) return;
                    
                    if (url.startsWith('data:')) {
                      alert("Please do not paste base64 image data here. It will make the website slow. Use a direct image URL instead.");
                      return;
                    }
                    
                    if (!url.startsWith('http')) {
                      alert("Please enter a valid image URL leading with http:// or https://");
                      return;
                    }
                    
                    setImageUrls(prev => [...prev, url]);
                    setImageUrlInput('');
                  }}
                  className="bg-stone-900 text-gold px-4 py-2 text-[10px] font-bold uppercase tracking-widest"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="bg-stone-50 p-4 rounded-lg flex items-start gap-3">
              <ImageIcon className="text-gold shrink-0 mt-0.5" size={16} />
              <p className="text-[10px] text-stone-500 leading-relaxed font-medium">
                Add product images using direct image URLs only. Firebase Storage upload is disabled due to account restrictions.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-6">
          <button 
            type="button"
            onClick={() => navigate('/admin/products')}
            className="px-10 py-5 text-stone-400 font-bold uppercase tracking-widest hover:text-stone-800 transition-colors"
          >
            Discard
          </button>
          <button 
            type="submit"
            disabled={loading}
            className="bg-maroon text-gold-light px-16 py-5 rounded-lg font-bold uppercase tracking-[0.2em] shadow-2xl hover:bg-stone-900 transition-all flex items-center gap-3 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
            {isEdit ? 'Update Product' : 'Publish Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
