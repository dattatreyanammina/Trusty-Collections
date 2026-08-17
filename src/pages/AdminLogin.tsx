import React, { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { useNavigate, useLocation } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { Lock, Mail, ChevronRight, Loader2, Chrome } from 'lucide-react';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleAdminVerify = async (user: any) => {
    // Owner access is authorized for the store developer account.
    if (user.email === 'dattatreya_nammina@srmap.edu.in') {
      const from = (location.state as any)?.from?.pathname || "/admin";
      navigate(from, { replace: true });
      return;
    }

    // Check admin status in Firestore
    const adminDoc = await getDoc(doc(db, 'admins', user.uid));
    if (adminDoc.exists()) {
      const from = (location.state as any)?.from?.pathname || "/admin";
      navigate(from, { replace: true });
    } else {
      setError("You do not have administrator permissions. Access log recorded.");
      await auth.signOut();
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await handleAdminVerify(result.user);
    } catch (err: any) {
      setError("Failed to sign in with Google.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await handleAdminVerify(userCredential.user);
    } catch (err: any) {
      setError("Invalid email or password.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-stone-50 px-4">
      <div className="max-w-md w-full bg-white border border-stone-200 p-10 shadow-2xl relative overflow-hidden rounded-sm">
        <div className="absolute top-0 left-0 w-full h-2 bg-maroon" />
        
        <div className="text-center mb-10">
          <div className="inline-flex flex-col items-center mb-6">
            <span className="text-maroon font-serif text-3xl font-bold italic tracking-tighter leading-none">Lakshmi</span>
            <span className="text-gold text-[10px] uppercase tracking-[0.3em] font-medium leading-none mt-1">Admin Portal</span>
          </div>
          <h2 className="text-lg font-bold text-stone-800 uppercase tracking-widest border-b border-stone-100 pb-4">Secure Sign In</h2>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-xs font-bold p-4 mb-6 rounded border border-red-100 text-center uppercase tracking-wider">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="space-y-6">
          <button 
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white text-stone-800 border-2 border-stone-100 py-4 font-bold uppercase tracking-[0.2em] hover:bg-stone-50 transition-all flex items-center justify-center gap-3 group shadow-sm mb-6"
          >
            {loading ? <Loader2 className="animate-spin text-maroon" /> : <Chrome size={20} className="text-maroon" />}
            Owner Login (Google)
          </button>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-stone-100"></div></div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest"><span className="bg-white px-4 text-stone-300 font-bold">OR Email Access</span></div>
          </div>

          <div className="space-y-1 relative">
            <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Owner Email</label>
            <div className="relative">
              <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-transparent border-b-2 border-stone-100 py-3 pl-8 pr-4 outline-none focus:border-gold transition-colors font-medium text-sm"
                placeholder="Enter owner email"
              />
            </div>
          </div>

          <div className="space-y-1 relative">
            <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Password</label>
            <div className="relative">
              <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-transparent border-b-2 border-stone-100 py-3 pl-8 pr-4 outline-none focus:border-gold transition-colors font-medium text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="pt-4">
            <button 
              disabled={loading}
              className="w-full bg-maroon text-white py-4 font-bold uppercase tracking-[0.3em] hover:bg-stone-800 transition-all flex items-center justify-center gap-2 group shadow-lg"
            >
              {loading ? <Loader2 className="animate-spin" /> : (
                <>
                  Enter Dashboard
                  <ChevronRight size={18} className="translate-x-0 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>

        <p className="mt-4 text-center text-[10px] text-stone-400 uppercase tracking-widest font-bold">
          Restricted Access Only
        </p>
      </div>
    </div>
  );
}
