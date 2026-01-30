
import { beforeAll, afterAll, beforeEach, afterEach, vi } from 'vitest';

// Global test setup
beforeAll(() => {
    // console.log('Starting test suite');
});

afterAll(() => {
    // console.log('Finished test suite');
});

beforeEach(() => {
    vi.clearAllMocks();
});

afterEach(() => {
    vi.restoreAllMocks();
});
