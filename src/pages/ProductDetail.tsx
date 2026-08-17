import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { motion } from 'motion/react';
import { ShoppingBag, ChevronRight, Share2, Info, Truck, ShieldCheck, Heart, Sparkles, CheckCircle2, MessageCircle } from 'lucide-react';
import { Product } from '../types';

// Curated lookup in case route is accessed for sample traditional item
const CURATED_LOOKUP: Record<string, Product> = {
  'lfw-kanchi-01': {
    id: 'lfw-kanchi-01',
    title: 'Royal Crimson & Gold Temple Zari Kanchipuram Pattu Saree',
    description: 'Woven with certified pure mulberry silk and authentic tested gold zari. Features age-old temple gopuram motifs along the korvai border, intricate Mayil (peacock) and Kamalam (lotus) motifs across the body, and an opulent brocade pallu. Comes with an unstitched contrast silk blouse piece.',
    price: 18500,
    category: 'Pattu Saree',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop',
      '/src/assets/images/banyan_pattu_bride_1786950686742.jpg',
      '/src/assets/images/pattu_saree_banyan_lady_1786950627044.jpg'
    ],
    inStock: true,
    createdAt: new Date().toISOString()
  },
  'lfw-dharm-02': {
    id: 'lfw-dharm-02',
    title: 'Peacock Teal & Mustard Dharmavaram Pure Silk Saree',
    description: 'Exquisite contrast border with intricate floral jaal and traditional mayil (peacock) buttis woven in certified pure silk. Handcrafted by master artisans with soft drape and rich luster.',
    price: 14200,
    category: 'Pattu Saree',
    images: [
      '/src/assets/images/pattu_saree_banyan_lady_1786950627044.jpg',
      'https://images.unsplash.com/photo-1583391733965-0da3c8d76378?q=80&w=1200&auto=format&fit=crop'
    ],
    inStock: true,
    createdAt: new Date().toISOString()
  },
  'lfw-bride-03': {
    id: 'lfw-bride-03',
    title: 'Muhurtham Gold Brocade Pure Bridal Pattu Saree',
    description: 'The crowning jewel for sacred wedding ceremonies, inspired by ancient royal heritage with heavy zari weave throughout the body, designed to capture eternal beauty and divine blessings under the sacred banyan canopy.',
    price: 24800,
    category: 'Pattu Saree',
    images: [
      '/src/assets/images/banyan_pattu_bride_1786950686742.jpg',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop'
    ],
    inStock: true,
    createdAt: new Date().toISOString()
  },
  'lfw-gadwal-04': {
    id: 'lfw-gadwal-04',
    title: 'Emerald Green Heritage Gadwal Zari Border Saree',
    description: 'Lightweight cotton-silk body coupled with rich pure silk pattu pallu and solid gold zari borders. Perfect for temple visits, festive pujas, and traditional family celebrations.',
    price: 11900,
    category: 'Pattu Saree',
    images: [
      '/src/assets/images/heritage_banyan_silk_1786950642861.jpg',
      'https://images.unsplash.com/photo-1583391733965-0da3c8d76378?q=80&w=1200&auto=format&fit=crop'
    ],
    inStock: true,
    createdAt: new Date().toISOString()
  },
  'lfw-paith-05': {
    id: 'lfw-paith-05',
    title: 'Royal Magenta Vintage Paithani Silk Saree',
    description: 'Dazzling traditional tapestry weave with signature kaleidoscopic pallu and pure gold zari floral border. Handwoven on traditional pit-looms.',
    price: 16500,
    category: 'Pattu Saree',
    images: [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=1200&auto=format&fit=crop',
      '/src/assets/images/pattu_saree_banyan_lady_1786950627044.jpg'
    ],
    inStock: true,
    createdAt: new Date().toISOString()
  },
  'lfw-dress-06': {
    id: 'lfw-dress-06',
    title: 'Handcrafted Heritage Pattu Silk Anarkali Dress Set',
    description: 'Floor-length pure silk ethnic ensemble adorned with antique zari borders and pure organza hand-embroidered dupatta. Regal charm and modern comfort in unison.',
    price: 12500,
    category: 'Dress',
    images: [
      'https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=1200&auto=format&fit=crop',
      '/src/assets/images/heritage_banyan_silk_1786950642861.jpg'
    ],
    inStock: true,
    createdAt: new Date().toISOString()
  }
};

