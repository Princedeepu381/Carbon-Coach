// tests/unit/rateLimit.test.ts
import { rateLimit, getRateLimitStatus, resetRateLimit } from "../../src/lib/rateLimit";

describe("In-Memory Rate Limiter", () => {
  const ip = "192.168.1.1";

  beforeEach(() => {
    resetRateLimit(ip);
  });

  test("allows requests within limit", () => {
    const res1 = rateLimit(ip, 3, 1000);
    expect(res1.success).toBe(true);
    expect(res1.remaining).toBe(2);

    const res2 = rateLimit(ip, 3, 1000);
    expect(res2.success).toBe(true);
    expect(res2.remaining).toBe(1);
  });

  test("blocks requests exceeding limit", () => {
    rateLimit(ip, 2, 1000);
    rateLimit(ip, 2, 1000);
    const blockedRes = rateLimit(ip, 2, 1000);
    expect(blockedRes.success).toBe(false);
    expect(blockedRes.remaining).toBe(0);
  });

  test("returns correct status without incrementing", () => {
    rateLimit(ip, 3, 1000);
    const status = getRateLimitStatus(ip, 3);
    expect(status.success).toBe(true);
    expect(status.remaining).toBe(2);
  });

  test("resets limit correctly", () => {
    rateLimit(ip, 2, 1000);
    rateLimit(ip, 2, 1000);
    resetRateLimit(ip);
    const freshRes = rateLimit(ip, 2, 1000);
    expect(freshRes.success).toBe(true);
    expect(freshRes.remaining).toBe(1);
  });
});
