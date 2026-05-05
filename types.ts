
export type Language = 
  | 'Spanish' 
  | 'French' 
  | 'German' 
  | 'Italian' 
  | 'Portuguese' 
  | 'Dutch' 
  | 'Swedish' 
  | 'Norwegian' 
  | 'Danish' 
  | 'Russian' 
  | 'Irish' 
  | 'Greek' 
  | 'Polish' 
  | 'Hungarian' 
  | 'Romanian' 
  | 'Turkish' 
  | 'Ukrainian' 
  | 'Japanese' 
  | 'Chinese' 
  | 'Korean' 
  | 'Hindi' 
  | 'Indonesian' 
  | 'Vietnamese' 
  | 'Arabic' 
  | 'Hebrew' 
  | 'Swahili' 
  | 'Esperanto' 
  | 'High Valyrian' 
  | 'Klingon' 
  | 'Scottish Gaelic' 
  | 'Welsh' 
  | 'Hawaiian' 
  | 'Navajo';

export enum ExerciseType {
  TRANSLATION = 'TRANSLATION',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  LISTENING = 'LISTENING',
  SPEAKING = 'SPEAKING'
}

export interface Exercise {
  id: string;
  type: ExerciseType;
  prompt: string;
  correctAnswer: string;
  options?: string[];
  audioUrl?: string;
  difficulty: number;
}

export interface Unit {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  exercises: Exercise[];
  status: 'locked' | 'available' | 'completed';
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedDate?: string;
}

export interface UserStats {
  xp: number;
  streak: number;
  gems: number;
  hearts: number;
  level: number;
  selectedLanguage: Language;
  displayName: string;
  avatarUrl: string;
  badges: Badge[];
}
