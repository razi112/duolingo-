
import React from 'react';
import { Home, Compass, Shield, User, Settings, Store, Dumbbell } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'learn', icon: Home, label: 'LEARN' },
    { id: 'practice', icon: Dumbbell, label: 'PRACTICE' },
    { id: 'explore', icon: Compass, label: 'EXPLORE' },
    { id: 'leaderboard', icon: Shield, label: 'LEADERBOARD' },
    { id: 'shop', icon: Store, label: 'SHOP' },
    { id: 'profile', icon: User, label: 'PROFILE' },
    { id: 'settings', icon: Settings, label: 'MORE' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex h-20 items-center justify-around border-t border-[#e5e5e5] bg-white px-2 lg:bottom-auto lg:top-0 lg:h-screen lg:w-64 lg:flex-col lg:items-stretch lg:justify-start lg:border-r lg:border-t-0 lg:px-4 lg:py-6">
      <div className="hidden items-center gap-2 px-4 mb-8 lg:flex">
        <div className="h-8 w-8 rounded-lg bg-[#58cc02] flex items-center justify-center">
          <span className="text-white font-black text-xl italic">L</span>
        </div>
        <h1 className="text-2xl font-black text-[#58cc02] tracking-tighter">linguo</h1>
      </div>

      <nav className="flex w-full justify-around lg:flex-col lg:gap-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center gap-1 rounded-xl p-2 transition-colors lg:flex-row lg:justify-start lg:gap-4 lg:px-4 lg:py-3 ${
              activeTab === item.id
                ? 'bg-[#ddf4ff] text-[#1cb0f6] border-2 border-[#84d8ff]'
                : 'text-[#777] hover:bg-[#f7f7f7]'
            }`}
          >
            <item.icon size={28} strokeWidth={activeTab === item.id ? 3 : 2} />
            <span className="text-[10px] font-bold tracking-wider lg:text-base">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
