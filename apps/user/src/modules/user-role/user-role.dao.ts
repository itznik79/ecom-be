import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserRole, Role } from '../../models';
import { IUserRole } from '../../types';

@Injectable()
export class UserRoleDao {
    constructor(
        @InjectModel(UserRole) private readonly userRoleModel: typeof UserRole,
        @InjectModel(Role) private readonly roleModel: typeof Role,
    ) { }

    async assignRole(user_id: string, role_id: string): Promise<UserRole> {
        return this.userRoleModel.create({ user_id, role_id } as any);
    }

    async removeRole(user_id: string, role_id: string): Promise<boolean> {
        const deleted = await this.userRoleModel.destroy({
            where: { user_id, role_id }
        });
        return deleted > 0;
    }

    async findByUserId(user_id: string, limit?: number, offset?: number): Promise<{ rows: UserRole[]; count: number }> {
        return this.userRoleModel.findAndCountAll({
            where: { user_id },
            limit,
            offset,
            include: [{ model: this.roleModel, as: 'role' }]
        });
    }
}
