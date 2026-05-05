
import React from 'react';
import { Trophy, Gem, Sparkles, Star } from 'lucide-react';

interface MilestoneModalProps {
  type: 'unit' | 'perfect';
  title: string;
  description: string;
  rewards: { xp: number; gems: number };
  onClose: () => void;
}

const MilestoneModal: React.FC<MilestoneModalProps> = ({ type, title, description, rewards, onClose }) => {
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm p-8 flex flex-col items-center text-center shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="relative mb-6">
          <div className="absolute inset-0 animate-ping opacity-20">
             <Sparkles size={80} className="text-[#ffc800]" />
          </div>
          <div className="h-24 w-24 bg-[#ffc800] rounded-full flex items-center justify-center shadow-lg relative z-10">
            {type === 'unit' ? (
              <Trophy size={48} className="text-white" fill="white" />
            ) : (
              <Star size={48} className="text-white" fill="white" />
            )}
          </div>
        </div>

        <h2 className="text-3xl font-black text-[#4b4b4b] mb-2 uppercase tracking-tight">{title}</h2>
        <p className="text-[#afafaf] font-bold mb-8">{description}</p>

        <div className="grid grid-cols-2 gap-4 w-full mb-8">
          <div className="bg-[#f7f7f7] rounded-2xl p-4 border-b-4 border-[#e5e5e5]">
            <p className="text-xs font-black text-[#afafaf] uppercase tracking-widest mb-1">XP EARNED</p>
            <p className="text-2xl font-black text-[#58cc02]">+{rewards.xp}</p>
          </div>
          <div className="bg-[#f7f7f7] rounded-2xl p-4 border-b-4 border-[#e5e5e5]">
            <p className="text-xs font-black text-[#afafaf] uppercase tracking-widest mb-1">GEMS</p>
            <div className="flex items-center justify-center gap-1">
              <Gem size={20} className="text-[#1cb0f6]" fill="#1cb0f6" />
              <p className="text-2xl font-black text-[#1cb0f6]">+{rewards.gems}</p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="duo-button w-full bg-[#58cc02] text-white py-4 rounded-2xl font-black text-lg tracking-widest border-b-[6px] border-[#46a302] active:translate-y-1 active:border-b-0 transition-all"
        >
          CONTINUE
        </button>
      </div>
    </div>
  );
};

export default MilestoneModal;