export function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      
      // Check local curated lookup first
      if (CURATED_LOOKUP[id]) {
        setProduct(CURATED_LOOKUP[id]);
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, 'products', id);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          setProduct({ id: snapshot.id, ...snapshot.data() });
        } else {
          // Fallback to first curated item if doc not found
          setProduct(CURATED_LOOKUP['lfw-kanchi-01']);
        }
      } catch (error) {
        console.error("Error fetching product, defaulting to curated item:", error);
        setProduct(CURATED_LOOKUP['lfw-kanchi-01']);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-20 animate-pulse flex flex-col md:flex-row gap-12">
      <div className="w-full md:w-1/2 aspect-[4/5] bg-stone-200" />
      <div className="w-full md:w-1/2 space-y-4">
        <div className="h-4 bg-stone-200 w-1/4" />
        <div className="h-10 bg-stone-200 w-3/4" />
        <div className="h-6 bg-stone-200 w-1/4" />
        <div className="h-40 bg-stone-200 w-full" />
      </div>
    </div>
  );

  if (!product) return <div className="py-40 text-center font-serif text-xl text-maroon">Traditional design not found.</div>;

  const imagesList = product.images && product.images.length > 0 
    ? product.images 
    : ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop'];

  return (
    <div className="bg-[#FAF6EE] text-stone-900 min-h-screen">
      {/* Temple Zari band at top */}
      <div className="temple-zari-band" />

      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 py-5 text-[11px] uppercase tracking-widest text-stone-500 flex items-center gap-2 border-b border-gold/20 mb-8">
        <Link to="/" className="hover:text-maroon font-semibold transition-colors">Home</Link>
        <ChevronRight size={13} className="text-gold" />
        <span className="hover:text-maroon transition-colors">{product.category || 'Pattu Saree'}</span>
        <ChevronRight size={13} className="text-gold" />
        <span className="text-maroon font-bold truncate max-w-[200px]">{product.title}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-24 flex flex-col lg:flex-row gap-12 lg:gap-16">
        
        {/* Images Implementation with Traditional Framing */}
        <div className="w-full lg:w-1/2 flex flex-col-reverse md:flex-row gap-4">
          <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto no-scrollbar shrink-0">
            {imagesList.map((img: string, i: number) => (
              <button 
                key={i} 
                onClick={() => setActiveImg(i)}
                className={`w-20 md:w-24 aspect-[3/4] border transition-all ${
                  activeImg === i 
                    ? 'border-maroon ring-2 ring-gold shadow-lg' 
                    : 'border-gold/30 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} className="w-full h-full object-cover" alt={`Thumb ${i}`} referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>

          <div className="flex-grow aspect-[3/4] relative ethnic-border overflow-hidden bg-white shadow-xl">
            <motion.img 
              key={activeImg}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              src={imagesList[activeImg]} 
              className="w-full h-full object-cover"
              alt={product.title}
              referrerPolicy="no-referrer"
            />
            
            {/* Traditional Top Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <span className="bg-maroon-dark/95 text-gold border border-gold text-[10px] font-bold px-3 py-1 shadow-xl uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles size={11} />
                Traditional Handloom Silk
              </span>
            </div>

            <div className="absolute top-4 right-4">
              <span className="bg-gold text-maroon-dark text-[10px] font-bold px-3 py-1 shadow-lg uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck size={13} />
                Pure Silk Mark
              </span>
            </div>
          </div>
        </div>

        {/* Product Details & Purchase */}
        <div className="w-full lg:w-1/2">
          
          <div className="flex items-center justify-between mb-3">
            <span className="text-gold-deep uppercase tracking-[0.3em] text-[11px] font-bold border-b border-gold/40 pb-1">
              ॥ శ్రీ లక్ష్మీ పట్టు కలెక్షన్ ॥
            </span>
            <div className="flex gap-4 text-stone-400">
              <button className="hover:text-maroon transition-colors" title="Share Saree"><Share2 size={18} /></button>
              <button className="hover:text-red-500 transition-colors" title="Save to Favorites"><Heart size={18} /></button>
            </div>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl text-maroon font-serif font-bold mb-4 italic leading-tight">
            {product.title}
          </h1>
          
          {/* Pricing & Savings */}
          <div className="flex items-center gap-6 mb-8 border-y border-gold/30 py-5 bg-white/40 px-4">
            <div className="flex flex-col">
              <span className="text-stone-400 line-through text-xs font-sans">MRP ₹{(product.price * 1.25).toLocaleString('en-IN')}</span>
              <span className="text-4xl font-bold text-maroon font-serif leading-none">₹{product.price.toLocaleString('en-IN')}</span>
              <span className="text-[10px] text-emerald-800 font-semibold uppercase mt-1">Inclusive of all taxes & Free Express Delivery</span>
            </div>
            <div className="bg-maroon text-gold text-[10px] font-bold px-3 py-2 uppercase tracking-wider border border-gold">
              Save 20% Special
            </div>
          </div>

          {/* Description */}
          <div className="space-y-6">
            <div className="bg-white p-6 border border-gold/30 shadow-sm relative ethnic-border">
              <h3 className="text-xs uppercase tracking-widest font-bold text-maroon mb-3 flex items-center gap-2">
                <Info size={15} className="text-gold" />
                Weave & Fabric Specifications
              </h3>
              <p className="text-stone-600 font-sans leading-relaxed text-sm mb-4">
                {product.description || "Indulge in the regal heritage of handwoven pure silk. Adorned with sacred temple border motifs, authentic tested zari, and dyed with natural luster."}
              </p>

              <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-xs pt-3 border-t border-stone-100 text-stone-700">
                <div><strong>Fabric:</strong> 100% Pure Mulberry Silk</div>
                <div><strong>Zari:</strong> Authentic Tested Gold/Silver</div>
                <div><strong>Length:</strong> 6.25 Meters (with Blouse)</div>
                <div><strong>Craft:</strong> Traditional Handloom</div>
                <div><strong>Origin:</strong> South Indian Weaving Hub</div>
                <div><strong>Care:</strong> Dry Clean Only</div>
              </div>
            </div>

            {/* Trust Markers */}
            <div className="grid grid-cols-2 gap-4 py-2 text-[10px] uppercase tracking-widest font-bold text-stone-600">
              <div className="flex items-center gap-3 p-3 bg-white border border-gold/20">
                <div className="w-9 h-9 border border-gold rounded-full flex items-center justify-center text-gold bg-maroon shrink-0">
                  <Truck size={16} />
                </div>
                <span>Express All-India Delivery</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white border border-gold/20">
                <div className="w-9 h-9 border border-gold rounded-full flex items-center justify-center text-gold bg-maroon shrink-0">
                  <ShieldCheck size={16} />
                </div>
                <span>100% Silk Mark Authenticated</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3.5 pt-2">
              <Link 
                to={`/order/${product.id}`}
                className="bg-maroon-dark text-gold border-2 border-gold h-16 font-bold uppercase tracking-[0.25em] text-xs flex items-center justify-center gap-3 hover:bg-gold hover:text-maroon-dark transition-all duration-300 shadow-xl"
              >
                <ShoppingBag size={18} strokeWidth={2.5} />
                <span>Place Order & Pay via UPI</span>
              </Link>
              
              <a 
                href={`https://wa.me/919491741484?text=${encodeURIComponent(`Namaste Lakshmi Fashion World, I am interested in ordering: ${product.title} (Price: ₹${product.price}). Please share more details and video preview.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white border border-gold text-stone-800 h-14 font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-stone-50 transition-all text-xs shadow-sm hover:border-maroon"
              >
                <MessageCircle size={17} className="text-emerald-600" />
                <span>Inquire on WhatsApp with Master Weaver</span>
              </a>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
