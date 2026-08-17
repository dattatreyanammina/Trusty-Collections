import { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ProductCard } from '../components/ProductCard';
import { motion } from 'motion/react';
import { Search, Sparkles, ShieldCheck, Award, HeartHandshake, PhoneCall, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Product } from '../types';
import { Link } from 'react-router-dom';

// Generated Traditional Assets
const HERO_BANYAN_LADIES_IMG = '/images/hero_pattu_saree_banyan_1786950608588.jpg';
const PATTU_LADY_BANYAN_IMG = '/images/pattu_saree_banyan_lady_1786950627044.jpg';
const BANYAN_SILK_HERITAGE_IMG = '/images/heritage_banyan_silk_1786950642861.jpg';
const BRIDAL_BANYAN_PATTU_IMG = '/images/banyan_pattu_bride_1786950686742.jpg';

// Curated Traditional Fallback Sarees for Instant Visual Richness
const CURATED_TRADITIONAL_COLLECTION: Product[] = [
  {
    id: 'lfw-kanchi-01',
    title: 'Royal Crimson & Gold Temple Zari Kanchipuram Pattu Saree',
    description: 'Woven with pure mulberry silk and authentic gold zari featuring traditional temple gopuram motifs, sacred korvai borders, and an opulent brocade pallu.',
    price: 18500,
    category: 'Pattu Saree',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop',
      BRIDAL_BANYAN_PATTU_IMG
    ],
    inStock: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'lfw-dharm-02',
    title: 'Peacock Teal & Mustard Dharmavaram Pure Silk Saree',
    description: 'Exquisite contrast border with intricate floral jaal and traditional mayil (peacock) buttis woven in certified pure silk.',
    price: 14200,
    category: 'Pattu Saree',
    images: [
      PATTU_LADY_BANYAN_IMG,
      'https://images.unsplash.com/photo-1583391733965-0da3c8d76378?q=80&w=1200&auto=format&fit=crop'
    ],
    inStock: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'lfw-bride-03',
    title: 'Muhurtham Gold Brocade Pure Bridal Pattu Saree',
    description: 'The crowning jewel for sacred wedding ceremonies, inspired by ancient royal heritage with heavy zari weave throughout the body.',
    price: 24800,
    category: 'Pattu Saree',
    images: [
      BRIDAL_BANYAN_PATTU_IMG,
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop'
    ],
    inStock: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'lfw-gadwal-04',
    title: 'Emerald Green Heritage Gadwal Zari Border Saree',
    description: 'Lightweight cotton-silk body coupled with rich pure silk pattu pallu and solid gold zari borders.',
    price: 11900,
    category: 'Pattu Saree',
    images: [
      BANYAN_SILK_HERITAGE_IMG,
      'https://images.unsplash.com/photo-1583391733965-0da3c8d76378?q=80&w=1200&auto=format&fit=crop'
    ],
    inStock: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'lfw-paith-05',
    title: 'Royal Magenta Vintage Paithani Silk Saree',
    description: 'Dazzling traditional tapestry weave with signature kaleidoscopic pallu and pure gold zari floral border.',
    price: 16500,
    category: 'Pattu Saree',
    images: [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=1200&auto=format&fit=crop',
      PATTU_LADY_BANYAN_IMG
    ],
    inStock: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'lfw-dress-06',
    title: 'Handcrafted Heritage Pattu Silk Anarkali Dress Set',
    description: 'Floor-length pure silk ethnic ensemble adorned with antique zari borders and pure organza hand-embroidered dupatta.',
    price: 12500,
    category: 'Dress',
    images: [
      'https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=1200&auto=format&fit=crop',
      BANYAN_SILK_HERITAGE_IMG
    ],
    inStock: true,
    createdAt: new Date().toISOString()
  }
];

