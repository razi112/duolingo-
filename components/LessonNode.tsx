
import React from 'react';
import { Check, Star } from 'lucide-react';
import { Lesson } from '../types';

interface LessonNodeProps {
  lesson: Lesson;
  index: number;
  onStart: (lesson: Lesson) => void;
}

const LessonNode: React.FC<LessonNodeProps> = ({ lesson, index, onStart }) => {
  // Horizontal offset to create the winding path effect
  const offset = [0, 40, 60, 40, 0, -40, -60, -40][index % 8];

  const colors = {
    completed: 'bg-[#58cc02] border-[#46a302] text-white',
    available: 'bg-[#58cc02] border-[#46a302] text-white',
    locked: 'bg-[#e5e5e5] border-[#afafaf] text-[#afafaf]'
  };

  return (
    <div className="relative mb-8 flex flex-col items-center group" style={{ marginLeft: `${offset}px` }}>
      <button
        disabled={lesson.status === 'locked'}
        onClick={() => onStart(lesson)}
        className={`duo-button relative h-20 w-20 rounded-full border-b-[6px] transition-transform flex items-center justify-center ${
          colors[lesson.status]
        } ${lesson.status !== 'locked' ? 'hover:scale-105 active:translate-y-1' : ''}`}
      >
        {lesson.status === 'completed' ? (
          <Check size={32} strokeWidth={4} />
        ) : (
          <Star size={32} fill="currentColor" />
        )}

        {lesson.status === 'available' && (
            <div className="absolute -top-12 bg-white text-[#4b4b4b] px-3 py-1 rounded-xl shadow-lg border-2 border-[#e5e5e5] font-bold text-sm whitespace-nowrap animate-bounce">
                START!
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-b-2 border-r-2 border-[#e5e5e5] rotate-45"></div>
            </div>
        )}
      </button>
      <span className="mt-2 font-bold text-[#4b4b4b]">{lesson.title}</span>
    </div>
  );
};

export default LessonNode;
