import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShoppingBag, Sparkles, ShieldCheck } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  delay?: number;
  showPrice?: boolean;
  ctaHref?: string;
  ctaLabel?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  delay = 0,
  showPrice = true,
  ctaHref,
  ctaLabel = 'Order Saree Now'
}) => {
  const displayImage = product.images?.[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop';
  const actionHref = ctaHref || `/order/${product.id}`;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="group relative bg-[#FAF6EE] p-3 border border-gold/30 hover:border-gold transition-all duration-300 shadow-sm hover:shadow-xl"
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="aspect-[3/4] overflow-hidden relative ethnic-border bg-stone-100">
          <img 
            src={displayImage} 
            alt={product.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-maroon-dark/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
            <span className="text-gold-light text-xs font-serif italic text-center drop-shadow-md">
              View Pure Silk Details
            </span>
          </div>
          
          {/* Traditional Badge */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            <span className="bg-maroon-dark/90 backdrop-blur-xs text-gold border border-gold/40 text-[9px] uppercase tracking-widest font-bold px-2.5 py-0.5 shadow-md flex items-center gap-1">
              <Sparkles size={9} />
              {product.category || 'Pattu Saree'}
            </span>
          </div>

          <div className="absolute top-2 right-2">
            <span className="bg-gold text-maroon-dark text-[8px] uppercase tracking-wider font-bold px-2 py-0.5 shadow-md flex items-center gap-0.5">
              <ShieldCheck size={10} />
              Silk Mark
            </span>
          </div>
        </div>
        
        <div className="mt-4 text-center px-1">
          <p className="text-[10px] uppercase tracking-[0.25em] text-gold-deep font-bold mb-1">
            Handloom Heritage
          </p>
          <h3 className="text-stone-900 font-serif text-lg group-hover:text-maroon transition-colors line-clamp-1 italic font-bold">
            {product.title}
          </h3>
          <div className="flex justify-between items-center mt-3 border-t border-gold/20 pt-2.5">
            {showPrice ? (
              <div className="flex flex-col text-left">
                <span className="text-[9px] text-stone-400 font-sans uppercase tracking-wider">Price</span>
                <span className="text-maroon font-serif text-xl font-bold leading-none">₹{product.price.toLocaleString('en-IN')}</span>
              </div>
            ) : (
              <div className="flex flex-col text-left">
                <span className="text-[9px] text-stone-400 font-sans uppercase tracking-wider">Details</span>
                <span className="text-maroon font-serif text-base font-bold leading-none">Call for details</span>
              </div>
            )}
            <div className="text-right">
              <span className="text-[9px] uppercase tracking-widest text-stone-400 font-mono">LFW-{product.id.slice(0, 4).toUpperCase()}</span>
              <span className={`block text-[8px] font-semibold uppercase ${product.inStock === false ? 'text-red-700' : 'text-emerald-700'}`}>
                {product.inStock === false ? 'Out of Stock' : 'In Stock'}
              </span>
            </div>
          </div>
        </div>
      </Link>
      
      <div className="mt-3">
        <Link
          to={product.inStock === false ? '#' : actionHref}
          onClick={product.inStock === false ? (event) => event.preventDefault() : undefined}
          className={`w-full border text-[10px] uppercase tracking-[0.2em] font-bold py-3 flex items-center justify-center gap-2 shadow-md transition-all duration-300 ${product.inStock === false ? 'bg-stone-200 text-stone-500 border-stone-300 cursor-not-allowed' : 'bg-maroon-dark text-gold border-gold/40 hover:bg-gold hover:text-maroon-dark hover:shadow-lg'}`}
        >
          <ShoppingBag size={13} strokeWidth={2.5} />
          {product.inStock === false ? 'Sold Out' : ctaLabel}
        </Link>
      </div>
    </motion.div>
  );
};

