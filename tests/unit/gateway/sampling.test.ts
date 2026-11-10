import { describe, expect, it } from 'vitest';
import { resolveTemperature } from '../../../apps/gateway/src/services/sampling.js';

describe('resolveTemperature', () => {
  it('keeps temperature 0 instead of treating it as missing', () => {
    expect(resolveTemperature(0)).toBe(0);
    expect(resolveTemperature('0')).toBe(0);
  });

  it('falls back for missing or invalid values and clamps the 0-2 range', () => {
    expect(resolveTemperature(undefined)).toBe(0.7);
    expect(resolveTemperature('hot')).toBe(0.7);
    expect(resolveTemperature(1.2)).toBe(1.2);
    expect(resolveTemperature(9)).toBe(2);
    expect(resolveTemperature(-1)).toBe(0);
  });
});
