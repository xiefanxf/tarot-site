import { spreads, tarotCards } from '@/data/tarotCards';
import type { DailyCardRecord, ReadingRecord, StoredDrawnCard, TarotUserData } from '@/types/tarot';

export const USER_DATA_STORAGE_KEY = 'solaris-luna-user-data-v1';

const cardIds = new Set(tarotCards.map(card => card.id));
const spreadById = new Map(spreads.map(spread => [spread.id, spread]));
const categoryIds = new Set(['love', 'career', 'wealth', 'health', 'general']);

export function createEmptyUserData(): TarotUserData {
  return {
    version: 1,
    readings: [],
    favorites: [],
    learned: [],
    dailyCards: [],
    reminderEnabled: false,
  };
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isIsoDateTime(value: unknown): value is string {
  return typeof value === 'string' && Number.isFinite(Date.parse(value));
}

function isLocalDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const parsed = new Date(year, month - 1, day);
  return parsed.getFullYear() === year && parsed.getMonth() === month - 1 && parsed.getDate() === day;
}

function sanitizeStoredCard(value: unknown, maxPosition: number): StoredDrawnCard | null {
  if (!isObject(value) || !isNonEmptyString(value.cardId) || !cardIds.has(value.cardId)) return null;
  if (typeof value.isReversed !== 'boolean') return null;
  if (!Number.isInteger(value.position) || (value.position as number) < 0 || (value.position as number) >= maxPosition) return null;
  return { cardId: value.cardId, isReversed: value.isReversed, position: value.position as number };
}

function sanitizeReading(value: unknown): ReadingRecord | null {
  if (!isObject(value) || !isNonEmptyString(value.id) || !isIsoDateTime(value.createdAt)) return null;
  if (!isNonEmptyString(value.spreadId)) return null;
  const spread = spreadById.get(value.spreadId);
  if (!spread || !Array.isArray(value.cards)) return null;

  const cards = value.cards
    .map(card => sanitizeStoredCard(card, spread.positions.length))
    .filter((card): card is StoredDrawnCard => card !== null)
    .sort((left, right) => left.position - right.position);
  const uniquePositions = new Set(cards.map(card => card.position));
  if (cards.length !== spread.positions.length || uniquePositions.size !== spread.positions.length) return null;

  return {
    id: value.id,
    createdAt: value.createdAt,
    category: typeof value.category === 'string' && categoryIds.has(value.category) ? value.category : 'general',
    question: typeof value.question === 'string' ? value.question : '',
    spreadId: value.spreadId,
    cards,
    journal: typeof value.journal === 'string' ? value.journal : '',
  };
}

function sanitizeDailyCard(value: unknown): DailyCardRecord | null {
  if (!isObject(value) || !isLocalDate(value.date) || !isNonEmptyString(value.cardId) || !cardIds.has(value.cardId)) return null;
  if (typeof value.isReversed !== 'boolean' || !isIsoDateTime(value.checkedInAt)) return null;
  return {
    date: value.date,
    cardId: value.cardId,
    isReversed: value.isReversed,
    reflection: typeof value.reflection === 'string' ? value.reflection : '',
    checkedInAt: value.checkedInAt,
  };
}

function sanitizeIdList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((item): item is string => typeof item === 'string' && cardIds.has(item)))];
}

export function sanitizeUserData(value: unknown): TarotUserData {
  if (!isObject(value)) return createEmptyUserData();

  const readings = Array.isArray(value.readings)
    ? value.readings.map(sanitizeReading).filter((reading): reading is ReadingRecord => reading !== null)
    : [];
  const dailyCards = Array.isArray(value.dailyCards)
    ? value.dailyCards.map(sanitizeDailyCard).filter((record): record is DailyCardRecord => record !== null)
    : [];

  return {
    version: 1,
    readings: [...new Map(readings.map(reading => [reading.id, reading])).values()].slice(0, 200),
    favorites: sanitizeIdList(value.favorites),
    learned: sanitizeIdList(value.learned),
    dailyCards: [...new Map(dailyCards.map(record => [record.date, record])).values()].slice(0, 400),
    reminderEnabled: value.reminderEnabled === true,
  };
}

export function loadUserData(storage: Pick<Storage, 'getItem'> | null = globalThis.localStorage): TarotUserData {
  try {
    if (!storage) return createEmptyUserData();
    const raw = storage?.getItem(USER_DATA_STORAGE_KEY);
    return raw ? sanitizeUserData(JSON.parse(raw)) : createEmptyUserData();
  } catch {
    return createEmptyUserData();
  }
}

export function persistUserData(data: TarotUserData, storage: Pick<Storage, 'setItem'> | null = globalThis.localStorage): boolean {
  try {
    if (!storage) return false;
    storage.setItem(USER_DATA_STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}
