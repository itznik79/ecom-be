import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Category } from './category.model';
import { ICategory } from '../../types';
import { CATEGORY_ATTRIBUTES, CategoryView } from './category.constants';

@Injectable()
export class CategoryDao {
    constructor(@InjectModel(Category) private readonly categoryModel: typeof Category) { }

    async create(category: Partial<ICategory>): Promise<ICategory> {
        return this.categoryModel.create(category);
    }

    async findAll(limit: number, offset: number): Promise<{ rows: ICategory[]; count: number }> {
        return this.categoryModel.findAndCountAll({
            limit,
            offset,
            order: [['created_at', 'DESC']], // Added default sorting
        });
    }

    async getById(id: string, view?: CategoryView): Promise<ICategory | null> {
        const attributes = view ? (CATEGORY_ATTRIBUTES[view] as unknown as string[]) : undefined;
        return this.categoryModel.findByPk(id, { attributes });
    }

    async getBySlug(slug: string): Promise<ICategory | null> {
        return this.categoryModel.findOne({ where: { slug } });
    }

    async delete(id: string): Promise<number> {
        return this.categoryModel.destroy({ where: { id } });
    }

    async countChildren(parentId: string): Promise<number> {
        return this.categoryModel.count({ where: { parent_id: parentId } });
    }

    async update(id: string, data: Partial<ICategory>): Promise<ICategory | null> {
        const [affectedCount, affectedRows] = await this.categoryModel.update(data, {
            where: { id },
            returning: true,
        });
        return affectedCount > 0 ? affectedRows[0] : null;
    }
}
