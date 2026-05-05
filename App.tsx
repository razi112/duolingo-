
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import LessonNode from './components/LessonNode';
import ExerciseScreen from './components/ExerciseScreen';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import MilestoneModal from './components/MilestoneModal';
import { UserStats, Unit, Lesson, Language, Badge } from './types';
import { INITIAL_UNITS } from './constants';
import { generateExercises } from './services/geminiService';
import { Loader2, Pencil, Check, X, Camera, Award, Trophy, Zap, BookOpen, Brain } from 'lucide-react';

const AVATAR_OPTIONS = [
  'https://api.dicebear.com/7.x/bottts/svg?seed=Felix',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Buddy',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Luna',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Zoe',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Max',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Shadow',
];

const ALL_BADGES: Badge[] = [
  { id: 'first_lesson', name: 'First Steps', description: 'Complete your first lesson.', icon: '🎓' },
  { id: 'unit_1_complete', name: 'Unit 1 Master', description: 'Master all basics in Unit 1.', icon: '🌟' },
  { id: 'perfect_lesson', name: 'Flawless', description: 'Complete a lesson without a single mistake.', icon: '✨' },
  { id: 'unit_2_complete', name: 'Family Explorer', description: 'Complete all lessons in Unit 2.', icon: '🏠' },
];

