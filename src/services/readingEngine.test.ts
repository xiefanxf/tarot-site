import { describe, expect, it } from 'vitest';
import { tarotCards } from '@/data/tarotCards';
import { getLocalizedCards, getLocalizedSpreads } from '@/i18n/tarot';
import { synthesizeReading } from '@/services/readingEngine';
import type { DrawnCard } from '@/types/tarot';

function draw(cardIndex: number, position: number, isReversed = false): DrawnCard {
  return { card: tarotCards[cardIndex], position, isReversed, isRevealed: true };
}

describe('reading synthesis', () => {
  it('returns an empty synthesis for an empty draw', () => {
    expect(synthesizeReading([], getLocalizedSpreads('en')[0], 'general', '', 'en')).toEqual({ summary: '', patterns: [], guidance: [] });
  });

  it('produces a single-card message without describing a card moving toward itself', () => {
    const card = getLocalizedCards('en')[0];
    const result = synthesizeReading([{ card, position: 0, isReversed: false, isRevealed: true }], getLocalizedSpreads('en')[0], 'general', '', 'en');
    expect(result.summary).toContain(card.name);
    expect(result.summary).not.toContain('moves from');
    expect(result.summary.match(new RegExp(card.name, 'g'))).toHaveLength(1);
    expect(result.guidance.length).toBeGreaterThan(0);
  });

  it('adds spread-specific relationships for three-card and Celtic readings', () => {
    const three = synthesizeReading([draw(0, 0), draw(1, 1), draw(2, 2, true)], getLocalizedSpreads('zh')[1], 'career', '', 'zh');
    expect(three.patterns.some(pattern => pattern.includes('过去'))).toBe(true);
    expect(three.guidance.some(item => item.includes('逆位'))).toBe(true);

    const ten = Array.from({ length: 10 }, (_, index) => draw(index, index));
    const celtic = synthesizeReading(ten, getLocalizedSpreads('ja')[2], 'general', '', 'ja');
    expect(celtic.patterns.some(pattern => pattern.includes('中心'))).toBe(true);
    expect(celtic.summary.trim()).not.toBe('');
  });
});
