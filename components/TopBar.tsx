
import React from 'react';
import { Heart, Flame, Gem } from 'lucide-react';
import { UserStats } from '../types';
import { SUPPORTED_LANGUAGES } from '../constants';

interface TopBarProps {
  stats: UserStats;
}

const TopBar: React.FC<TopBarProps> = ({ stats }) => {
  const currentLang = SUPPORTED_LANGUAGES.find(l => l.name === stats.selectedLanguage);

  return (
    <div className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-[#e5e5e5] bg-white px-4 lg:px-10">
      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 rounded-lg p-1 hover:bg-[#f7f7f7]">
          {currentLang && (
            <img 
              src={`https://flagcdn.com/w40/${currentLang.flag}.png`} 
              alt={stats.selectedLanguage}
              className="h-6 w-8 rounded object-cover shadow-sm border border-gray-100"
            />
          )}
          <span className="hidden sm:inline font-bold text-[#afafaf] uppercase tracking-wider text-xs">
            {stats.selectedLanguage}
          </span>
        </button>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Flame size={24} className="text-[#ff9600]" fill="#ff9600" />
          <span className="font-bold text-[#ff9600]">{stats.streak}</span>
        </div>
        <div className="flex items-center gap-2">
          <Gem size={24} className="text-[#1cb0f6]" fill="#1cb0f6" />
          <span className="font-bold text-[#1cb0f6]">{stats.gems}</span>
        </div>
        <div className="flex items-center gap-2">
          <Heart size={24} className="text-[#ff4b4b]" fill="#ff4b4b" />
          <span className="font-bold text-[#ff4b4b]">{stats.hearts}</span>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
