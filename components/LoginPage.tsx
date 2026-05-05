
import React, { useState } from 'react';
import { X } from 'lucide-react';

interface LoginPageProps {
  onBack: () => void;
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onBack, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="fixed inset-0 z-[200] bg-[#131f24] flex flex-col items-center justify-center px-4 text-white font-nunito">
      {/* Top Controls */}
      <button 
        onClick={onBack}
        className="absolute top-6 left-6 text-[#4b4b4b] hover:text-white transition-colors"
      >
        <X size={28} />
      </button>
      
      <button className="absolute top-6 right-6 border-2 border-[#37464f] hover:bg-[#37464f] text-[#38d1ff] font-black py-2 px-6 rounded-xl text-sm tracking-widest transition-all">
        SIGN UP
      </button>

      {/* Main Content */}
      <div className="max-w-sm w-full flex flex-col items-center text-center">
        <h2 className="text-2xl font-black mb-8">Log in</h2>

        <div className="w-full flex flex-col gap-3">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Email or username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#182a35] border-2 border-[#37464f] rounded-2xl p-4 font-bold text-white placeholder-[#4b4b4b] focus:border-[#38d1ff] outline-none transition-colors"
            />
          </div>
          
          <div className="relative">
            <input 
              type="password" 
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#182a35] border-2 border-[#37464f] rounded-2xl p-4 font-bold text-white placeholder-[#4b4b4b] focus:border-[#38d1ff] outline-none transition-colors"
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4b4b4b] hover:text-[#38d1ff] text-xs font-black tracking-widest uppercase">
              FORGOT?
            </button>
          </div>

          <button 
            onClick={onLogin}
            className="w-full bg-[#38d1ff] text-white py-4 rounded-2xl font-black text-sm tracking-widest mt-2 border-b-4 border-[#1cb0f6] active:translate-y-1 active:border-b-0 transition-all"
          >
            LOG IN
          </button>
        </div>

        <div className="flex items-center w-full gap-4 my-8">
          <div className="h-[2px] flex-1 bg-[#37464f]"></div>
          <span className="text-[#4b4b4b] font-black text-xs uppercase tracking-widest">OR</span>
          <div className="h-[2px] flex-1 bg-[#37464f]"></div>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full">
          <button className="flex items-center justify-center gap-3 border-2 border-[#37464f] rounded-2xl py-3 px-4 hover:bg-[#182a35] transition-colors">
            <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" alt="Google" className="w-5 h-5" />
            <span className="text-[#4b4b4b] font-black text-xs tracking-widest uppercase">GOOGLE</span>
          </button>
          <button className="flex items-center justify-center gap-3 border-2 border-[#37464f] rounded-2xl py-3 px-4 hover:bg-[#182a35] transition-colors">
            <svg className="w-5 h-5 text-[#1877F2] fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            <span className="text-[#4b4b4b] font-black text-xs tracking-widest uppercase">FACEBOOK</span>
          </button>
        </div>

        <p className="mt-12 text-[10px] text-[#4b4b4b] font-bold leading-relaxed">
          By signing in to Duolingo, you agree to our <span className="hover:underline cursor-pointer">Terms</span> and <span className="hover:underline cursor-pointer">Privacy Policy</span>.
        </p>
        <p className="mt-4 text-[10px] text-[#4b4b4b] font-bold leading-relaxed">
          This site is protected by reCAPTCHA Enterprise and the Google <span className="hover:underline cursor-pointer">Privacy Policy</span> and <span className="hover:underline cursor-pointer">Terms of Service</span> apply.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