const SKIP_COST = 10;

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [activeTab, setActiveTab] = useState('learn');
  const [stats, setStats] = useState<UserStats>({
    xp: 0,
    streak: 5,
    gems: 420,
    hearts: 5,
    level: 1,
    selectedLanguage: 'Spanish',
    displayName: 'Super Learner',
    avatarUrl: AVATAR_OPTIONS[0],
    badges: []
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempName, setTempName] = useState(stats.displayName);
  const [tempAvatar, setTempAvatar] = useState(stats.avatarUrl);
  
  const [units, setUnits] = useState<Unit[]>(INITIAL_UNITS);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(false);
  const [milestone, setMilestone] = useState<{ type: 'unit' | 'perfect'; title: string; description: string; rewards: { xp: number; gems: number } } | null>(null);
  const [isPracticeSession, setIsPracticeSession] = useState(false);

  const handleStartLogin = (language: Language) => {
    setStats(prev => ({
      ...prev,
      selectedLanguage: language
    }));
    setUnits(INITIAL_UNITS.map(u => ({
      ...u,
      lessons: u.lessons.map((l, i) => ({
        ...l,
        status: i === 0 ? 'available' : 'locked'
      }))
    })));
    setIsLoggedIn(true);
    setIsLoggingIn(false);
  };

  const handleOpenLoginPage = () => {
    setIsLoggingIn(true);
  };

  const handleStartLesson = async (lesson: Lesson, isPractice: boolean = false) => {
    setLoading(true);
    setIsPracticeSession(isPractice);
    try {
      const unit = units.find(u => u.lessons.some(l => l.id === lesson.id));
      const exercises = await generateExercises(stats.selectedLanguage, unit?.title || 'Basics', stats.level);
      
      setActiveLesson({
        ...lesson,
        exercises
      });
    } catch (error) {
      console.error("Error generating exercises", error);
      alert("Oops! Gemini failed to generate exercises. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLessonFinish = (completed: boolean, isPerfect: boolean) => {
    if (completed && activeLesson) {
      if (isPracticeSession) {
        // Practice rewards: 5 XP, no gems
        setStats(prev => ({
          ...prev,
          xp: prev.xp + 5,
        }));
      } else {
        // Standard lesson rewards
        let baseXP = 15;
        let baseGems = 10;
        let bonusXP = isPerfect ? 10 : 0;
        let bonusGems = isPerfect ? 5 : 0;
        
        const newBadges: Badge[] = [...stats.badges];
        
        if (isPerfect && !newBadges.some(b => b.id === 'perfect_lesson')) {
          const badge = ALL_BADGES.find(b => b.id === 'perfect_lesson')!;
          newBadges.push({ ...badge, earnedDate: new Date().toISOString() });
        }

        if (!newBadges.some(b => b.id === 'first_lesson')) {
          const badge = ALL_BADGES.find(b => b.id === 'first_lesson')!;
          newBadges.push({ ...badge, earnedDate: new Date().toISOString() });
        }

        const updatedUnits = units.map(unit => {
          const updatedLessons = unit.lessons.map((l, i) => {
            if (l.id === activeLesson.id) {
              return { ...l, status: 'completed' as const };
            }
            const prevLesson = unit.lessons[i-1];
            if (prevLesson?.id === activeLesson.id && l.status === 'locked') {
              return { ...l, status: 'available' as const };
            }
            return l;
          });

          const wasCompletedBefore = unit.lessons.every(l => l.status === 'completed');
          const isCompletedNow = updatedLessons.every(l => l.status === 'completed');

          if (!wasCompletedBefore && isCompletedNow) {
            const unitBadgeId = unit.id === 'unit-1' ? 'unit_1_complete' : 'unit_2_complete';
            if (!newBadges.some(b => b.id === unitBadgeId)) {
              const badge = ALL_BADGES.find(b => b.id === unitBadgeId);
              if (badge) newBadges.push({ ...badge, earnedDate: new Date().toISOString() });
            }
            
            setMilestone({
              type: 'unit',
              title: 'UNIT COMPLETE!',
              description: `You've mastered ${unit.title}! Enjoy your reward.`,
              rewards: { xp: 50, gems: 50 }
            });
            
            bonusXP += 50;
            bonusGems += 50;
          }

          return { ...unit, lessons: updatedLessons };
        });

        if (isPerfect && !milestone) {
          setMilestone({
            type: 'perfect',
            title: 'PERFECT LESSON!',
            description: "Zero mistakes! You're a natural!",
            rewards: { xp: 10, gems: 5 }
          });
        }

        setStats(prev => ({
          ...prev,
          xp: prev.xp + baseXP + bonusXP,
          gems: prev.gems + baseGems + bonusGems,
          badges: newBadges
        }));

        setUnits(updatedUnits);
      }
    }
    setActiveLesson(null);
    setIsPracticeSession(false);
  };

  const handleLoseHeart = () => {
    setStats(prev => ({
      ...prev,
      hearts: Math.max(0, prev.hearts - 1)
    }));
  };

  const handleSkipExercise = (): boolean => {
    if (stats.gems >= SKIP_COST) {
      setStats(prev => ({
        ...prev,
        gems: prev.gems - SKIP_COST
      }));
      return true;
    }
    return false;
  };

  const saveProfile = () => {
    setStats(prev => ({
      ...prev,
      displayName: tempName,
      avatarUrl: tempAvatar
    }));
    setIsEditingProfile(false);
  };

  const cancelProfileEdit = () => {
    setTempName(stats.displayName);
    setTempAvatar(stats.avatarUrl);
    setIsEditingProfile(false);
  };

  if (!isLoggedIn) {
    if (isLoggingIn) {
      return (
        <LoginPage 
          onBack={() => setIsLoggingIn(false)} 
          onLogin={() => {
            setIsLoggedIn(true);
            setIsLoggingIn(false);
          }} 
        />
      );
    }
    return <LandingPage onStart={handleStartLogin} onLoginClick={handleOpenLoginPage} />;
  }

  return (
    <div className="min-h-screen bg-white pb-24 lg:pb-0 lg:pl-64">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <TopBar stats={stats} />

      <main className="mx-auto max-w-2xl px-4 py-10">
        {activeTab === 'learn' && (
          <div className="flex flex-col items-center">
            {units.map((unit) => {
              const completedCount = unit.lessons.filter(l => l.status === 'completed').length;
              const totalCount = unit.lessons.length;
              const percentage = Math.round((completedCount / totalCount) * 100);

              return (
                <div key={unit.id} className="w-full mb-12">
                  <div className="mb-8 rounded-2xl bg-[#58cc02] p-6 text-white shadow-lg relative overflow-hidden group">
                    <div className="relative z-10 flex flex-col gap-4">
                      <div>
                        <h2 className="text-xl font-black uppercase tracking-wider">{unit.title}</h2>
                        <p className="font-bold opacity-80">{unit.description}</p>
                      </div>

                      {/* Unit Progress Bar */}
                      <div className="w-full max-w-sm">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-[10px] font-black uppercase tracking-widest opacity-90">
                            Lessons: {completedCount} / {totalCount}
                          </span>
                          <span className="text-[10px] font-black">{percentage}%</span>
                        </div>
                        <div className="h-2.5 w-full bg-black/15 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-white transition-all duration-1000 ease-out rounded-full shadow-[0_0_8px_rgba(255,255,255,0.4)]"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    {completedCount === totalCount && (
                      <Trophy className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 group-hover:scale-110 transition-transform" size={80} />
                    )}
                  </div>
                  
                  <div className="flex flex-col items-center gap-4">
                    {unit.lessons.map((lesson, idx) => (
                      <LessonNode 
                        key={lesson.id} 
                        lesson={lesson} 
                        index={idx}
                        onStart={(l) => handleStartLesson(l, false)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'practice' && (
          <div className="flex flex-col gap-8">
            <header>
              <h2 className="text-3xl font-black text-[#4b4b4b]">Practice Hub</h2>
              <p className="text-[#afafaf] font-bold text-lg mt-2">Strengthen your skills without losing hearts.</p>
            </header>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <button 
                onClick={() => handleStartLesson(units[0].lessons[0], true)}
                className="duo-button flex flex-col items-start gap-4 p-6 rounded-2xl border-2 border-b-4 border-[#e5e5e5] hover:bg-[#f7f7f7] transition-all text-left group"
              >
                <div className="h-12 w-12 rounded-xl bg-[#1cb0f6] flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <Zap size={24} fill="currentColor" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#4b4b4b]">Speed Review</h3>
                  <p className="text-[#afafaf] font-bold text-sm">Review recently learned basics.</p>
                </div>
              </button>

              <button 
                onClick={() => handleStartLesson(units[0].lessons[1], true)}
                className="duo-button flex flex-col items-start gap-4 p-6 rounded-2xl border-2 border-b-4 border-[#e5e5e5] hover:bg-[#f7f7f7] transition-all text-left group"
              >
                <div className="h-12 w-12 rounded-xl bg-[#ffc800] flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <BookOpen size={24} fill="currentColor" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#4b4b4b]">Vocabulary</h3>
                  <p className="text-[#afafaf] font-bold text-sm">Focus on building your word bank.</p>
                </div>
              </button>

              <button 
                onClick={() => handleStartLesson(units[0].lessons[2], true)}
                className="duo-button flex flex-col items-start gap-4 p-6 rounded-2xl border-2 border-b-4 border-[#e5e5e5] hover:bg-[#f7f7f7] transition-all text-left group sm:col-span-2"
              >
                <div className="h-12 w-12 rounded-xl bg-[#58cc02] flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <Brain size={24} fill="currentColor" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-black text-[#4b4b4b]">Grammar Focus</h3>
                  <p className="text-[#afafaf] font-bold text-sm">Practice structures and sentence formation.</p>
                </div>
              </button>
            </div>

            <div className="bg-[#ddf4ff] border-2 border-[#84d8ff] rounded-2xl p-6">
              <h4 className="font-black text-[#1cb0f6] text-lg mb-2">Practice makes perfect!</h4>
              <p className="text-[#1cb0f6] font-bold opacity-80">Practice sessions award 5 XP each and help keep your memory fresh. You don't lose hearts here, so take your time!</p>
            </div>
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="flex flex-col items-center py-20 text-center">
            <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Shield" className="w-32 h-32 mb-6 rounded-full" />
            <h2 className="text-2xl font-black text-[#4b4b4b]">Unlock Leaderboards!</h2>
            <p className="text-[#afafaf] font-bold mt-2">Complete 10 more lessons to compete with others.</p>
          </div>
        )}

        {activeTab === 'shop' && (
          <div className="grid grid-cols-1 gap-4">
            <h2 className="text-2xl font-black mb-4">Shop</h2>
            <div className="border-2 border-[#e5e5e5] rounded-2xl p-6 flex items-center justify-between">
              <div>
                <h3 className="font-black text-xl">Refill Hearts</h3>
                <p className="text-[#afafaf] font-bold">Get back to full health.</p>
              </div>
              <button 
                onClick={() => {
                   if (stats.gems >= 450) {
                     setStats(prev => ({ ...prev, hearts: 5, gems: prev.gems - 450 }));
                   } else {
                     alert("Not enough gems!");
                   }
                }}
                className="bg-[#1cb0f6] text-white px-6 py-2 rounded-xl font-black duo-button"
              >
                450 Gems
              </button>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="flex flex-col items-center pt-10">
            {!isEditingProfile ? (
              <>
                <div className="group relative w-32 h-32 rounded-full border-4 border-[#e5e5e5] overflow-hidden mb-4">
                  <img src={stats.avatarUrl} alt="Avatar" className="w-full h-full bg-slate-100" />
                  <button 
                    onClick={() => setIsEditingProfile(true)}
                    className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                  >
                    <Camera size={24} />
                  </button>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-3xl font-black">{stats.displayName}</h2>
                  <button 
                    onClick={() => setIsEditingProfile(true)}
                    className="p-1 text-[#afafaf] hover:text-[#1cb0f6] transition-colors"
                  >
                    <Pencil size={20} />
                  </button>
                </div>
                <p className="text-[#afafaf] font-bold mb-8">Joined May 2024</p>

                <div className="w-full mb-10">
                  <h3 className="text-lg font-black text-[#4b4b4b] uppercase tracking-wider mb-4 border-b-2 border-[#e5e5e5] pb-2 flex items-center gap-2">
                    <Award className="text-[#ffc800]" /> Achievements
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {ALL_BADGES.map((badge) => {
                      const earned = stats.badges.find(b => b.id === badge.id);
                      return (
                        <div key={badge.id} className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${earned ? 'border-[#ffc800] bg-[#fffcf0]' : 'border-[#e5e5e5] bg-white opacity-40 grayscale'}`}>
                          <span className="text-4xl mb-2">{badge.icon}</span>
                          <p className="text-xs font-black text-center">{badge.name}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <button 
                  onClick={() => setIsLoggedIn(false)}
                  className="mt-4 text-[#ff4b4b] font-black text-sm hover:underline"
                >
                  LOG OUT / CHANGE LANGUAGE
                </button>
              </>
            ) : (
              <div className="w-full bg-white border-2 border-[#e5e5e5] rounded-2xl p-8 flex flex-col items-center shadow-sm">
                <h3 className="text-xl font-black mb-6">Edit Profile</h3>
                
                <div className="mb-8 flex flex-col items-center">
                  <p className="text-sm font-black text-[#afafaf] uppercase tracking-wider mb-4">Choose an Avatar</p>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {AVATAR_OPTIONS.map((url) => (
                      <button
                        key={url}
                        onClick={() => setTempAvatar(url)}
                        className={`w-16 h-16 rounded-full border-4 overflow-hidden transition-all ${
                          tempAvatar === url ? 'border-[#1cb0f6] scale-110 shadow-md' : 'border-transparent hover:border-[#e5e5e5]'
                        }`}
                      >
                        <img src={url} alt="Avatar Option" className="w-full h-full bg-slate-50" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="w-full mb-8">
                  <label className="block text-sm font-black text-[#afafaf] uppercase tracking-wider mb-2">Display Name</label>
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="w-full p-4 border-2 border-[#e5e5e5] rounded-xl font-bold text-lg focus:border-[#1cb0f6] focus:outline-none transition-colors"
                    placeholder="Enter your name"
                  />
                </div>

                <div className="flex gap-4 w-full">
                  <button 
                    onClick={cancelProfileEdit}
                    className="flex-1 duo-button border-2 border-[#e5e5e5] p-3 rounded-xl font-black text-[#afafaf] flex items-center justify-center gap-2"
                  >
                    <X size={20} /> CANCEL
                  </button>
                  <button 
                    onClick={saveProfile}
                    className="flex-1 duo-button bg-[#58cc02] p-3 rounded-xl font-black text-white flex items-center justify-center gap-2"
                  >
                    <Check size={20} /> SAVE CHANGES
                  </button>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4 w-full mt-10">
              <div className="border-2 border-[#e5e5e5] rounded-2xl p-4 flex gap-3 items-center">
                <div className="text-orange-500 font-bold text-2xl">🔥</div>
                <div>
                   <p className="font-black text-xl">{stats.streak}</p>
                   <p className="text-sm font-bold text-[#afafaf]">Day Streak</p>
                </div>
              </div>
              <div className="border-2 border-[#e5e5e5] rounded-2xl p-4 flex gap-3 items-center">
                <div className="text-blue-500 font-bold text-2xl">💎</div>
                <div>
                   <p className="font-black text-xl">{stats.gems}</p>
                   <p className="text-sm font-bold text-[#afafaf]">Total Gems</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Overlays */}
      {loading && (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-white bg-opacity-95">
          <Loader2 size={64} className="animate-spin text-[#58cc02]" />
          <h2 className="mt-6 text-2xl font-black text-[#58cc02]">Gemini is preparing your lesson...</h2>
          <p className="mt-2 text-[#afafaf] font-bold italic">"Consistency is key to mastery!"</p>
        </div>
      )}

      {activeLesson && activeLesson.exercises.length > 0 && (
        <ExerciseScreen 
          exercises={activeLesson.exercises} 
          language={stats.selectedLanguage}
          onClose={handleLessonFinish}
          onLoseHeart={handleLoseHeart}
          onSkip={handleSkipExercise}
          userGems={stats.gems}
          isPractice={isPracticeSession}
        />
      )}

      {milestone && (
        <MilestoneModal 
          type={milestone.type}
          title={milestone.title}
          description={milestone.description}
          rewards={milestone.rewards}
          onClose={() => setMilestone(null)}
        />
      )}
    </div>
  );
};

export default App;