export function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    async function fetchProducts() {
      try {
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(50));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        if (data && data.length > 0) {
          setProducts(data);
        } else {
          // If no products in DB yet, display rich curated traditional collection
          setProducts(CURATED_TRADITIONAL_COLLECTION);
        }
      } catch (error) {
        console.error("Error fetching products, displaying curated traditional collection:", error);
        setProducts(CURATED_TRADITIONAL_COLLECTION);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const displayProducts = products.length > 0 ? products : CURATED_TRADITIONAL_COLLECTION;
  const pattuSarees = displayProducts.filter(p => p.category?.toLowerCase().includes('saree') || p.category === 'Pattu Saree');

  const filteredProducts = filter === 'All' 
    ? displayProducts 
    : filter === 'Pattu Sarees' || filter === 'Saree'
      ? displayProducts.filter(p => p.category?.toLowerCase().includes('saree') || p.category === 'Pattu Saree')
      : filter === 'Blouses'
        ? displayProducts.filter(p => p.category === 'Blouse' || p.category?.toLowerCase().includes('blouse'))
        : displayProducts.filter(p => p.category === filter);

  return (
    <div className="bg-[#FAF6EE] text-stone-900 overflow-hidden">
      
      {/* 1. Grand Traditional Hero Banner with Banyan Tree & Ladies in Pattu Sarees */}
      <section className="relative min-h-[85vh] lg:min-h-[90vh] bg-stone-950 flex items-center justify-center text-center px-4 md:px-8 py-20 overflow-hidden">
        
        {/* Background Image: Sacred Banyan Tree & Ladies in Pattu Sarees */}
        <motion.div 
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.6, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <img 
            src={HERO_BANYAN_LADIES_IMG}
            alt="Traditional South Indian Ladies in Pattu Sarees under Ancient Banyan Tree"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center brightness-[0.72] contrast-[1.08]"
          />
          {/* Traditional Warm Vignette and Maroon Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-maroon-dark/95 via-maroon-dark/40 to-black/60 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/30 to-black/80 pointer-events-none" />
        </motion.div>

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          
          {/* Auspicious Sacred Crest */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-3 bg-maroon-dark/80 backdrop-blur-md border border-gold/60 px-6 py-2 rounded-full mb-6 shadow-2xl"
          >
            <Sparkles size={14} className="text-gold-light" />
            <span className="text-gold font-serif tracking-[0.25em] text-xs uppercase font-bold">
              ॥ వటవృక్ష సంప్రదాయం • శ్రీ పట్టు శాస్త్రం ॥
            </span>
            <Sparkles size={14} className="text-gold-light" />
          </motion.div>

          {/* Grand Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.9 }}
            className="text-gold-light text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold italic tracking-tight leading-[1.08] mb-6 drop-shadow-2xl"
          >
            Timeless Heritage of <br />
            <span className="text-gold not-italic font-cinzel font-bold tracking-wider drop-shadow-md">
              ROYAL PATTU SAREES
            </span>
          </motion.h1>

          {/* Subtitle with Banyan Tree Symbolism */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-stone-200 text-sm sm:text-base md:text-lg max-w-2xl font-light leading-relaxed mb-10 drop-shadow"
          >
            Draped in the divine sanctity of ancient banyan groves and royal South Indian courtyards. 
            Discover handwoven <strong className="text-gold font-medium">Kanchipuram</strong>, <strong className="text-gold font-medium">Dharmavaram</strong>, and <strong className="text-gold font-medium">Temple Zari Silks</strong> crafted for auspicious celebrations.
          </motion.p>

          {/* Action CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto"
          >
            <a 
              href="#collections"
              className="w-full sm:w-auto bg-gradient-to-r from-gold-deep via-gold to-gold-light text-maroon-dark px-10 py-4 font-bold text-xs uppercase tracking-[0.25em] shadow-2xl hover:brightness-110 transition-all transform hover:-translate-y-1 text-center border border-gold-light"
            >
              Explore Pattu Collection
            </a>
            
            <a 
              href="https://wa.me/7989840075?text=Hello%20Lakshmi%20Fashion%20World%2C%20I%20would%20like%20to%20view%20your%20traditional%20Pattu%20Sarees%20and%20Bridal%20Collection."
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-maroon-dark/90 backdrop-blur-md border border-gold/70 text-gold-light hover:bg-gold hover:text-maroon-dark px-8 py-4 font-bold text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl"
            >
              <PhoneCall size={15} />
              WhatsApp Bridal Inquiry
            </a>
          </motion.div>

        </div>

        {/* Bottom stats ticker */}
        <div className="absolute bottom-0 left-0 right-0 bg-maroon-dark/95 border-t border-gold/30 py-3.5 px-6 hidden md:block">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-gold-light text-xs tracking-[0.15em] uppercase font-serif">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-gold" />
              <span>100% Pure Mulberry Silk Mark</span>
            </div>
            <span className="text-gold/40">•</span>
            <div className="flex items-center gap-2">
              <Award size={16} className="text-gold" />
              <span>Authentic Tested Gold & Silver Zari</span>
            </div>
            <span className="text-gold/40">•</span>
            <div className="flex items-center gap-2">
              <HeartHandshake size={16} className="text-gold" />
              <span>Direct Master Weavers Handloom</span>
            </div>
            <span className="text-gold/40">•</span>
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-gold" />
              <span>Worldwide Safe Shipping</span>
            </div>
          </div>
        </div>

      </section>

      {/* 2. Traditional Temple Zari Divider */}
      <div className="temple-zari-band" />
      <div className="temple-border-pattern opacity-80" />

      {/* 3. The Sacred Banyan Tree & Pattu Saree Story Spotlight */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-gold-deep text-xs font-bold uppercase tracking-[0.3em] mb-3">
            <Sparkles size={14} />
            <span>Vata Vriksha & Pattu Parampara</span>
            <Sparkles size={14} />
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-maroon mb-4 italic">
            The Sacred Banyan & Handwoven Royalty
          </h2>
          <div className="w-24 h-1 bg-gold mx-auto mb-6 relative">
            <div className="w-3 h-3 bg-maroon border border-gold rotate-45 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-stone-600 font-sans text-sm sm:text-base leading-relaxed">
            Just as the ancient sacred banyan tree embodies eternity, protection, and divine blessings in South Indian tradition, 
            a pure <strong className="text-maroon">Kanchipuram Pattu Saree</strong> represents enduring beauty, family lineage, and royal grace passed down through generations.
          </p>
        </div>

        {/* Visual Heritage Grid featuring Banyan Tree & Pattu Saree Ladies */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
          
          {/* Main Large Showcase Card */}
          <div className="lg:col-span-7 bg-[#FFFDF9] border border-gold/40 p-4 md:p-6 shadow-xl relative ethnic-border">
            <div className="aspect-[4/3] overflow-hidden relative mb-5">
              <img 
                src={PATTU_LADY_BANYAN_IMG}
                alt="Lady in Pure Pattu Saree under Sacred Banyan Tree"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-4 left-4 bg-maroon-dark/90 text-gold px-4 py-2 text-xs font-serif italic border border-gold/40 shadow-lg">
                Traditional Temple & Banyan Heritage • Kanchipuram Weave
              </div>
            </div>
            <h3 className="text-2xl font-serif font-bold text-maroon mb-2 italic">
              The Korvai Weaving of Sacred Temple Borders
            </h3>
            <p className="text-stone-600 text-sm leading-relaxed mb-4">
              Our master weavers employ the age-old <span className="font-semibold text-stone-800">Korvai technique</span>—where the body and temple border are woven separately with pure zari and interlocked with divine precision under traditional village looms.
            </p>
            <div className="flex flex-wrap gap-4 text-xs font-semibold text-gold-deep pt-3 border-t border-gold/20">
              <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-emerald-700" /> 100% Mulberry Pattu</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-emerald-700" /> Traditional Temple Borders</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-emerald-700" /> Auspicious Bridal Colors</span>
            </div>
          </div>

          {/* Right Side Stacked Traditional Cards */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Card 1: Divine Banyan Tree with Brass Deepams & Silks */}
            <div className="bg-[#FFFDF9] border border-gold/40 p-4 shadow-lg flex gap-4 items-center ethnic-border">
              <div className="w-32 sm:w-40 aspect-square shrink-0 overflow-hidden relative">
                <img 
                  src={BANYAN_SILK_HERITAGE_IMG}
                  alt="Ancient Banyan Tree with Sacred Silks and Deepams"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="flex-grow">
                <span className="text-[10px] uppercase font-bold tracking-widest text-gold-deep">Parampara</span>
                <h4 className="font-serif font-bold text-stone-900 text-lg leading-snug mb-1">
                  Sanctity & Prosperity
                </h4>
                <p className="text-stone-500 text-xs line-clamp-3">
                  Woven with pure natural silks and consecrated zari motifs that bring auspicious blessings to weddings and pujas.
                </p>
              </div>
            </div>

            {/* Card 2: Royal Bridal Pattu under Banyan Canopy */}
            <div className="bg-[#FFFDF9] border border-gold/40 p-4 shadow-lg flex gap-4 items-center ethnic-border">
              <div className="w-32 sm:w-40 aspect-square shrink-0 overflow-hidden relative">
                <img 
                  src={BRIDAL_BANYAN_PATTU_IMG}
                  alt="South Indian Bride in Pattu Saree under Banyan Tree"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="flex-grow">
                <span className="text-[10px] uppercase font-bold tracking-widest text-gold-deep">Muhurtham Collection</span>
                <h4 className="font-serif font-bold text-stone-900 text-lg leading-snug mb-1">
                  Bridal Kanjeevarams
                </h4>
                <p className="text-stone-500 text-xs line-clamp-3">
                  Heavy zari brocades, peacock motifs, and temple chariots designed to make every bride shine like Goddess Lakshmi.
                </p>
              </div>
            </div>

            {/* Direct Assistance CTA */}
            <div className="bg-maroon-dark text-gold p-6 border border-gold shadow-xl">
              <h4 className="font-serif italic text-xl font-bold text-gold-light mb-1">
                Looking for a Specific Muhurtham Color?
              </h4>
              <p className="text-stone-300 text-xs mb-4">
                Chat directly with our master silk consultant to see live video previews of exclusive pattu sarees.
              </p>
              <a 
                href="https://wa.me/919491741484?text=Hi%20Lakshmi%20Fashion%20World%2C%20I%20would%20like%20a%20personal%20video%20call%20preview%20of%20Pattu%20Sarees." 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gold text-maroon-dark font-bold text-[11px] uppercase tracking-widest px-5 py-2.5 hover:bg-gold-light transition-colors"
              >
                Request Video Preview <ArrowRight size={14} />
              </a>
            </div>

          </div>

        </div>

      </section>

      {/* 4. Auspicious Temple Band Divider */}
      <div className="temple-zari-band" />

      {/* 5. Dedicated Pattu Saree Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-gold/30 pb-6">
          <div>
            <div className="flex items-center gap-2 text-gold-deep text-xs font-bold uppercase tracking-[0.25em] mb-2">
              <Sparkles size={13} />
              <span>Collection Spotlight</span>
            </div>
            <h2 className="text-4xl sm:text-5xl text-maroon font-serif font-bold italic">
              Pattu Sarees
            </h2>
          </div>

          <a
            href="tel:+917989840075"
            className="inline-flex items-center gap-2 bg-maroon text-gold px-5 py-3 text-[10px] uppercase tracking-[0.25em] font-bold hover:bg-gold hover:text-maroon transition-all"
          >
            Call for Details
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {pattuSarees.map((product, idx) => (
            <ProductCard
              key={product.id}
              product={product}
              delay={idx * 0.08}
              showPrice={false}
              ctaHref="tel:+917989840075"
              ctaLabel="Call for Details"
            />
          ))}
        </div>
      </section>

      {/* 6. Main Product Collections Showcase */}
      <section id="collections" className="max-w-7xl mx-auto px-4 md:px-8 py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 border-b border-gold/30 pb-6">
          <div>
            <div className="flex items-center gap-2 text-gold-deep text-xs font-bold uppercase tracking-[0.25em] mb-2">
              <Sparkles size={13} />
              <span>Handcrafted Handloom Catalog</span>
            </div>
            <h2 className="text-4xl sm:text-5xl text-maroon font-serif font-bold italic">
              Our Pattu & Ethnic Weaves
            </h2>
            <p className="text-stone-600 max-w-xl text-sm mt-2 font-sans">
              Every saree is individually curated, quality-checked for pure zari and silk density, and delivered directly to your doorstep with manual verification.
            </p>
          </div>
          
          {/* Category Filter Chips */}
          <div className="flex flex-wrap items-center gap-2">
            {['All', 'Pattu Sarees', 'Blouses', 'Dress'].map((cat) => (
              <button 
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2.5 text-xs font-bold uppercase tracking-widest transition-all ${
                  filter === cat 
                    ? 'bg-maroon text-gold border border-gold shadow-lg' 
                    : 'bg-white text-stone-600 border border-gold/30 hover:border-gold hover:text-maroon'
                }`}
              >
                {cat === 'All' ? 'All Traditional Weaves' : cat === 'Pattu Sarees' ? 'Pure Pattu Sarees' : cat === 'Blouses' ? 'Blouses' : 'Ethnic Dresses'}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="animate-pulse bg-white p-4 border border-stone-200">
                <div className="aspect-[3/4] bg-stone-200 mb-4" />
                <div className="h-4 bg-stone-200 w-2/3 mb-2" />
                <div className="h-4 bg-stone-200 w-1/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product, idx) => (
              <ProductCard key={product.id} product={product} delay={idx * 0.08} />
            ))}
          </div>
        )}
        
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-24 border-2 border-dashed border-gold/40 bg-white/50 p-8">
            <Search className="mx-auto text-gold mb-4" size={48} />
            <p className="text-stone-700 font-serif text-lg italic mb-2">No designs currently matching this filter.</p>
            <button 
              onClick={() => setFilter('All')} 
              className="mt-4 bg-maroon text-gold px-6 py-2.5 text-xs uppercase tracking-widest font-bold"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* 6. Traditional Handloom Assurance & Trust Section */}
      <section className="bg-maroon-dark text-stone-200 py-16 px-4 md:px-8 border-t border-b border-gold">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <div className="flex items-start gap-4 p-4 border border-gold/20 bg-black/20">
            <div className="w-12 h-12 rounded-full border border-gold flex items-center justify-center shrink-0 text-gold bg-maroon">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="font-serif text-lg text-gold font-bold mb-1">Pure Silk Mark</h4>
              <p className="text-xs text-stone-300 leading-relaxed">
                Guaranteed pure mulberry silk fibers tested and verified for authenticity.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 border border-gold/20 bg-black/20">
            <div className="w-12 h-12 rounded-full border border-gold flex items-center justify-center shrink-0 text-gold bg-maroon">
              <Award size={24} />
            </div>
            <div>
              <h4 className="font-serif text-lg text-gold font-bold mb-1">Authentic Gold Zari</h4>
              <p className="text-xs text-stone-300 leading-relaxed">
                Traditional silver and gold electroplated zari threads with eternal sheen.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 border border-gold/20 bg-black/20">
            <div className="w-12 h-12 rounded-full border border-gold flex items-center justify-center shrink-0 text-gold bg-maroon">
              <HeartHandshake size={24} />
            </div>
            <div>
              <h4 className="font-serif text-lg text-gold font-bold mb-1">Weaver Direct</h4>
              <p className="text-xs text-stone-300 leading-relaxed">
                Ethically sourced directly from master handloom weaving families in South India.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 border border-gold/20 bg-black/20">
            <div className="w-12 h-12 rounded-full border border-gold flex items-center justify-center shrink-0 text-gold bg-maroon">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h4 className="font-serif text-lg text-gold font-bold mb-1">UPI & Reference Verify</h4>
              <p className="text-xs text-stone-300 leading-relaxed">
                Transparent manual payment verification with real-time order tracking.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 7. Auspicious Blessing & Traditional Customization Banner */}
      <section className="py-20 px-4 md:px-8 text-center max-w-4xl mx-auto">
        <div className="w-16 h-16 mx-auto mb-4 border-2 border-gold rounded-full flex items-center justify-center text-gold font-serif text-2xl font-bold bg-maroon shadow-md">
          ల
        </div>
        <h3 className="text-3xl sm:text-4xl font-serif italic text-maroon font-bold mb-3">
          Blessings of Trusty Collections
        </h3>
        <p className="text-stone-600 text-sm max-w-2xl mx-auto leading-relaxed mb-8">
          Whether you are preparing for a South Indian wedding, Gruhapravesam, Upanayanam, or festive celebration, 
          our pattu sarees bring the eternal elegance and sacred traditions of South India right to your wardrobe.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link 
            to="/track" 
            className="bg-stone-900 text-gold px-8 py-3 text-xs uppercase tracking-[0.2em] font-bold hover:bg-maroon transition-all shadow-md"
          >
            Track Existing Order
          </Link>
          <a 
            href="https://wa.me/7989840075?text=Hi%20Lakshmi%20Fashion%20World%2C%20I%20have%20an%20inquiry%20regarding%20traditional%20Pattu%20Sarees."
            target="_blank"
            rel="noopener noreferrer"
            className="border border-maroon text-maroon px-8 py-3 text-xs uppercase tracking-[0.2em] font-bold hover:bg-maroon hover:text-gold transition-all"
          >
            Contact Weavers Team
          </a>
        </div>
      </section>

    </div>
  );
}
