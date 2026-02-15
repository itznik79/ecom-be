import { Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { RefreshTokenDao } from './refresh-token.dao';
import { hashPassword, comparePassword, generateToken, MESSAGES } from '@app/common';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RefreshTokenService {
    constructor(
        private readonly refreshTokenDao: RefreshTokenDao,
        private readonly configService: ConfigService,
    ) { }

    /**
     * Generates a new random opaque refresh token and stores its bcrypt hash in DB
     * Returns a composite token: "id.secret"
     */
    async createRefreshToken(userId: string): Promise<string> {
        try {
            const secret = crypto.randomBytes(40).toString('hex');
            const tokenHash = await hashPassword(secret);
            const expiresDays = parseInt(this.configService.get('REFRESH_TOKEN_EXPIRES_IN_DAYS') || '7');
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + expiresDays);
            const record = await this.refreshTokenDao.create({
                user_id: userId,
                token_hash: tokenHash,
                expires_at: expiresAt,
            });
            // Return composite token
            return `${record.id}.${secret}`;
        } catch (error) {
            throw new InternalServerErrorException((error as Error).message);
        }
    }

    /**
     * Rotates an existing refresh token:
     * 1. Decodes composite token "id.secret"
     * 2. Retrieves record by ID (fast)
     * 3. Verifies secret using bcrypt (secure)
     * 4. Revokes old and issues new pair.
     */
    async rotateToken(compositeToken: string): Promise<{ refreshToken: string; userId: string }> {
        const [id, secret] = compositeToken.split('.');
        if (!id || !secret) throw new UnauthorizedException(MESSAGES.UNAUTHORIZED);
        const activeToken = await this.refreshTokenDao.findById(id);
        if (!activeToken) throw new UnauthorizedException(MESSAGES.UNAUTHORIZED);
        const isMatch = await comparePassword(secret, activeToken.token_hash);
        if (!isMatch) {
            await this.refreshTokenDao.revokeAllByUserId(activeToken.user_id);
            throw new UnauthorizedException(MESSAGES.UNAUTHORIZED);
        }
        const userId = activeToken.user_id;
        await this.refreshTokenDao.revokeToken(activeToken.id);
        const refreshToken = await this.createRefreshToken(userId);
        return { refreshToken, userId };
    }

    async revokeAll(userId: string): Promise<void> {
        await this.refreshTokenDao.revokeAllByUserId(userId);
    }
}