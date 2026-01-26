export class HeartbeatService {
    intervalMs;
    interval = null;
    callbacks = [];
    constructor(intervalMs = 60000) {
        this.intervalMs = intervalMs;
    } // Default 1 minute for demo
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
    onPulse(callback) {
        this.callbacks.push(callback);
    }
    async pulse() {
        // alert('Thump-thump');
        for (const cb of this.callbacks) {
            try {
                await cb();
            }
            catch (e) {
                console.error('[Heartbeat] Error in pulse callback:', e);
            }
        }
    }
}
