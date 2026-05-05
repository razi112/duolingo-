
import React, { useState, useEffect } from 'react';
import { X, Volume2, Info, CheckCircle2, XCircle, FastForward, Gem, Heart } from 'lucide-react';
import { Exercise, ExerciseType, Language } from '../types';
import { getExplanation } from '../services/geminiService';

interface ExerciseScreenProps {
  exercises: Exercise[];
  language: Language;
  onClose: (completed: boolean, isPerfect: boolean) => void;
  onLoseHeart: () => void;
  onSkip: () => boolean; // Returns true if skip was successful (e.g. user had enough gems)
  userGems: number;
  isPractice?: boolean;
}

const ExerciseScreen: React.FC<ExerciseScreenProps> = ({ 
  exercises, 
  language, 
  onClose, 
  onLoseHeart, 
  onSkip, 
  userGems,
  isPractice = false
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loadingExplanation, setLoadingExplanation] = useState(false);
  const [hasMistakeOrSkip, setHasMistakeOrSkip] = useState(false);

  const SKIP_COST = 10;
  const currentExercise = exercises[currentIndex];
  const progress = ((currentIndex) / exercises.length) * 100;

  const handleSubmit = async () => {
    const answer = currentExercise.type === ExerciseType.MULTIPLE_CHOICE ? selectedOption : inputText;
    if (!answer) return;

    const correct = answer.toLowerCase().trim() === currentExercise.correctAnswer.toLowerCase().trim();
    setIsCorrect(correct);
    setIsAnswered(true);

    if (!correct) {
      setHasMistakeOrSkip(true);
      if (!isPractice) {
        onLoseHeart();
      }
      setLoadingExplanation(true);
      const expl = await getExplanation(language, currentExercise, answer);
      setExplanation(expl);
      setLoadingExplanation(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsAnswered(false);
      setSelectedOption(null);
      setInputText('');
      setExplanation(null);
    } else {
      onClose(true, !hasMistakeOrSkip);
    }
  };

  const handleSkipClicked = () => {
    if (onSkip()) {
      setHasMistakeOrSkip(true);
      handleNext();
    }
  };

  if (!currentExercise) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-white">
      {/* Header */}
      <div className="flex h-20 items-center gap-4 px-4 lg:px-20">
        <button onClick={() => onClose(false, false)} className="text-[#afafaf] hover:text-[#4b4b4b]">
          <X size={32} />
        </button>
        <div className="h-4 flex-1 rounded-full bg-[#e5e5e5]">
          <div 
            className="h-full rounded-full bg-[#58cc02] transition-all duration-500" 
            style={{ width: `${progress}%` }}
          />
        </div>
        {isPractice && (
          <div className="flex items-center gap-2 bg-[#f7f7f7] px-3 py-1 rounded-full border border-[#e5e5e5]">
            <span className="text-xs font-black text-[#58cc02] uppercase">Practice Mode</span>
          </div>
        )}
      </div>

      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 lg:px-20 max-w-4xl mx-auto w-full">
        <h2 className="mb-8 text-left w-full text-2xl font-bold lg:text-3xl">
          {currentExercise.type === ExerciseType.TRANSLATION ? 'Write this in English' : 'Choose the correct meaning'}
        </h2>

        <div className="mb-12 flex w-full flex-col items-start gap-8">
          <div className="flex items-center gap-4">
            <div className="h-24 w-24 overflow-hidden rounded-2xl bg-[#e5e5e5]">
              <img src={`https://picsum.photos/seed/${currentExercise.id}/200`} alt="Prompt visual" className="h-full w-full object-cover" />
            </div>
            <div className="relative rounded-2xl border-2 border-[#e5e5e5] p-4 font-semibold text-lg">
              <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-l-2 border-b-2 border-[#e5e5e5] rotate-45"></div>
              {currentExercise.prompt}
              <button className="ml-2 inline-block text-[#1cb0f6]">
                <Volume2 size={20} />
              </button>
            </div>
          </div>

          {currentExercise.type === ExerciseType.MULTIPLE_CHOICE && (
            <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
              {currentExercise.options?.map((option) => (
                <button
                  key={option}
                  disabled={isAnswered}
                  onClick={() => setSelectedOption(option)}
                  className={`duo-button flex items-center rounded-2xl border-2 border-b-4 p-4 text-left font-bold transition-all ${
                    selectedOption === option
                      ? 'border-[#84d8ff] bg-[#ddf4ff] text-[#1cb0f6]'
                      : 'border-[#e5e5e5] text-[#4b4b4b] hover:bg-[#f7f7f7]'
                  } ${isAnswered && option === currentExercise.correctAnswer ? 'border-[#58cc02] bg-[#d7ffb8]' : ''}`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {currentExercise.type === ExerciseType.TRANSLATION && (
            <div className="w-full">
              <textarea
                disabled={isAnswered}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type in English..."
                className="w-full rounded-2xl border-2 border-[#e5e5e5] bg-[#f7f7f7] p-6 text-xl focus:border-[#1cb0f6] focus:outline-none min-h-[150px]"
              />
            </div>
          )}
        </div>
      </main>

      {/* Footer / Feedback */}
      <footer className={`h-36 lg:h-44 w-full flex items-center justify-between px-4 lg:px-20 transition-colors ${
        !isAnswered ? 'bg-white border-t-2 border-[#e5e5e5]' : (isCorrect ? 'bg-[#d7ffb8]' : 'bg-[#ffdfe0]')
      }`}>
        {isAnswered ? (
          <div className="flex flex-1 items-center gap-4">
            {isCorrect ? (
              <CheckCircle2 size={64} className="text-[#58cc02]" fill="#fff" />
            ) : (
              <XCircle size={64} className="text-[#ff4b4b]" fill="#fff" />
            )}
            <div className="flex-1">
              <h3 className={`text-xl font-black ${isCorrect ? 'text-[#58cc02]' : 'text-[#ff4b4b]'}`}>
                {isCorrect ? 'Excellent!' : 'Correct solution:'}
              </h3>
              <p className={`font-bold ${isCorrect ? 'text-[#58cc02]' : 'text-[#ff4b4b]'}`}>
                {isCorrect ? '' : currentExercise.correctAnswer}
              </p>
              {!isCorrect && explanation && (
                <div className="mt-1 flex items-start gap-1 max-w-xl">
                  <span className="mt-1 flex-shrink-0">
                    <Info size={16} />
                  </span>
                  <p className="text-sm italic opacity-80">{explanation}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1">
            <button
              onClick={handleSkipClicked}
              disabled={userGems < SKIP_COST}
              className={`flex items-center gap-2 rounded-2xl border-2 border-b-4 border-[#e5e5e5] px-6 py-3 font-black text-[#afafaf] transition-all hover:bg-[#f7f7f7] disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <FastForward size={20} />
              SKIP
              <div className="ml-2 flex items-center gap-1 text-[#1cb0f6]">
                <Gem size={16} fill="#1cb0f6" />
                <span>{SKIP_COST}</span>
              </div>
            </button>
          </div>
        )}

        <button
          onClick={isAnswered ? handleNext : handleSubmit}
          className={`duo-button w-full sm:w-48 rounded-2xl py-3 font-black tracking-widest text-white transition-all ${
            !isAnswered 
              ? ( (currentExercise.type === ExerciseType.MULTIPLE_CHOICE ? selectedOption : inputText) ? 'bg-[#58cc02]' : 'bg-[#e5e5e5] cursor-not-allowed')
              : (isCorrect ? 'bg-[#58cc02]' : 'bg-[#ff4b4b]')
          }`}
        >
          {isAnswered ? 'CONTINUE' : 'CHECK'}
        </button>
      </footer>
    </div>
  );
};

export default ExerciseScreen;
