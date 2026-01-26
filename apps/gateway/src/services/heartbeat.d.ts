export declare class HeartbeatService {
    private intervalMs;
    private interval;
    private callbacks;
    constructor(intervalMs?: number);
    start(): void;
    stop(): void;
    onPulse(callback: () => Promise<void>): void;
    private pulse;
}
