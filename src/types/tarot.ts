export type ArcanaType = 'major' | 'minor';
export type Language = 'zh' | 'en' | 'ja';
export type SuitType = 'wands' | 'cups' | 'swords' | 'pentacles' | 'major';
export type AppState = 'intro' | 'question' | 'shuffle' | 'spreadSelect' | 'dealing' | 'reading' | 'reveal' | 'history' | 'daily' | 'library' | 'privacy';

export interface TarotCard {
  id: string;
  name: string;
  nameEn: string;
  arcana: ArcanaType;
  suit: SuitType;
  number: number;
  romanNumeral: string;
  image: string;
  uprightKeywords: string[];
  uprightDescription: string;
  reversedKeywords: string[];
  reversedDescription: string;
  element: string;
  planet?: string;
  zodiac?: string;
}

export interface DrawnCard {
  card: TarotCard;
  isReversed: boolean;
  position: number;
  isRevealed: boolean;
}

export interface SpreadPosition {
  index: number;
  label: string;
  x: number;
  y: number;
  description: string;
  isCross?: boolean;
}

export interface SpreadType {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  positions: SpreadPosition[];
}

export interface QuestionCategory {
  id: string;
  label: string;
  icon: string;
}

export interface StoredDrawnCard {
  cardId: string;
  isReversed: boolean;
  position: number;
}

export interface ReadingRecord {
  id: string;
  createdAt: string;
  category: string;
  question: string;
  spreadId: string;
  cards: StoredDrawnCard[];
  journal: string;
}

export interface DailyCardRecord {
  date: string;
  cardId: string;
  isReversed: boolean;
  reflection: string;
  checkedInAt: string;
}

export interface TarotUserData {
  version: 1;
  readings: ReadingRecord[];
  favorites: string[];
  learned: string[];
  dailyCards: DailyCardRecord[];
  reminderEnabled: boolean;
}
