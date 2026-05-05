
import { Unit, ExerciseType, Language } from './types';

export interface LanguageOption {
  name: Language;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  // Original & Popular
  { name: 'Spanish', flag: 'es' },
  { name: 'French', flag: 'fr' },
  { name: 'German', flag: 'de' },
  { name: 'Italian', flag: 'it' },
  { name: 'Portuguese', flag: 'pt' },
  { name: 'Dutch', flag: 'nl' },
  
  // European
  { name: 'Swedish', flag: 'se' },
  { name: 'Norwegian', flag: 'no' },
  { name: 'Danish', flag: 'dk' },
  { name: 'Russian', flag: 'ru' },
  { name: 'Irish', flag: 'ie' },
  { name: 'Greek', flag: 'gr' },
  { name: 'Polish', flag: 'pl' },
  { name: 'Hungarian', flag: 'hu' },
  { name: 'Romanian', flag: 'ro' },
  { name: 'Turkish', flag: 'tr' },
  { name: 'Ukrainian', flag: 'ua' },

  // Asian
  { name: 'Japanese', flag: 'jp' },
  { name: 'Chinese', flag: 'cn' },
  { name: 'Korean', flag: 'kr' },
  { name: 'Hindi', flag: 'in' },
  { name: 'Indonesian', flag: 'id' },
  { name: 'Vietnamese', flag: 'vn' },

  // Middle Eastern & African
  { name: 'Arabic', flag: 'sa' },
  { name: 'Hebrew', flag: 'il' },
  { name: 'Swahili', flag: 'ke' },

  // Constructed & Special
  { name: 'Esperanto', flag: 'un' }, // Generic placeholder for constructed
  { name: 'High Valyrian', flag: 'un' },
  { name: 'Klingon', flag: 'un' },

  // Regional
  { name: 'Scottish Gaelic', flag: 'gb' },
  { name: 'Welsh', flag: 'gb' },
  { name: 'Hawaiian', flag: 'us' },
  { name: 'Navajo', flag: 'us' },
];

export const INITIAL_UNITS: Unit[] = [
  {
    id: 'unit-1',
    title: 'Unit 1: Basics',
    description: 'Learn common greetings and basic introductions.',
    lessons: [
      { id: 'l1', title: 'Greetings', status: 'available', exercises: [] },
      { id: 'l2', title: 'Basic Phrases', status: 'locked', exercises: [] },
      { id: 'l3', title: 'Introductions', status: 'locked', exercises: [] },
      { id: 'l4', title: 'Numbers', status: 'locked', exercises: [] },
    ]
  },
  {
    id: 'unit-2',
    title: 'Unit 2: Family & Friends',
    description: 'Talk about the people closest to you.',
    lessons: [
      { id: 'l5', title: 'Family Members', status: 'locked', exercises: [] },
      { id: 'l6', title: 'Descriptions', status: 'locked', exercises: [] },
      { id: 'l7', title: 'Activities', status: 'locked', exercises: [] },
    ]
  }
];

export const APP_COLORS = {
  primary: '#58cc02',
  primaryDark: '#46a302',
  secondary: '#1cb0f6',
  accent: '#ffc800',
  error: '#ff4b4b',
  text: '#4b4b4b',
  muted: '#afafaf',
  border: '#e5e5e5'
};
