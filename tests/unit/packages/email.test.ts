import { describe, expect, it } from 'vitest';
import { isPlainEmail } from '../../../packages/types/src/email.js';

describe('isPlainEmail', () => {
    it('accepts plain, well-formed addresses', () => {
        expect(isPlainEmail('user@example.com')).toBe(true);
        expect(isPlainEmail('first.last+tag@sub.example.co')).toBe(true);
    });

    it('enforces the 254 character limit inclusively', () => {
        expect(isPlainEmail(`${'a'.repeat(242)}@example.com`)).toBe(true);
        expect(isPlainEmail(`${'a'.repeat(243)}@example.com`)).toBe(false);
    });

    it('rejects addresses without exactly one @ separating non-empty parts', () => {
        expect(isPlainEmail('')).toBe(false);
        expect(isPlainEmail('userexample.com')).toBe(false);
        expect(isPlainEmail('@example.com')).toBe(false);
        expect(isPlainEmail('user@')).toBe(false);
        expect(isPlainEmail('user@@example.com')).toBe(false);
    });

    it('rejects domains without an interior dot', () => {
        expect(isPlainEmail('user@example')).toBe(false);
        expect(isPlainEmail('user@example.')).toBe(false);
    });

    it('rejects whitespace inside the address', () => {
        expect(isPlainEmail('user name@example.com')).toBe(false);
        expect(isPlainEmail('user@exa\tmple.com')).toBe(false);
    });

    it('rejects control characters (CR/LF header-injection vectors)', () => {
        expect(isPlainEmail('user@example.com\n')).toBe(false);
        expect(isPlainEmail('user@example.com\r\n')).toBe(false);
        expect(isPlainEmail('user\n@example.com')).toBe(false);
        expect(isPlainEmail('user@example.com\x00')).toBe(false);
        expect(isPlainEmail('user@example.com\x7f')).toBe(false);
    });
});
