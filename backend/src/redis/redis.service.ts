import { Injectable, Inject, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from './redis.module';

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);

  constructor(
    @Inject(REDIS_CLIENT) private readonly client: Redis,
  ) {}

  /**
   * Get the raw ioredis client (for adapter usage, pipelines, etc.)
   */
  getClient(): Redis {
    return this.client;
  }

  /**
   * Get a string value by key. Returns null if not found.
   */
  async get(key: string): Promise<string | null> {
    try {
      return await this.client.get(key);
    } catch (err) {
      this.logger.error(`GET ${key} failed: ${(err as Error).message}`);
      throw err;
    }
  }

  /**
   * Get a value and deserialize it from JSON. Returns null if not found.
   */
  async getJson<T>(key: string): Promise<T | null> {
    const raw = await this.get(key);
    if (raw === null) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      this.logger.warn(`Failed to parse JSON for key ${key}`);
      return null;
    }
  }

  /**
   * Set a key to a string value. No expiry.
   */
  async set(key: string, value: string): Promise<void> {
    try {
      await this.client.set(key, value);
    } catch (err) {
      this.logger.error(`SET ${key} failed: ${(err as Error).message}`);
      throw err;
    }
  }

  /**
   * Set a key to a JSON-serialized value. No expiry.
   */
  async setJson<T>(key: string, value: T): Promise<void> {
    await this.set(key, JSON.stringify(value));
  }

  /**
   * Set a key with a TTL in seconds (SETEX).
   */
  async setex(key: string, seconds: number, value: string): Promise<void> {
    try {
      await this.client.setex(key, seconds, value);
    } catch (err) {
      this.logger.error(`SETEX ${key} failed: ${(err as Error).message}`);
      throw err;
    }
  }

  /**
   * Set a key with a TTL in seconds and a JSON-serialized value.
   */
  async setexJson<T>(key: string, seconds: number, value: T): Promise<void> {
    await this.setex(key, seconds, JSON.stringify(value));
  }

  /**
   * Delete one or more keys.
   */
  async del(...keys: string[]): Promise<number> {
    try {
      return await this.client.del(...keys);
    } catch (err) {
      this.logger.error(`DEL ${keys.join(', ')} failed: ${(err as Error).message}`);
      throw err;
    }
  }

  /**
   * Check if one or more keys exist.
   * Returns the count of existing keys.
   */
  async exists(...keys: string[]): Promise<number> {
    try {
      return await this.client.exists(...keys);
    } catch (err) {
      this.logger.error(`EXISTS ${keys.join(', ')} failed: ${(err as Error).message}`);
      throw err;
    }
  }

  /**
   * Increment a key by 1 and return the new value.
   */
  async incr(key: string): Promise<number> {
    try {
      return await this.client.incr(key);
    } catch (err) {
      this.logger.error(`INCR ${key} failed: ${(err as Error).message}`);
      throw err;
    }
  }

  /**
   * Increment a key by a given amount and return the new value.
   */
  async incrby(key: string, increment: number): Promise<number> {
    try {
      return await this.client.incrby(key, increment);
    } catch (err) {
      this.logger.error(`INCRBY ${key} ${increment} failed: ${(err as Error).message}`);
      throw err;
    }
  }

  /**
   * Set or update the TTL (in seconds) on a key.
   * Returns 1 if timeout was set, 0 if key does not exist.
   */
  async expire(key: string, seconds: number): Promise<number> {
    try {
      return await this.client.expire(key, seconds);
    } catch (err) {
      this.logger.error(`EXPIRE ${key} failed: ${(err as Error).message}`);
      throw err;
    }
  }

  /**
   * Get the remaining TTL in seconds for a key.
   * Returns -2 if key does not exist, -1 if no expiry.
   */
  async ttl(key: string): Promise<number> {
    try {
      return await this.client.ttl(key);
    } catch (err) {
      this.logger.error(`TTL ${key} failed: ${(err as Error).message}`);
      throw err;
    }
  }

  /**
   * Find all keys matching a pattern.
   * WARNING: Use with caution in production — prefer SCAN for large datasets.
   */
  async keys(pattern: string): Promise<string[]> {
    try {
      return await this.client.keys(pattern);
    } catch (err) {
      this.logger.error(`KEYS ${pattern} failed: ${(err as Error).message}`);
      throw err;
    }
  }

  /**
   * Scan keys matching a pattern using the SCAN cursor (safe for production).
   */
  async scan(pattern: string, count = 100): Promise<string[]> {
    const results: string[] = [];
    let cursor = '0';

    try {
      do {
        const [nextCursor, keys] = await this.client.scan(
          cursor,
          'MATCH',
          pattern,
          'COUNT',
          count,
        );
        cursor = nextCursor;
        results.push(...keys);
      } while (cursor !== '0');

      return results;
    } catch (err) {
      this.logger.error(`SCAN ${pattern} failed: ${(err as Error).message}`);
      throw err;
    }
  }

  /**
   * Set a hash field value.
   */
  async hset(key: string, field: string, value: string): Promise<number> {
    try {
      return await this.client.hset(key, field, value);
    } catch (err) {
      this.logger.error(`HSET ${key} ${field} failed: ${(err as Error).message}`);
      throw err;
    }
  }

  /**
   * Get a hash field value.
   */
  async hget(key: string, field: string): Promise<string | null> {
    try {
      return await this.client.hget(key, field);
    } catch (err) {
      this.logger.error(`HGET ${key} ${field} failed: ${(err as Error).message}`);
      throw err;
    }
  }

  /**
   * Get all fields and values of a hash.
   */
  async hgetall(key: string): Promise<Record<string, string>> {
    try {
      return await this.client.hgetall(key);
    } catch (err) {
      this.logger.error(`HGETALL ${key} failed: ${(err as Error).message}`);
      throw err;
    }
  }

  /**
   * Delete one or more hash fields.
   */
  async hdel(key: string, ...fields: string[]): Promise<number> {
    try {
      return await this.client.hdel(key, ...fields);
    } catch (err) {
      this.logger.error(`HDEL ${key} failed: ${(err as Error).message}`);
      throw err;
    }
  }

  /**
   * Add a member to a sorted set with a score.
   */
  async zadd(key: string, score: number, member: string): Promise<number> {
    try {
      return (await this.client.zadd(key, score, member)) as number;
    } catch (err) {
      this.logger.error(`ZADD ${key} failed: ${(err as Error).message}`);
      throw err;
    }
  }

  /**
   * Get members of a sorted set within a score range.
   */
  async zrangebyscore(
    key: string,
    min: number | string,
    max: number | string,
  ): Promise<string[]> {
    try {
      return await this.client.zrangebyscore(key, min, max);
    } catch (err) {
      this.logger.error(`ZRANGEBYSCORE ${key} failed: ${(err as Error).message}`);
      throw err;
    }
  }

  /**
   * Remove members from a sorted set.
   */
  async zrem(key: string, ...members: string[]): Promise<number> {
    try {
      return await this.client.zrem(key, ...members);
    } catch (err) {
      this.logger.error(`ZREM ${key} failed: ${(err as Error).message}`);
      throw err;
    }
  }

  /**
   * Add a member to a set.
   */
  async sadd(key: string, ...members: string[]): Promise<number> {
    try {
      return await this.client.sadd(key, ...members);
    } catch (err) {
      this.logger.error(`SADD ${key} failed: ${(err as Error).message}`);
      throw err;
    }
  }

  /**
   * Check if a member is in a set.
   */
  async sismember(key: string, member: string): Promise<boolean> {
    try {
      const result = await this.client.sismember(key, member);
      return result === 1;
    } catch (err) {
      this.logger.error(`SISMEMBER ${key} ${member} failed: ${(err as Error).message}`);
      throw err;
    }
  }

  /**
   * Remove a member from a set.
   */
  async srem(key: string, ...members: string[]): Promise<number> {
    try {
      return await this.client.srem(key, ...members);
    } catch (err) {
      this.logger.error(`SREM ${key} failed: ${(err as Error).message}`);
      throw err;
    }
  }

  /**
   * Publish a message to a Redis channel.
   */
  async publish(channel: string, message: string): Promise<number> {
    try {
      return await this.client.publish(channel, message);
    } catch (err) {
      this.logger.error(`PUBLISH ${channel} failed: ${(err as Error).message}`);
      throw err;
    }
  }

  /**
   * Health-check ping.
   */
  async ping(): Promise<string> {
    return this.client.ping();
  }
}
