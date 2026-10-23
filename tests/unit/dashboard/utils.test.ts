import { describe, expect, it } from 'vitest';
import { cn } from '../../../apps/dashboard/src/lib/utils.js';

describe('cn', () => {
    it('merges tailwind classes and drops falsy values', () => {
        expect(cn('px-2', 'px-4', false && 'hidden', undefined, 'text-sm')).toBe('px-4 text-sm');
    });
});
