import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private client: Redis;

    constructor(private readonly configService: ConfigService) { }

    onModuleInit() {
        const host = this.configService.get('REDIS_HOST') || 'localhost';
        const port = this.configService.get('REDIS_PORT') || 6380;

        this.client = new Redis({
            host,
            port: Number(port),
        });

        this.client.on('error', (err) => {
            console.error('Redis connection error:', err);
        });

        this.client.on('connect', () => {
            console.log(`Successfully connected to Redis at ${host}:${port}`);
        });
    }

    onModuleDestroy() {
        this.client.disconnect();
    }

    async get(key: string): Promise<string | null> {
        return this.client.get(key);
    }

    async set(key: string, value: string, ttlSeconds?: number): Promise<'OK'> {
        if (ttlSeconds) {
            return this.client.set(key, value, 'EX', ttlSeconds);
        }
        return this.client.set(key, value);
    }

    async del(key: string): Promise<number> {
        return this.client.del(key);
    }

    async exists(key: string): Promise<number> {
        return this.client.exists(key);
    }

    // Advanced: Flush all keys (use with caution)
    async flushAll(): Promise<'OK'> {
        return this.client.flushall();
    }

    getClient(): Redis {
        return this.client;
    }
}
