export class HeartbeatService {
    private interval: NodeJS.Timeout | null = null;
    private callbacks: Array<() => Promise<void>> = [];

    constructor(private intervalMs: number = 60000) { } // Default 1 minute for demo

    start() {
        console.log(`[Heartbeat] Service started. Beating every ${this.intervalMs}ms.`);
        this.interval = setInterval(async () => {
            await this.pulse();
        }, this.intervalMs);
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    onPulse(callback: () => Promise<void>) {
        this.callbacks.push(callback);
    }

    private async pulse() {
        // alert('Thump-thump');
        for (const cb of this.callbacks) {
            try {
                await cb();
            } catch (e) {
                console.error('[Heartbeat] Error in pulse callback:', e);
            }
        }
    }
}
