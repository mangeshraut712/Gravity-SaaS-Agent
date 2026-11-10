/** Keep a valid 0 temperature; only missing or non-numeric values use the default. */
export function resolveTemperature(value: unknown, fallback = 0.7): number {
    const n = typeof value === 'number' ? value : Number(value);
    if (!Number.isFinite(n)) return fallback;
    return Math.min(2, Math.max(0, n));
}
