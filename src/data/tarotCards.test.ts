import { describe, expect, it, vi } from 'vitest';
import { drawCards, spreads, tarotCards } from '@/data/tarotCards';
import { getLocalizedCards, getLocalizedSpreads } from '@/i18n/tarot';

describe('tarot data integrity', () => {
  it('contains 78 unique cards and complete three-language localizations', () => {
    expect(tarotCards).toHaveLength(78);
    expect(new Set(tarotCards.map(card => card.id)).size).toBe(78);
    expect(new Set(tarotCards.map(card => card.image)).size).toBe(78);

    for (const language of ['zh', 'en', 'ja'] as const) {
      const localized = getLocalizedCards(language);
      expect(localized).toHaveLength(78);
      expect(localized.map(card => card.id)).toEqual(tarotCards.map(card => card.id));
      for (const card of localized) {
        expect(card.name.trim()).not.toBe('');
        expect(card.uprightKeywords.length).toBeGreaterThan(0);
        expect(card.reversedKeywords.length).toBeGreaterThan(0);
        expect(card.uprightDescription.trim()).not.toBe('');
        expect(card.reversedDescription.trim()).not.toBe('');
      }
    }
  });

  it('keeps spread positions contiguous and aligned in every language', () => {
    expect(spreads.map(spread => spread.positions.length)).toEqual([1, 3, 10]);
    for (const language of ['zh', 'en', 'ja'] as const) {
      for (const spread of getLocalizedSpreads(language)) {
        expect(spread.positions.map(position => position.index)).toEqual(
          Array.from({ length: spread.positions.length }, (_, index) => index),
        );
        expect(spread.positions.every(position => position.label.trim() && position.description.trim())).toBe(true);
      }
    }
  });

  it('draws unique cards with stable positions and a 30% reversal boundary', () => {
    const random = vi.spyOn(Math, 'random');
    random.mockReturnValueOnce(0.5).mockReturnValueOnce(0.5)
      .mockReturnValueOnce(0.29).mockReturnValueOnce(0.3).mockReturnValueOnce(0.99);

    const source = tarotCards.slice(0, 3);
    const drawn = drawCards(3, source);
    expect(drawn.map(card => card.position)).toEqual([0, 1, 2]);
    expect(new Set(drawn.map(card => card.card.id)).size).toBe(3);
    expect(drawn.map(card => card.isReversed)).toEqual([true, false, false]);
    expect(drawn.every(card => !card.isRevealed)).toBe(true);
    random.mockRestore();
  });
});
