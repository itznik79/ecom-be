import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { CategoryDao } from './category.dao';
import { ICategory } from '../../types';
import { PaginationQuery, PaginatedResponse, buildPagination, buildPaginationMeta, MESSAGES } from '@app/common';
import { CATEGORY_MESSAGES, CategoryView } from './category.constants';

@Injectable()
export class CategoryService {
    constructor(private readonly categoryDao: CategoryDao) { }

    async create(category: Partial<ICategory>): Promise<ICategory> {
        if (category.parent_id) {
            const parent = await this.categoryDao.getById(category.parent_id);
            if (!parent) throw new BadRequestException(CATEGORY_MESSAGES.PARENT_NOT_FOUND);
        }
        const existing = await this.categoryDao.getBySlug(category.slug);
        if (existing) throw new ConflictException(MESSAGES.EXISTS_ENTITY('Category'));
        return this.categoryDao.create(category);
    }

    async list(query: PaginationQuery): Promise<PaginatedResponse<ICategory>> {
        const { page, limit, offset } = buildPagination(query);
        const { rows, count } = await this.categoryDao.findAll(limit, offset);
        return {
            data: rows,
            meta: buildPaginationMeta(page, limit, count)
        };
    }

    async getById(id: string, view?: CategoryView): Promise<ICategory> {
        const category = await this.categoryDao.getById(id, view);
        if (!category) {
            throw new NotFoundException(MESSAGES.NOT_FOUND_ENTITY('Category'));
        }
        return category;
    }

    async update(id: string, data: Partial<ICategory>): Promise<ICategory> {
        const existing = await this.categoryDao.getById(id);
        if (!existing) throw new NotFoundException(MESSAGES.NOT_FOUND_ENTITY('Category'));

        if (data.parent_id) {
            if (data.parent_id === id) throw new BadRequestException(CATEGORY_MESSAGES.CANNOT_BE_OWN_PARENT);
            const parent = await this.categoryDao.getById(data.parent_id);
            if (!parent) throw new BadRequestException(CATEGORY_MESSAGES.PARENT_NOT_FOUND);
        }

        if (data.slug && data.slug !== existing.slug) {
            const conflicting = await this.categoryDao.getBySlug(data.slug);
            if (conflicting) throw new ConflictException(MESSAGES.EXISTS_ENTITY('Category'));
        }

        const updated = await this.categoryDao.update(id, data);
        if (!updated) throw new NotFoundException(MESSAGES.NOT_FOUND_ENTITY('Category'));
        return updated;
    }

    async delete(id: string): Promise<void> {
        const childrenCount = await this.categoryDao.countChildren(id);
        if (childrenCount > 0) throw new BadRequestException(CATEGORY_MESSAGES.CATEGORY_HAS_CHILDREN);
        const deletedCount = await this.categoryDao.delete(id);
        if (deletedCount === 0) throw new NotFoundException(MESSAGES.NOT_FOUND_ENTITY('Category'));
    }
}
