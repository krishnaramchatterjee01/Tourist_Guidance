import verifier from './imageVerifier.js';

export class ImageScheduler {
  constructor() {
    this.intervalId = null;
    this.isRunning = false;
  }

  /**
   * Start background verification scheduler
   */
  start(intervalMs = 3600000) { // default 1 hour
    if (this.isRunning) return;
    this.isRunning = true;

    // Non-blocking startup check after 10 seconds
    setTimeout(async () => {
      try {
        console.log('[CIMS Scheduler] Running non-blocking startup image verification...');
        await verifier.verifyBatch(5);
      } catch (err) {
        console.warn('[CIMS Scheduler] Startup verification skipped:', err.message);
      }
    }, 10000);

    // Periodic check interval
    this.intervalId = setInterval(async () => {
      try {
        await verifier.verifyBatch(10);
      } catch (err) {
        console.warn('[CIMS Scheduler] Periodic verification error:', err.message);
      }
    }, intervalMs);

    console.log('[CIMS Scheduler] Background image verification scheduler initialized.');
  }

  /**
   * Stop background scheduler cleanly
   */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log('[CIMS Scheduler] Background image verification scheduler stopped.');
  }
}

export default new ImageScheduler();
