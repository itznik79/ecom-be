import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { RolePermission } from "../../models/role-permission.model";
import { IRolePermission } from "../../types";

@Injectable()
export class RolePermissionDao {
    constructor(
        @InjectModel(RolePermission)
        private readonly rolePermissionModel: typeof RolePermission,
    ) { }

    async bulkCreate(payloads: Partial<IRolePermission>[]): Promise<RolePermission[]> {
        return this.rolePermissionModel.bulkCreate(payloads);
    }

    async findAllByRoleId(role_id: string): Promise<RolePermission[]> {
        return this.rolePermissionModel.findAll({
            where: { role_id },
        });
    }

    async findAll(limit?: number, offset?: number): Promise<{ rows: RolePermission[]; count: number }> {
        return this.rolePermissionModel.findAndCountAll({
            limit,
            offset,
            order: [['role_id', 'ASC']],
        });
    }

    async delete(role_id: string, permission_ids: string[]): Promise<number> {
        return this.rolePermissionModel.destroy({
            where: {
                role_id,
                permission_id: permission_ids,
            },
        });
    }
}
