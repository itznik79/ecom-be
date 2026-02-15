import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserDao } from './user.dao';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { ApiBuilder, MESSAGES } from '@app/common';

describe('UserService', () => {
    let service: UserService;
    let userDao: jest.Mocked<UserDao>;

    const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        credential_id: 'cred-123',
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: UserDao,
                    useValue: {
                        create: jest.fn(),
                        findAll: jest.fn(),
                        findById: jest.fn(),
                        findByCredentialId: jest.fn(),
                        update: jest.fn(),
                        delete: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<UserService>(UserService);
        userDao = module.get(UserDao);
    });

    describe('create', () => {
        it('should create a user successfully', async () => {
            userDao.create.mockResolvedValue(mockUser as any);
            const result = await service.create({ credential_id: 'cred-123' }, { name: 'Test' });
            expect(result.data).toEqual(mockUser);
            expect(result.message).toBe(MESSAGES.CREATED);
        });

        it('should throw ConflictException on unique constraint error', async () => {
            userDao.create.mockRejectedValue({ name: 'SequelizeUniqueConstraintError' });
            await expect(service.create({}, {})).rejects.toThrow(ConflictException);
        });
    });

    describe('findById', () => {
        it('should return a user if found', async () => {
            userDao.findById.mockResolvedValue(mockUser as any);
            const result = await service.findById('user-123');
            expect(result.data).toEqual(mockUser);
        });

        it('should throw NotFoundException if user not found', async () => {
            userDao.findById.mockResolvedValue(null);
            await expect(service.findById('unknown')).rejects.toThrow(NotFoundException);
        });
    });
});
