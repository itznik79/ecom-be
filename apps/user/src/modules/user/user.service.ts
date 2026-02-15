import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UserDao } from './user.dao';
import { ApiBuilder, MESSAGES, PaginationQuery, buildPagination, buildPaginationMeta } from '@app/common';

@Injectable()
export class UserService {
    constructor(private readonly userDao: UserDao) { }

    async create(userData: any, profileData: any) {
        try {
            const user = await this.userDao.create(userData, profileData);
            return ApiBuilder.success(user, MESSAGES.CREATED).build();
        } catch (error) {
            if ((error as any).name === 'SequelizeUniqueConstraintError') {
                throw new ConflictException(MESSAGES.EXISTS_ENTITY('User'));
            }
            throw new InternalServerErrorException((error as Error).message);
        }
    }

    async findAll(query: PaginationQuery) {
        try {
            const { limit, offset, page } = buildPagination(query);
            const { rows, count } = await this.userDao.findAll(limit, offset);
            return ApiBuilder.success({
                data: rows,
                meta: buildPaginationMeta(page, limit, count)
            }, MESSAGES.SUCCESS).build();
        } catch (error) {
            throw new InternalServerErrorException((error as Error).message);
        }
    }

    async findById(id: string) {
        try {
            const user = await this.userDao.findById(id);
            if (!user) throw new NotFoundException(MESSAGES.NOT_FOUND_ENTITY('User'));
            return ApiBuilder.success(user, MESSAGES.SUCCESS).build();
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            throw new InternalServerErrorException((error as Error).message);
        }
    }

    async findByCredentialId(credentialId: string) {
        try {
            const user = await this.userDao.findByCredentialId(credentialId);
            if (!user) throw new NotFoundException(MESSAGES.NOT_FOUND_ENTITY('User'));
            return ApiBuilder.success(user, MESSAGES.SUCCESS).build();
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            throw new InternalServerErrorException((error as Error).message);
        }
    }

    async update(id: string, userData: any, profileData?: any) {
        try {
            const updatedUser = await this.userDao.update(id, userData, profileData);
            if (!updatedUser) throw new NotFoundException(MESSAGES.NOT_FOUND_ENTITY('User'));
            return ApiBuilder.success(updatedUser, MESSAGES.UPDATED).build();
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            if ((error as any).name === 'SequelizeUniqueConstraintError') {
                throw new ConflictException(MESSAGES.EXISTS_ENTITY('User'));
            }
            throw new InternalServerErrorException((error as Error).message);
        }
    }

    async delete(id: string) {
        try {
            const deleted = await this.userDao.delete(id);
            if (!deleted) throw new NotFoundException(MESSAGES.NOT_FOUND_ENTITY('User'));
            return ApiBuilder.success(null, MESSAGES.DELETED).build();
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            throw new InternalServerErrorException((error as Error).message);
        }
    }

    async getUserPermissions(id: string) {
        try {
            const permissions = await this.userDao.getUserPermissions(id);
            return ApiBuilder.success(permissions, MESSAGES.SUCCESS).build();
        } catch (error) {
            throw new InternalServerErrorException((error as Error).message);
        }
    }
}
