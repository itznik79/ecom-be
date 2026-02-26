import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Role } from "../../models/role.model";
import { IRole } from "../../types";

@Injectable()
export class RoleDao {
    constructor(
        @InjectModel(Role)
        private readonly roleModel: typeof Role,
    ) { }

    async create(payload: Partial<IRole>): Promise<Role> {
        return this.roleModel.create(payload);
    }

    async findAll(limit?: number, offset?: number): Promise<{ rows: Role[]; count: number }> {
        return this.roleModel.findAndCountAll({
            limit,
            offset,
            order: [['created_at', 'DESC']],
        });
    }

    async findByName(name: string): Promise<Role | null> {
        return this.roleModel.findOne({ where: { name } });
    }

    async findById(id: string): Promise<Role | null> {
        return this.roleModel.findByPk(id);
    }

    async update(id: string, payload: Partial<IRole>): Promise<Role | null> {
        const [affectedCount, affectedRows] = await this.roleModel.update(payload, {
            where: { id },
            returning: true,
        });
        return affectedCount > 0 ? affectedRows[0] : null;
    }

    async delete(id: string): Promise<boolean> {
        const deleted = await this.roleModel.destroy({ where: { id } });
        return deleted > 0;
    }

    async typeDelete(id: string): Promise<boolean> {
        const deleted = await this.roleModel.destroy({ where: { id }, force: true });
        return deleted > 0;
    }
}
