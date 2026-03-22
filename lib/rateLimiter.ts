import { Redis } from "@upstash/redis";

const redis = new Redis({
  url:   process.env.REDIS_URL!,
  token: process.env.REDIS_TOKEN!,
});

interface Options {
  maxRequests:   number;
  windowSeconds: number;
}

export async function checkRateLimit(key: string, opts: Options): Promise<boolean> {
  const count = await redis.incr(key);
  if (count === 1) await redis.expire(key, opts.windowSeconds);
  return count > opts.maxRequests;
}