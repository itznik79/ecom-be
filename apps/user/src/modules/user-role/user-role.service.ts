import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UserRoleDao } from './user-role.dao';
import { ApiBuilder, MESSAGES, PaginationQuery, buildPagination, buildPaginationMeta } from '@app/common';

@Injectable()
export class UserRoleService {
    constructor(private readonly userRoleDao: UserRoleDao) { }

    async assignRole(userId: string, roleId: string) {
        try {
            const assignment = await this.userRoleDao.assignRole(userId, roleId);
            return ApiBuilder.success(assignment, MESSAGES.CREATED).build();
        } catch (error) {
            if ((error as any).name === 'SequelizeUniqueConstraintError') {
                throw new ConflictException(MESSAGES.EXISTS_ENTITY('User-Role assignment'));
            }
            throw new InternalServerErrorException((error as Error).message);
        }
    }

    async removeRole(userId: string, roleId: string) {
        try {
            const deleted = await this.userRoleDao.removeRole(userId, roleId);
            if (!deleted) throw new NotFoundException(MESSAGES.NOT_FOUND_ENTITY('User-Role assignment'));
            return ApiBuilder.success(null, MESSAGES.DELETED).build();
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            throw new InternalServerErrorException((error as Error).message);
        }
    }

    async findByUserId(userId: string, query?: PaginationQuery) {
        try {
            const { limit, offset, page } = buildPagination(query || {});
            const { rows, count } = await this.userRoleDao.findByUserId(userId, limit, offset);
            return ApiBuilder.success({
                data: rows,
                meta: buildPaginationMeta(page, limit, count)
            }, MESSAGES.SUCCESS).build();
        } catch (error) {
            throw new InternalServerErrorException((error as Error).message);
        }
    }
}
