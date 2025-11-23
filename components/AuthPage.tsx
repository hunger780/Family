import React, { useState } from 'react';
import { User, Mail, Lock, ArrowRight, Heart, Sparkles } from 'lucide-react';

interface AuthPageProps {
  onAuthSuccess: (user: { name: string; email: string }) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate authentication
    // In a real app, this would call an API
    const userProfile = {
      name: isLogin ? (formData.email.split('@')[0] || 'User') : formData.name,
      email: formData.email
    };
    
    // Slight delay to simulate network request
    setTimeout(() => {
      onAuthSuccess(userProfile);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-pink-600/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md bg-slate-800/80 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl overflow-hidden relative z-10">
        <div className="p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg mb-4">
              <Heart className="text-white fill-white" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Nexus Graph</h1>
            <p className="text-slate-400 mt-2 text-center">
              {isLogin ? 'Welcome back to your family tree' : 'Start building your legacy today'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-3 top-3 text-slate-500 group-focus-within:text-pink-500 transition-colors" size={18} />
                  <input
                    type="text"
                    required={!isLogin}
                    placeholder="Jane Doe"
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all placeholder-slate-600"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-3 text-slate-500 group-focus-within:text-pink-500 transition-colors" size={18} />
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all placeholder-slate-600"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3 text-slate-500 group-focus-within:text-pink-500 transition-colors" size={18} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all placeholder-slate-600"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white font-bold py-3 rounded-lg shadow-lg shadow-pink-500/20 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] mt-6"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-400 text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-pink-400 hover:text-pink-300 font-medium transition-colors"
              >
                {isLogin ? 'Sign up' : 'Log in'}
              </button>
            </p>
          </div>
        </div>
        
        {/* Footer decoration */}
        <div className="bg-slate-900/50 p-3 text-center border-t border-slate-700/50">
           <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
             <Sparkles size={10} />
             <span>Powered by Gemini 2.5 Flash</span>
           </div>
        </div>
      </div>
    </div>
  );
};
