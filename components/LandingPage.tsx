
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../constants';
import { Language } from '../types';

interface LandingPageProps {
  onStart: (language: Language) => void;
  onLoginClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, onLoginClick }) => {
  const [showLanguageSelect, setShowLanguageSelect] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-x-hidden">
      {/* Header */}
      <header className="max-w-7xl mx-auto w-full px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-[#58cc02] flex items-center justify-center transform -rotate-12">
            <span className="text-white font-black text-xl italic">L</span>
          </div>
          <h1 className="text-3xl font-black text-[#58cc02] tracking-tighter">linguo</h1>
        </div>
        
        <div className="flex items-center gap-2 text-[#afafaf] font-bold text-sm cursor-pointer hover:text-[#777] uppercase tracking-wider">
          SITE LANGUAGE: ENGLISH
          <ChevronRight size={16} className="rotate-90" />
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 lg:flex-row lg:gap-20 max-w-7xl mx-auto w-full">
        {/* Left: Characters Illustration */}
        <div className="relative w-full max-w-md lg:max-w-xl aspect-square flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center">
             <div className="z-10 bg-[#58cc02] rounded-full w-48 h-48 lg:w-64 lg:h-64 flex items-center justify-center shadow-xl animate-bounce">
                <div className="text-white text-9xl font-black">🦉</div>
             </div>
             <div className="absolute top-10 left-10 text-4xl animate-pulse">🌮</div>
             <div className="absolute top-20 right-10 text-4xl animate-bounce delay-75">🗼</div>
             <div className="absolute bottom-20 left-20 text-4xl animate-pulse delay-150">🥐</div>
             <div className="absolute bottom-10 right-20 text-4xl animate-bounce delay-200">🍕</div>
             <div className="absolute top-1/2 -translate-y-1/2 left-0 text-4xl">🍣</div>
             <div className="absolute top-1/2 -translate-y-1/2 right-0 text-4xl">🍺</div>
          </div>
        </div>

        {/* Right: Copy and CTA */}
        <div className="max-w-md text-center lg:text-left flex flex-col gap-8 py-10">
          <h2 className="text-2xl lg:text-4xl font-black text-[#4b4b4b] leading-tight">
            The free, fun, and effective way to learn a language!
          </h2>
          
          <div className="flex flex-col gap-4">
            <button 
              onClick={() => setShowLanguageSelect(true)}
              className="duo-button w-full bg-[#58cc02] text-white py-4 rounded-2xl font-black text-base tracking-widest border-b-[6px] border-[#46a302] hover:bg-[#61e002] transition-colors"
            >
              GET STARTED
            </button>
            <button 
              onClick={onLoginClick}
              className="duo-button w-full bg-white text-[#1cb0f6] py-4 rounded-2xl font-black text-base tracking-widest border-2 border-b-[6px] border-[#e5e5e5] hover:bg-[#f7f7f7] transition-colors"
            >
              I ALREADY HAVE AN ACCOUNT
            </button>
          </div>
        </div>
      </main>

      {/* Footer Flags */}
      <footer className="w-full border-t border-[#e5e5e5] py-6 px-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between overflow-hidden">
           <button className="text-[#afafaf] hover:text-[#4b4b4b] shrink-0"><ChevronLeft /></button>
           
           <div className="flex-1 flex overflow-x-auto no-scrollbar justify-center items-center gap-8 mx-4">
              {SUPPORTED_LANGUAGES.map((lang, idx) => (
                <div key={idx} className="flex items-center gap-3 shrink-0 group cursor-pointer" onClick={() => onStart(lang.name)}>
                  <img 
                    src={`https://flagcdn.com/w40/${lang.flag}.png`} 
                    alt={lang.name} 
                    className="h-5 w-7 rounded-sm shadow-sm grayscale group-hover:grayscale-0 transition-all"
                  />
                  <span className="text-sm font-black text-[#afafaf] group-hover:text-[#4b4b4b]">{lang.name.toUpperCase()}</span>
                </div>
              ))}
           </div>

           <button className="text-[#afafaf] hover:text-[#4b4b4b] shrink-0"><ChevronRight /></button>
        </div>
      </footer>

      {/* Language Selection Modal */}
      {showLanguageSelect && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white">
          <div className="max-w-4xl w-full p-6 flex flex-col items-center">
            <button 
              onClick={() => setShowLanguageSelect(false)}
              className="absolute top-6 left-6 text-[#afafaf] hover:text-[#4b4b4b]"
            >
              <X size={32} />
            </button>
            
            <h2 className="text-3xl font-black text-[#4b4b4b] mb-12">I want to learn...</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 w-full">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.name}
                  onClick={() => onStart(lang.name)}
                  className="duo-button flex flex-col items-center gap-4 p-6 rounded-2xl border-2 border-b-4 border-[#e5e5e5] hover:bg-[#f7f7f7] transition-all"
                >
                  <img 
                    src={`https://flagcdn.com/w80/${lang.flag}.png`} 
                    alt={lang.name} 
                    className="w-16 h-12 object-cover rounded-lg shadow-sm"
                  />
                  <span className="font-bold text-[#4b4b4b] tracking-wide">{lang.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
