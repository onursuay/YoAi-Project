
import React from 'react';

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#050505]">
      <div className="w-full max-w-md p-10 space-y-8 bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-[#0070f3] rounded-2xl mx-auto shadow-[0_0_25px_rgba(0,112,243,0.4)] flex items-center justify-center text-3xl font-bold">Y</div>
          <h1 className="text-3xl font-bold pt-4">Welcome to YOAI</h1>
          <p className="text-gray-500 text-sm">Marketing intelligence at your fingertips.</p>
        </div>

        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-widest">Email Address</label>
            <input 
              type="email" 
              placeholder="name@company.com"
              className="w-full px-4 py-3 bg-[#111111] border border-[#1a1a1a] rounded-lg focus:outline-none focus:border-[#0070f3] transition-colors text-white text-sm"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-widest">Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-[#111111] border border-[#1a1a1a] rounded-lg focus:outline-none focus:border-[#0070f3] transition-colors text-white text-sm"
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full py-3 bg-[#0070f3] text-white rounded-lg font-bold hover:bg-[#0070f3]/90 transition-all shadow-[0_10px_20px_rgba(0,112,243,0.2)]"
          >
            Sign In
          </button>
        </form>

        <div className="text-center">
          <button className="text-xs text-gray-500 hover:text-white transition-colors">Forgot your password?</button>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
