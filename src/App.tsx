/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { ProductDetail } from './pages/ProductDetail';
import { OrderFlow } from './pages/OrderFlow';
import { TrackOrder } from './pages/TrackOrder';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminProtectedRoute } from './components/AdminProtectedRoute';
import { Sparkles, MapPin, Phone, Mail, ShieldCheck, Heart, Instagram, Youtube } from 'lucide-react';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[#FAF6EE]">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/order/:productId" element={<OrderFlow />} />
            <Route path="/track" element={<TrackOrder />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route 
              path="/admin/*" 
              element={
                <AdminProtectedRoute>
                  <AdminDashboard />
                </AdminProtectedRoute>
              } 
            />
          </Routes>
        </main>
        
        {/* Traditional Heritage Footer */}
        <footer className="bg-maroon-dark text-stone-300 border-t-2 border-gold relative overflow-hidden">
          
          {/* Temple Zari Trim */}
          <div className="temple-zari-band" />
          <div className="temple-border-pattern opacity-90" />

          <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
            
            {/* Col 1: Brand & Heritage */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 border border-gold rounded-full flex items-center justify-center text-gold font-serif text-2xl font-bold bg-maroon shadow-inner">
                  ల
                </div>
                <div>
                  <h2 className="text-gold font-cinzel text-xl font-bold tracking-widest leading-none">
                    Trusty Collections
                  </h2>
                  <p className="text-gold-light/80 text-[11px] font-serif italic tracking-[0.2em] mt-1">
                    Vata Vriksha Parampara • Pure Pattu Sarees
                  </p>
                </div>
              </div>
              <p className="text-xs text-stone-400 leading-relaxed max-w-md">
                Honoring centuries of South Indian handloom tradition. Specializing in authentic Kanchipuram, Dharmavaram, Gadwal, and Temple Zari bridal pattu sarees handwoven by master artisans.
              </p>
              <div className="pt-2 text-gold text-xs font-serif italic flex items-center gap-2">
                <Sparkles size={14} className="text-gold-light" />
                <span>॥ శుభం భవతు • సర్వే జనాః సుఖినో భవంతు ॥</span>
              </div>
            </div>

            {/* Col 2: Quick Links */}
            <div>
              <h3 className="text-gold font-serif text-base font-bold uppercase tracking-widest mb-4 border-b border-gold/30 pb-2">
                Traditional Collections
              </h3>
              <ul className="space-y-2.5 text-xs text-stone-400 font-medium">
                <li><Link to="/" className="hover:text-gold transition-colors">Bridal Kanchipuram Pattu</Link></li>
                <li><Link to="/" className="hover:text-gold transition-colors">Sacred Temple Korvai Weaves</Link></li>
                <li><Link to="/" className="hover:text-gold transition-colors">Dharmavaram Pure Silk</Link></li>
                <li><Link to="/" className="hover:text-gold transition-colors">Festive Silk Dresses</Link></li>
                <li><Link to="/track" className="hover:text-gold transition-colors">Track Order with Reference ID</Link></li>
              </ul>
            </div>

            {/* Col 3: Direct Weaver Contact */}
            <div>
              <h3 className="text-gold font-serif text-base font-bold uppercase tracking-widest mb-4 border-b border-gold/30 pb-2">
                Connect with Us
              </h3>
              <ul className="space-y-3 text-xs text-stone-400">
                <li className="flex items-start gap-2.5">
                  <MapPin size={15} className="text-gold shrink-0 mt-0.5" />
                  <span>South Indian Handloom Hub, Andhra Pradesh & Tamil Nadu, India</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone size={15} className="text-gold shrink-0" />
                  <a href="tel:+917989840075" className="hover:text-gold transition-colors">+91 79898 40075</a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail size={15} className="text-gold shrink-0" />
                  <span>orders@trustycollections</span>
                </li>
                <li className="pt-4 flex items-center gap-3">
                  <a href="https://www.instagram.com/7trusty_collections?igsh=MTZpOHY4dXZlc3Yzdw%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className="p-2 bg-maroon rounded hover:bg-gold hover:text-maroon transition-colors">
                    <Instagram size={16} />
                  </a>
                  <a href="https://youtube.com/@lakshmitheexplorer9632?si=c_lryfp0LQN7_T9j" target="_blank" rel="noopener noreferrer" className="p-2 bg-maroon rounded hover:bg-gold hover:text-maroon transition-colors">
                    <Youtube size={16} />
                  </a>
                </li>
                <li className="pt-2">
                  <Link to="/admin/login" className="text-[11px] uppercase tracking-widest text-gold/60 hover:text-gold">
                    Admin Portal
                  </Link>
                </li>
              </ul>
            </div>

          </div>

          <div className="border-t border-gold/20 py-6 px-6 text-center text-xs text-stone-400 bg-black/30">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <p>&copy; {new Date().getFullYear()} Trusty Collections. Handwoven with <Heart size={12} className="inline text-red-500 mx-1" /> for Indian Traditions.</p>
              <div className="flex items-center gap-4 text-[11px] text-gold/70">
                <span>100% Silk Mark</span>
                <span>•</span>
                <span>Verified Handloom</span>
                <span>•</span>
                <span>Direct UPI Verification</span>
              </div>
            </div>
          </div>
        </footer>

        {/* Traditional Auspicious Announcement Bar */}
        <div className="sticky bottom-0 bg-gold text-maroon-dark font-serif font-bold text-[11px] tracking-[0.15em] uppercase py-2 px-4 shadow-2xl z-50 flex items-center justify-center gap-4 overflow-x-auto whitespace-nowrap border-t border-gold-light">
          <span>🌸 Free Insured Shipping Across India on All Pure Pattu Orders</span>
          <span className="text-maroon-dark/40">•</span>
          <span>🪔 Direct WhatsApp Video Call Saree Selection Available</span>
          <span className="text-maroon-dark/40">•</span>
          <span>✨ 100% Pure Silk Mark & Tested Zari Certified</span>
        </div>
      </div>
    </Router>
  );
}
