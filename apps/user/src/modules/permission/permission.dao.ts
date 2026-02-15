import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Permission } from "../../models/permission.model";
import { IPermission } from "../../types";

@Injectable()
export class PermissionDao {
    constructor(
        @InjectModel(Permission)
        private readonly permissionModel: typeof Permission,
    ) { }

    async create(payload: Partial<IPermission>): Promise<Permission> {
        return this.permissionModel.create(payload);
    }

    async bulkCreate(payloads: Partial<IPermission>[]): Promise<Permission[]> {
        return this.permissionModel.bulkCreate(payloads);
    }

    async findAll(limit?: number, offset?: number): Promise<{ rows: Permission[]; count: number }> {
        return this.permissionModel.findAndCountAll({
            limit,
            offset,
            order: [['created_at', 'DESC']],
        });
    }

    async findById(id: string): Promise<Permission | null> {
        return this.permissionModel.findByPk(id);
    }

    async update(id: string, payload: Partial<IPermission>): Promise<Permission | null> {
        const [affectedCount, affectedRows] = await this.permissionModel.update(payload, {
            where: { id },
            returning: true,
        });
        return affectedCount > 0 ? affectedRows[0] : null;
    }

    async delete(id: string): Promise<boolean> {
        const deleted = await this.permissionModel.destroy({ where: { id } });
        return deleted > 0;
    }

    async typeDelete(id: string): Promise<boolean> {
        const deleted = await this.permissionModel.destroy({ where: { id }, force: true });
        return deleted > 0;
    }
}