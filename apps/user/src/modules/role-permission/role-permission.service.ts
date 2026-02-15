import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { RolePermissionDao } from './role-permission.dao';
import { ApiBuilder, MESSAGES, PaginationQuery } from '@app/common';

@Injectable()
export class RolePermissionService {
    constructor(private readonly rolePermissionDao: RolePermissionDao) { }

    async assignPermissions(payload: { role_id: string; permission_ids: string[] }) {
        try {
            const { role_id, permission_ids } = payload;
            const existingEntries = await this.rolePermissionDao.findAllByRoleId(role_id);
            const existingPermissionIds = existingEntries.map((entry) => entry.permission_id);
            const toAddIds = permission_ids.filter((id) => !existingPermissionIds.includes(id));
            const toRemoveIds = existingPermissionIds.filter((id) => !permission_ids.includes(id));
            if (toRemoveIds.length > 0) {
                await this.rolePermissionDao.delete(role_id, toRemoveIds);
            }

            if (toAddIds.length > 0) {
                const payloadToAdd = toAddIds.map((permission_id) => ({
                    role_id,
                    permission_id,
                }));
                await this.rolePermissionDao.bulkCreate(payloadToAdd);
            }

            return ApiBuilder.success(null, MESSAGES.SUCCESS).build();
        } catch (error) {
            throw new InternalServerErrorException((error as Error).message);
        }
    }

    async list(query: PaginationQuery) {
        try {
            const { limit, page } = query;
            const parsedLimit = limit ? limit : 10;
            const parsedOffset = page ? (page - 1) * parsedLimit : 0;

            const { rows, count } = await this.rolePermissionDao.findAll(parsedLimit, parsedOffset);
            return ApiBuilder.success({ rows, count }, MESSAGES.SUCCESS).build();
        } catch (error) {
            throw new InternalServerErrorException((error as Error).message);
        }
    }
}
