/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { DailyCardRecord, DrawnCard, ReadingRecord, TarotUserData } from '@/types/tarot';
import { loadUserData, persistUserData } from '@/data/userDataStorage';

function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function dayBefore(dateKey: string) {
  const date = new Date(`${dateKey}T12:00:00`);
  date.setDate(date.getDate() - 1);
  return localDateKey(date);
}

function hashDate(dateKey: string) {
  let hash = 2166136261;
  for (const char of dateKey) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

interface UserDataValue {
  data: TarotUserData;
  createReading: (input: { category: string; question: string; spreadId: string; cards: DrawnCard[] }) => ReadingRecord;
  updateJournal: (id: string, journal: string) => void;
  removeReading: (id: string) => void;
  toggleFavorite: (cardId: string) => void;
  toggleLearned: (cardId: string) => void;
  getTodayCard: () => DailyCardRecord | null;
  checkInToday: (cardIds: string[]) => DailyCardRecord;
  updateDailyReflection: (date: string, reflection: string) => void;
  streak: number;
  setReminderEnabled: (enabled: boolean) => void;
}

const UserDataContext = createContext<UserDataValue | null>(null);

export function TarotDataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<TarotUserData>(loadUserData);

  const commit = useCallback((update: (current: TarotUserData) => TarotUserData) => {
    setData(current => {
      const next = update(current);
      persistUserData(next);
      return next;
    });
  }, []);

  const createReading = useCallback((input: { category: string; question: string; spreadId: string; cards: DrawnCard[] }) => {
    const record: ReadingRecord = {
      id: globalThis.crypto?.randomUUID?.() ?? `reading-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      createdAt: new Date().toISOString(),
      category: input.category,
      question: input.question.trim(),
      spreadId: input.spreadId,
      cards: input.cards.map(card => ({ cardId: card.card.id, isReversed: card.isReversed, position: card.position })),
      journal: '',
    };
    commit(current => ({ ...current, readings: [record, ...current.readings].slice(0, 200) }));
    return record;
  }, [commit]);

  const updateJournal = useCallback((id: string, journal: string) => {
    commit(current => ({ ...current, readings: current.readings.map(reading => reading.id === id ? { ...reading, journal } : reading) }));
  }, [commit]);

  const removeReading = useCallback((id: string) => {
    commit(current => ({ ...current, readings: current.readings.filter(reading => reading.id !== id) }));
  }, [commit]);

  const toggleFavorite = useCallback((cardId: string) => {
    commit(current => ({ ...current, favorites: current.favorites.includes(cardId) ? current.favorites.filter(id => id !== cardId) : [...current.favorites, cardId] }));
  }, [commit]);

  const toggleLearned = useCallback((cardId: string) => {
    commit(current => ({ ...current, learned: current.learned.includes(cardId) ? current.learned.filter(id => id !== cardId) : [...current.learned, cardId] }));
  }, [commit]);

  const getTodayCard = useCallback(() => data.dailyCards.find(record => record.date === localDateKey()) ?? null, [data.dailyCards]);

  const checkInToday = useCallback((cardIds: string[]) => {
    const date = localDateKey();
    const existing = data.dailyCards.find(record => record.date === date);
    if (existing) return existing;
    const hash = hashDate(date);
    const record: DailyCardRecord = {
      date,
      cardId: cardIds[hash % cardIds.length],
      isReversed: hash % 10 < 3,
      reflection: '',
      checkedInAt: new Date().toISOString(),
    };
    commit(current => ({ ...current, dailyCards: [record, ...current.dailyCards].slice(0, 400) }));
    return record;
  }, [commit, data.dailyCards]);

  const updateDailyReflection = useCallback((date: string, reflection: string) => {
    commit(current => ({ ...current, dailyCards: current.dailyCards.map(record => record.date === date ? { ...record, reflection } : record) }));
  }, [commit]);

  const streak = useMemo(() => {
    const dates = new Set(data.dailyCards.map(record => record.date));
    let cursor = localDateKey();
    if (!dates.has(cursor)) cursor = dayBefore(cursor);
    let count = 0;
    while (dates.has(cursor)) {
      count += 1;
      cursor = dayBefore(cursor);
    }
    return count;
  }, [data.dailyCards]);

  const setReminderEnabled = useCallback((enabled: boolean) => {
    commit(current => ({ ...current, reminderEnabled: enabled }));
  }, [commit]);

  const value = useMemo(() => ({ data, createReading, updateJournal, removeReading, toggleFavorite, toggleLearned, getTodayCard, checkInToday, updateDailyReflection, streak, setReminderEnabled }), [data, createReading, updateJournal, removeReading, toggleFavorite, toggleLearned, getTodayCard, checkInToday, updateDailyReflection, streak, setReminderEnabled]);
  return <UserDataContext.Provider value={value}>{children}</UserDataContext.Provider>;
}

export function useTarotData() {
  const value = useContext(UserDataContext);
  if (!value) throw new Error('useTarotData must be used inside TarotDataProvider');
  return value;
}
