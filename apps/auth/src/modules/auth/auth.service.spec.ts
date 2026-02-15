import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthDao } from './auth.dao';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenService } from './refresh-token.service';
import { RedisService, MESSAGES } from '@app/common';
import { of, throwError } from 'rxjs';
import { UnauthorizedException, ConflictException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import * as crypto from 'crypto';

// Mock @app/common utilities
jest.mock('@app/common', () => {
    const original = jest.requireActual('@app/common');
    return {
        ...original,
        comparePassword: jest.fn(),
        hashPassword: jest.fn(),
        generateToken: jest.fn(),
        verifyToken: jest.fn(),
        setCookie: jest.fn(),
        clearCookie: jest.fn(),
    };
});

import { comparePassword, generateToken, verifyToken } from '@app/common';

describe('AuthService', () => {
    let service: AuthService;
    let authDao: jest.Mocked<AuthDao>;
    let httpService: jest.Mocked<HttpService>;
    let configService: jest.Mocked<ConfigService>;
    let refreshTokenService: jest.Mocked<RefreshTokenService>;
    let redisService: jest.Mocked<RedisService>;

    const mockUser = {
        user_id: 'user-123',
        email: 'test@example.com',
        password_hash: 'hashed-password',
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: AuthDao,
                    useValue: {
                        findByEmail: jest.fn(),
                        create: jest.fn(),
                        delete: jest.fn(),
                    },
                },
                {
                    provide: HttpService,
                    useValue: {
                        post: jest.fn(),
                    },
                },
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn().mockImplementation((key) => {
                            if (key === 'USER_SERVICE_URL') return 'http://user-service';
                            return undefined;
                        }),
                    },
                },
                {
                    provide: RefreshTokenService,
                    useValue: {
                        createRefreshToken: jest.fn(),
                        rotateToken: jest.fn(),
                        revokeAll: jest.fn(),
                        refreshTokenDao: {
                            findById: jest.fn(),
                        }
                    },
                },
                {
                    provide: RedisService,
                    useValue: {
                        set: jest.fn(),
                        get: jest.fn(),
                        del: jest.fn(),
                        getClient: jest.fn().mockReturnValue({
                            keys: jest.fn(),
                            del: jest.fn(),
                        }),
                    },
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        authDao = module.get(AuthDao);
        httpService = module.get(HttpService);
        configService = module.get(ConfigService);
        refreshTokenService = module.get(RefreshTokenService);
        redisService = module.get(RedisService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('register', () => {
        const registerPayload = { email: 'test@example.com', password: 'password123', profile: { name: 'Test' } };

        it('should register a user and return tokens', async () => {
            authDao.findByEmail.mockResolvedValue(null);
            authDao.create.mockResolvedValue(mockUser as any);
            httpService.post.mockReturnValue(of({ data: { success: true } }) as any);
            (generateToken as jest.Mock).mockReturnValue('mock-at');
            refreshTokenService.createRefreshToken.mockResolvedValue('rt-123.secret');
            redisService.set.mockResolvedValue('OK');

            const result = await service.register(registerPayload);

            expect(authDao.create).toHaveBeenCalled();
            expect(httpService.post).toHaveBeenCalled();
            expect(result.data.user).toBeDefined();
            expect(result.data.accessToken).toBe('mock-at');
        });

        it('should throw ConflictException if user exists', async () => {
            authDao.findByEmail.mockResolvedValue(mockUser as any);
            await expect(service.register(registerPayload)).rejects.toThrow(ConflictException);
        });

        it('should rollback and throw if User service fails', async () => {
            authDao.findByEmail.mockResolvedValue(null);
            authDao.create.mockResolvedValue(mockUser as any);
            httpService.post.mockReturnValue(throwError(() => ({ response: { data: { message: 'Profile Error' } } })));

            await expect(service.register(registerPayload)).rejects.toThrow(InternalServerErrorException);
            expect(authDao.delete).toHaveBeenCalledWith(mockUser.user_id);
        });
    });

    describe('login', () => {
        const loginPayload = { email: 'test@example.com', password: 'password123' };

        it('should login successfully and store AT in Redis', async () => {
            authDao.findByEmail.mockResolvedValue(mockUser as any);
            (comparePassword as jest.Mock).mockResolvedValue(true);
            (generateToken as jest.Mock).mockReturnValue('mock-at');
            refreshTokenService.createRefreshToken.mockResolvedValue('rt-123.secret');
            redisService.set.mockResolvedValue('OK');

            const res = { cookie: jest.fn() } as any;
            const result = await service.login(loginPayload, res);

            expect(redisService.set).toHaveBeenCalledWith(expect.stringContaining('at:user-123:'), 'active', 900);
            expect(result.data.accessToken).toBe('mock-at');
        });

        it('should throw Unauthorized on wrong password', async () => {
            authDao.findByEmail.mockResolvedValue(mockUser as any);
            (comparePassword as jest.Mock).mockResolvedValue(false);

            await expect(service.login(loginPayload, {} as any)).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('refresh', () => {
        it('should rotate tokens and update Redis', async () => {
            refreshTokenService.rotateToken.mockResolvedValue({ refreshToken: 'new-rt', userId: 'user-123' });
            (refreshTokenService as any).refreshTokenDao.findById.mockResolvedValue({ user_id: 'user-123' });
            (generateToken as jest.Mock).mockReturnValue('new-at');

            const res = { cookie: jest.fn() } as any;
            const result = await service.refresh('old-rt', res);

            expect(redisService.set).toHaveBeenCalled();
            expect(result.data.accessToken).toBe('new-at');
        });
    });

    describe('verifyAccessToken', () => {
        it('should return payload if token is active in Redis', async () => {
            const mockPayload = { id: 'user-123', jti: 'jti-abc' };
            (verifyToken as jest.Mock).mockReturnValue(mockPayload);
            redisService.get.mockResolvedValue('active');

            const result = await service.verifyAccessToken('valid-jwt');

            expect(result).toEqual(mockPayload);
            expect(redisService.get).toHaveBeenCalledWith('at:user-123:jti-abc');
        });

        it('should throw Unauthorized if token is NOT in Redis', async () => {
            const mockPayload = { id: 'user-123', jti: 'revoked-jti' };
            (verifyToken as jest.Mock).mockReturnValue(mockPayload);
            redisService.get.mockResolvedValue(null);

            await expect(service.verifyAccessToken('jwt')).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('logout', () => {
        it('should revoke RT and all ATs from Redis', async () => {
            const mockClient = redisService.getClient();
            (mockClient.keys as jest.Mock).mockResolvedValue(['at:user-123:jti1']);

            await service.logout('user-123', { clearCookie: jest.fn() } as any);

            expect(refreshTokenService.revokeAll).toHaveBeenCalledWith('user-123');
            expect(mockClient.del).toHaveBeenCalledWith('at:user-123:jti1');
        });
    });
});
