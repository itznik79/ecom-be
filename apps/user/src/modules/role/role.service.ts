import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { RoleDao } from './role.dao';
import { ApiBuilder, MESSAGES } from '@app/common';
import { IRole } from '../../types';

@Injectable()
export class RoleService {
    constructor(private readonly roleDao: RoleDao) { }

    async create(payload: Partial<IRole>) {
        try {
            const existingRole = await this.roleDao.findByName(payload.name);
            if (existingRole) throw new ConflictException(MESSAGES.EXISTS_ENTITY('Role'));
            const role = await this.roleDao.create(payload);
            return ApiBuilder.success(role, MESSAGES.CREATED).build();
        } catch (error) {
            if ((error as any).name === 'SequelizeUniqueConstraintError') {
                throw new ConflictException(MESSAGES.EXISTS_ENTITY('Role'));
            }
            throw new InternalServerErrorException((error as Error).message);
        }
    }

    async list(query: any) {
        try {
            const { limit, offset } = query;
            const parsedLimit = limit ? parseInt(limit) : 10;
            const parsedOffset = offset ? parseInt(offset) : 0;

            const { rows, count } = await this.roleDao.findAll(parsedLimit, parsedOffset);
            return ApiBuilder.success({ rows, count }, MESSAGES.SUCCESS).build();
        } catch (error) {
            throw new InternalServerErrorException((error as Error).message);
        }
    }

    async findById(id: string) {
        try {
            const role = await this.roleDao.findById(id);
            if (!role) throw new NotFoundException(MESSAGES.NOT_FOUND_ENTITY('Role'));
            return ApiBuilder.success(role, MESSAGES.SUCCESS).build();
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            throw new InternalServerErrorException((error as Error).message);
        }
    }

    async update(id: string, payload: Partial<IRole>) {
        try {
            const updatedRole = await this.roleDao.update(id, payload);
            if (!updatedRole) throw new NotFoundException(MESSAGES.NOT_FOUND_ENTITY('Role'));
            return ApiBuilder.success(updatedRole, MESSAGES.UPDATED).build();
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            if ((error as any).name === 'SequelizeUniqueConstraintError') {
                throw new ConflictException(MESSAGES.EXISTS_ENTITY('Role'));
            }
            throw new InternalServerErrorException((error as Error).message);
        }
    }

    async delete(id: string) {
        try {
            const deleted = await this.roleDao.delete(id);
            if (!deleted) throw new NotFoundException(MESSAGES.NOT_FOUND_ENTITY('Role'));
            return ApiBuilder.success(null, MESSAGES.DELETED).build();
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            throw new InternalServerErrorException((error as Error).message);
        }
    }
}
