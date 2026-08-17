import { Link } from 'react-router-dom';
import { Search, User, Truck, Sparkles } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <nav className="bg-maroon-dark sticky top-0 z-40 shadow-xl">
      {/* Top Auspicious Micro Bar */}
      <div className="bg-[#41050A] text-gold-light py-1 px-4 text-center text-[10px] tracking-[0.25em] uppercase font-serif border-b border-gold/20 flex items-center justify-center gap-3">
        <span className="text-gold">॥ శ్రీ లక్ష్మీ ప్రసన్న ॥</span>
        <span className="hidden md:inline text-gold/50">•</span>
        <span className="hidden md:inline font-sans text-[9px] text-stone-300">Authentic Handwoven Kanchipuram & Pure Pattu Sarees</span>
        <span className="text-gold/50">•</span>
        <span className="text-gold font-sans font-semibold text-[9px]">Heritage Silk Mark Certified</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3.5 group">
          <div className="w-12 h-12 border-2 border-gold rounded-full flex items-center justify-center bg-maroon text-gold font-serif font-bold text-2xl shadow-inner group-hover:scale-105 transition-transform relative overflow-hidden">
            <span className="relative z-10">TC</span>
            <div className="absolute inset-0 bg-gradient-to-tr from-gold/30 to-transparent opacity-60 pointer-events-none" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-gold font-cinzel text-xl font-bold tracking-widest leading-none">
                Trusty
              </span>
              <Sparkles size={13} className="text-gold-light opacity-80" />
            </div>
            <span className="text-gold-light/90 font-serif italic text-xs tracking-[0.2em] font-medium leading-none mt-1">
              Collections • Traditional Pattu
            </span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-[11px] uppercase tracking-[0.2em] font-semibold text-stone-200">
          <Link to="/" className="hover:text-gold transition-colors py-1 border-b-2 border-gold text-gold">Home</Link>
          <Link to="/" className="hover:text-gold transition-colors py-1">Pattu Sarees</Link>
          <Link to="/" className="hover:text-gold transition-colors py-1">Kanjeevaram</Link>
          <Link to="/" className="hover:text-gold transition-colors py-1">Bridal Silk</Link>
          <Link to="/track" className="hover:text-gold transition-colors flex items-center gap-2 py-1">
            <Truck size={14} className="text-gold" />
            Track Order
          </Link>
        </div>

        <div className="flex items-center gap-5 text-gold">
          <button 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
            aria-label="Search"
          >
            <Search size={20} strokeWidth={1.75} />
          </button>
          <Link to="/track" className="md:hidden hover:text-white transition-colors p-2" aria-label="Track Order">
            <Truck size={20} strokeWidth={1.75} />
          </Link>
          <Link to="/admin/login" className="hover:text-white transition-colors p-2 rounded-full hover:bg-white/10" aria-label="Admin">
            <User size={20} strokeWidth={1.75} />
          </Link>
        </div>
      </div>
      
      {/* Temple Zari Band at bottom of navbar */}
      <div className="temple-zari-band" />
      <div className="temple-border-pattern opacity-90" />

      {isSearchOpen && (
        <div className="bg-maroon-dark border-b border-gold/40 p-4 shadow-2xl animate-in slide-in-from-top duration-300">
          <div className="max-w-3xl mx-auto flex gap-3">
            <input 
              type="text" 
              placeholder="Search Kanchipuram Pattu, Bridal Sarees, Temple Weaves, Silk Dresses..." 
              className="flex-grow bg-[#300307] border border-gold/40 text-[#FAF6EE] placeholder-stone-400 px-6 py-3 text-sm font-medium focus:ring-1 focus:ring-gold outline-none"
              autoFocus
            />
            <button className="bg-gold text-maroon-dark px-8 py-3 font-bold uppercase tracking-widest text-xs hover:bg-gold-light transition-colors shadow-md">
              Search
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

