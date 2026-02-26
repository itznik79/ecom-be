import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Brand } from "../../models";
import { IBrand } from "../../types";
import { Transaction } from 'sequelize';


@Injectable()
export class BrandDao {
    constructor(
        @InjectModel(Brand)
        private readonly brandModel: typeof Brand,
    ) { }

    private readonly logger = new Logger(BrandDao.name);

    // `create` intentionally removed: use `findOrCreateByName` for atomic create-or-find behaviour

    async findAll(limit?: number, offset?: number): Promise<{ rows: Brand[]; count: number }> {
        return this.brandModel.findAndCountAll({
            limit,
            offset,
            order: [['created_at', 'DESC']],
        });
    }

    async findById(id: string): Promise<Brand | null> {
        return this.brandModel.findByPk(id);
    }

    findByName(name: string): Promise<Brand | null> {
        return this.brandModel.findOne({ where: { name } });
    }

    async findOrCreateByName(payload: Partial<IBrand>, transaction?: Transaction): Promise<{ brand: Brand; created: boolean }> {
        const name = (payload.name || '').trim();
        this.logger.debug(`findOrCreateByName name=${name}`);
        const [brand, created] = await this.brandModel.findOrCreate({
            where: { name },
            defaults: payload,
            transaction,
        });
        return { brand, created };
    }

    async update(id: string, payload: Partial<IBrand>): Promise<Brand | null> {
        const [affectedCount, affectedRows] = await this.brandModel.update(payload, {
            where: { id },
            returning: true,
        });
        return affectedCount > 0 ? affectedRows[0] : null;
    }

    async delete(id: string): Promise<boolean> {
        const deleted = await this.brandModel.destroy({ where: { id } });
        return deleted > 0;
    }

    async typeDelete(id: string): Promise<boolean> {
        const deleted = await this.brandModel.destroy({ where: { id }, force: true });
        return deleted > 0;
    }

    async transaction<T>(fn: (t: Transaction) => Promise<T>): Promise<T> {
        const sequelize = (this.brandModel as any).sequelize;
        if (!sequelize) throw new Error('Sequelize instance not available on model');
        return sequelize.transaction(fn);
    }
}