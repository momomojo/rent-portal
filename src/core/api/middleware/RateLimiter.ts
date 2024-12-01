interface RateLimitEntry {
  count: number;
  firstAttempt: number;
  lastAttempt: number;
}

export class RateLimiter {
  private static instance: RateLimiter;
  private attempts: Map<string, RateLimitEntry>;
  private readonly MAX_ATTEMPTS = 5;
  private readonly WINDOW_MS = 15 * 60 * 1000; // 15 minutes
  private readonly COOLDOWN_MS = 30 * 60 * 1000; // 30 minutes

  private constructor() {
    this.attempts = new Map();
  }

  public static getInstance(): RateLimiter {
    if (!RateLimiter.instance) {
      RateLimiter.instance = new RateLimiter();
    }
    return RateLimiter.instance;
  }

  public checkRateLimit(identifier: string): { allowed: boolean; waitTime: number } {
    const now = Date.now();
    const entry = this.attempts.get(identifier);

    if (!entry) {
      this.attempts.set(identifier, {
        count: 1,
        firstAttempt: now,
        lastAttempt: now,
      });
      return { allowed: true, waitTime: 0 };
    }

    // Clean up old entries
    if (now - entry.firstAttempt > this.WINDOW_MS) {
      this.attempts.set(identifier, {
        count: 1,
        firstAttempt: now,
        lastAttempt: now,
      });
      return { allowed: true, waitTime: 0 };
    }

    // Check if in cooldown period
    if (entry.count >= this.MAX_ATTEMPTS) {
      const cooldownRemaining = this.COOLDOWN_MS - (now - entry.lastAttempt);
      if (cooldownRemaining > 0) {
        return { allowed: false, waitTime: cooldownRemaining };
      }
      // Reset after cooldown
      this.attempts.set(identifier, {
        count: 1,
        firstAttempt: now,
        lastAttempt: now,
      });
      return { allowed: true, waitTime: 0 };
    }

    // Increment attempt count
    entry.count += 1;
    entry.lastAttempt = now;
    this.attempts.set(identifier, entry);

    return { allowed: true, waitTime: 0 };
  }

  public resetAttempts(identifier: string): void {
    this.attempts.delete(identifier);
  }
}
