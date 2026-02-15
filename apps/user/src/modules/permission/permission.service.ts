import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PermissionDao } from './permission.dao';
import { ApiBuilder, MESSAGES, PaginationQuery } from '@app/common';
import { IPermission } from '../../types';

@Injectable()
export class PermissionService {
    constructor(private readonly permissionDao: PermissionDao) { }

    async create(payload: Partial<IPermission>) {
        try {
            const permission = await this.permissionDao.create(payload);
            return ApiBuilder.success(permission, MESSAGES.CREATED).build();
        } catch (error) {
            if ((error as any).name === 'SequelizeUniqueConstraintError') {
                throw new ConflictException(MESSAGES.EXISTS_ENTITY('Permission'));
            }
            throw new InternalServerErrorException((error as Error).message);
        }
    }

    async list(query: any) {
        try {
            const { limit, offset } = query;
            const parsedLimit = limit ? parseInt(limit) : 10;
            const parsedOffset = offset ? parseInt(offset) : 0;
            const { rows, count } = await this.permissionDao.findAll(parsedLimit, parsedOffset);
            return ApiBuilder.success({ rows, count }, MESSAGES.SUCCESS).build();
        } catch (error) {
            throw new InternalServerErrorException((error as Error).message);
        }
    }

    async findById(id: string) {
        try {
            const permission = await this.permissionDao.findById(id);
            if (!permission) throw new NotFoundException(MESSAGES.NOT_FOUND_ENTITY('Permission'));
            return ApiBuilder.success(permission, MESSAGES.SUCCESS).build();
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            throw new InternalServerErrorException((error as Error).message);
        }
    }

    async update(id: string, payload: Partial<IPermission>) {
        try {
            const updatedPermission = await this.permissionDao.update(id, payload);
            if (!updatedPermission) throw new NotFoundException(MESSAGES.NOT_FOUND_ENTITY('Permission'));
            return ApiBuilder.success(updatedPermission, MESSAGES.UPDATED).build();
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            if ((error as any).name === 'SequelizeUniqueConstraintError') {
                throw new ConflictException(MESSAGES.EXISTS_ENTITY('Permission'));
            }
            throw new InternalServerErrorException((error as Error).message);
        }
    }

    async delete(id: string) {
        try {
            const deleted = await this.permissionDao.delete(id);
            if (!deleted) throw new NotFoundException(MESSAGES.NOT_FOUND_ENTITY('Permission'));
            return ApiBuilder.success(null, MESSAGES.DELETED).build();
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            throw new InternalServerErrorException((error as Error).message);
        }
    }
}