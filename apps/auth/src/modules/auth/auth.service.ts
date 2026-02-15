import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AuthDao } from './auth.dao';
import { comparePassword, hashPassword, MESSAGES, ApiBuilder, generateToken, RedisService } from '@app/common';
import { AuthProvider } from '../../types/auth-provider.enum';
import { Response } from 'express';
import { RefreshTokenService } from './refresh-token.service';
import { setCookie, clearCookie } from '@app/common';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
    constructor(
        private readonly authDao: AuthDao,
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
        private readonly refreshTokenService: RefreshTokenService,
        private readonly redisService: RedisService,
    ) { }

    private async createAccessToken(userId: string): Promise<string> {
        const jti = crypto.randomUUID();
        const accessToken = generateToken({ id: userId, jti });
        const ttl = 15 * 60; // 15 minutes
        await this.redisService.set(`at:${userId}:${jti}`, 'active', ttl);
        return accessToken;
    }

    private async cachePermissions(userId: string): Promise<void> {
        try {
            const userServiceUrl = this.configService.get('USER_SERVICE_URL');
            const response = await firstValueFrom(
                this.httpService.get(`${userServiceUrl}/${userId}/permissions`)
            );
            const permissions = response.data.data;
            if (permissions && permissions.length > 0) {
                // Store in Redis with a reasonably long TTL (e.g., 1 hour or same as session)
                await this.redisService.set(`perms:${userId}`, JSON.stringify(permissions), 3600);
            }
        } catch (error) {
            console.error('Failed to cache permissions:', error);
            // We don't necessarily want to fail login if caching fails, 
            // but the guard will fail later if not found.
        }
    }

    async register(payload: any, res?: Response) {
        let newUser: any;
        try {
            const { email, password, profile, ...rest } = payload;
            const existingUser = await this.authDao.findByEmail(email);
            if (existingUser) throw new ConflictException(MESSAGES.EXISTS_ENTITY('User'));
            const password_hash = password ? await hashPassword(password) : undefined;
            newUser = await this.authDao.create({
                email,
                password_hash,
                provider: payload.provider || 'local',
                ...rest,
            } as any);
            const userServiceUrl = this.configService.get('USER_SERVICE_URL');
            try {
                await firstValueFrom(
                    this.httpService.post(userServiceUrl, {
                        credential_id: newUser.user_id,
                        email: newUser.email,
                        profile: profile || {}
                    })
                );
            } catch (userError: any) {
                await this.authDao.delete(newUser.user_id);
                throw new InternalServerErrorException(
                    `Failed to create user profile: ${userError.response?.data?.message || userError.message}`
                );
            }

            // Generate tokens if registration is successful
            const accessToken = await this.createAccessToken(newUser.user_id);
            const refreshToken = await this.refreshTokenService.createRefreshToken(newUser.user_id);
            await this.cachePermissions(newUser.user_id);

            if (res) {
                setCookie(res, 'refreshToken', refreshToken);
            }

            return ApiBuilder.success({ user: newUser, accessToken }, MESSAGES.CREATED).build();
        } catch (error) {
            if (error instanceof ConflictException || error instanceof InternalServerErrorException) {
                throw error;
            }
            throw new InternalServerErrorException((error as Error).message);
        }
    }

    async login(payload: any, res: Response) {
        try {
            const { email, password } = payload;
            const user = await this.authDao.findByEmail(email);
            if (!user) throw new NotFoundException(MESSAGES.NOT_FOUND_ENTITY('User'));
            const isPasswordMatch = await comparePassword(password, user.password_hash);
            if (!isPasswordMatch) throw new UnauthorizedException(MESSAGES.UNAUTHORIZED);
            const accessToken = await this.createAccessToken(user.user_id);
            const refreshToken = await this.refreshTokenService.createRefreshToken(user.user_id);
            await this.cachePermissions(user.user_id);
            setCookie(res, 'refreshToken', refreshToken);
            return ApiBuilder.success({ user, accessToken }, MESSAGES.SUCCESS).build();
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof UnauthorizedException) {
                throw error;
            }
            throw new InternalServerErrorException((error as Error).message);
        }
    }

    async refresh(oldToken: string, res: Response) {
        try {
            const { refreshToken, userId } = await this.refreshTokenService.rotateToken(oldToken);
            const accessToken = await this.createAccessToken(userId);
            await this.cachePermissions(userId);

            setCookie(res, 'refreshToken', refreshToken);
            return ApiBuilder.success({ accessToken }, MESSAGES.SUCCESS).build();
        } catch (error) {
            if (error instanceof UnauthorizedException) throw error;
            throw new InternalServerErrorException((error as Error).message);
        }
    }

    async logout(userId: string, res: Response, accessToken?: string) {
        try {
            await this.refreshTokenService.revokeAll(userId);

            if (accessToken) {
                const { verifyToken } = await import('@app/common');
                try {
                    const payload = verifyToken(accessToken);
                    if (payload.jti) {
                        await this.redisService.del(`at:${userId}:${payload.jti}`);
                    }
                } catch (e) { /* expired */ }
            } else {
                const client = this.redisService.getClient();
                const keys = await client.keys(`at:${userId}:*`);
                if (keys.length > 0) await client.del(...keys);
            }

            clearCookie(res, 'refreshToken');
            return ApiBuilder.success(null, MESSAGES.SUCCESS).build();
        } catch (error) {
            throw new InternalServerErrorException((error as Error).message);
        }
    }

    async verifyAccessToken(token: string) {
        try {
            const { verifyToken } = await import('@app/common');
            const payload = verifyToken(token);
            const isActive = await this.redisService.get(`at:${payload.id}:${payload.jti}`);
            if (!isActive) throw new UnauthorizedException(MESSAGES.UNAUTHORIZED);
            return payload;
        } catch (error) {
            throw new UnauthorizedException(MESSAGES.UNAUTHORIZED);
        }
    }

    async googleLogin(googleProfile: any, res: Response) {
        try {
            const { email, firstName, lastName, providerId } = googleProfile;
            let user = await this.authDao.findByEmail(email);

            if (!user) {
                // Register new social user
                const registerPayload = {
                    email,
                    provider: AuthProvider.GOOGLE,
                    provider_id: providerId,
                    profile: { name: `${firstName} ${lastName}` }
                };
                return this.register(registerPayload, res);
            }

            // Sync provider info if it was local only
            if (user.provider === AuthProvider.LOCAL) {
                await this.authDao.updateByUserId(user.user_id, {
                    provider: AuthProvider.GOOGLE,
                    provider_id: providerId
                });
                user = await this.authDao.findByUserId(user.user_id);
            }

            const accessToken = await this.createAccessToken(user.user_id);
            const refreshToken = await this.refreshTokenService.createRefreshToken(user.user_id);
            await this.cachePermissions(user.user_id);

            setCookie(res, 'refreshToken', refreshToken);
            return ApiBuilder.success({ user, accessToken }, MESSAGES.SUCCESS).build();
        } catch (error) {
            throw new InternalServerErrorException((error as Error).message);
        }
    }
}
