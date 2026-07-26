import { describe, expect, it } from 'vitest';
import { spreads } from '@/data/tarotCards';
import {
  createEmptyUserData,
  loadUserData,
  persistUserData,
  sanitizeUserData,
  USER_DATA_STORAGE_KEY,
} from '@/data/userDataStorage';

const validReading = {
  id: 'reading-1',
  createdAt: '2026-07-26T04:00:00.000Z',
  category: 'career',
  question: 'What next?',
  spreadId: spreads[0].id,
  cards: [{ cardId: 'm0', isReversed: false, position: 0 }],
  journal: 'Take one clear step.',
};

describe('user data storage', () => {
  it('falls back safely for corrupted JSON and unavailable storage', () => {
    expect(loadUserData({ getItem: () => '{broken' })).toEqual(createEmptyUserData());
    expect(loadUserData({ getItem: () => { throw new Error('blocked'); } })).toEqual(createEmptyUserData());
  });

  it('sanitizes malformed records, unknown IDs, duplicates, and missing fields', () => {
    const sanitized = sanitizeUserData({
      version: 999,
      readings: [validReading, validReading, { ...validReading, id: 'bad-card', cards: [{ cardId: 'unknown', isReversed: false, position: 0 }] }],
      favorites: ['m0', 'm0', 'unknown', 3],
      learned: ['m1', null],
      dailyCards: [
        { date: '2026-07-26', cardId: 'm2', isReversed: true, reflection: 'Notice intuition.', checkedInAt: '2026-07-26T05:00:00.000Z' },
        { date: '2026-02-31', cardId: 'm2', isReversed: true, checkedInAt: 'bad' },
      ],
      reminderEnabled: 'yes',
    });

    expect(sanitized.version).toBe(1);
    expect(sanitized.readings).toEqual([validReading]);
    expect(sanitized.favorites).toEqual(['m0']);
    expect(sanitized.learned).toEqual(['m1']);
    expect(sanitized.dailyCards).toHaveLength(1);
    expect(sanitized.reminderEnabled).toBe(false);
  });

  it('keeps running when a quota or security error prevents persistence', () => {
    const data = createEmptyUserData();
    expect(persistUserData(data, { setItem: () => { throw new DOMException('Quota exceeded', 'QuotaExceededError'); } })).toBe(false);

    let writtenKey = '';
    expect(persistUserData(data, { setItem: key => { writtenKey = key; } })).toBe(true);
    expect(writtenKey).toBe(USER_DATA_STORAGE_KEY);
  });
});
