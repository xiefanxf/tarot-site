import { describe, expect, it } from 'vitest';
import { getShareGrid, getSharePlacements } from './shareCard';

describe('getShareGrid', () => {
  it('keeps a single card prominent', () => {
    expect(getShareGrid(1)).toMatchObject({ columns: 1, cardWidth: 280 });
  });

  it('lays out common multi-card spreads without dropping cards', () => {
    expect(getShareGrid(3).columns).toBe(3);
    expect(getShareGrid(5).columns).toBe(3);
    expect(Math.ceil(5 / getShareGrid(5).columns)).toBe(2);
    expect(getShareGrid(10).columns).toBe(5);
    expect(Math.ceil(10 / getShareGrid(10).columns)).toBe(2);
  });

  it.each([1, 3, 5, 10])('creates one in-bounds image slot for every card in a %i-card spread', count => {
    const placements = getSharePlacements(count);
    expect(placements).toHaveLength(count);
    placements.forEach(placement => {
      expect(placement.x).toBeGreaterThanOrEqual(0);
      expect(placement.y).toBeGreaterThanOrEqual(0);
      expect(placement.x + placement.width).toBeLessThanOrEqual(1080);
      expect(placement.y + placement.height).toBeLessThanOrEqual(1450);
    });
  });
});
