import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, BadRequestException, Logger } from "@nestjs/common";
import { BrandDao } from "./brand.dao";
import { ApiBuilder, MESSAGES } from "@app/common";
import { UniqueConstraintError } from 'sequelize';

@Injectable()
export class BrandService {
    constructor(private readonly brandDao: BrandDao) { }

    private readonly logger = new Logger(BrandService.name);

    async create(payload: any) {
        try {
            if (!payload || !payload.name || typeof payload.name !== 'string' || !payload.name.trim()) {
                throw new BadRequestException('Brand name is required');
            }
            if (!payload.slug || typeof payload.slug !== 'string' || !payload.slug.trim()) {
                throw new BadRequestException('Brand slug is required');
            }

            // Normalize
            payload.name = payload.name.trim();
            payload.slug = payload.slug.trim().toLowerCase();

            const result = await this.brandDao.transaction(async (t) => {
                return this.brandDao.findOrCreateByName(payload, t);
            });

            if (!result.created) {
                this.logger.warn(`create: duplicate brand name=${payload.name}`);
                throw new ConflictException(MESSAGES.EXISTS_ENTITY('Brand'));
            }

            this.logger.log(`create: brand created id=${result.brand.id} name=${result.brand.name}`);
            return ApiBuilder.success(result.brand, MESSAGES.CREATED).build();
        } catch (error) {
            if (error instanceof UniqueConstraintError || (error as any).name === 'SequelizeUniqueConstraintError') {
                throw new ConflictException(MESSAGES.EXISTS_ENTITY('Brand'));
            }
            if (error instanceof BadRequestException || error instanceof ConflictException) throw error;
            this.logger.error('create: unexpected error', error as any);
            throw new InternalServerErrorException((error as Error).message);
        }
    }

    async list(query: any) {
        try {
            const { limit, offset } = query;
            const parsedLimit = limit ? Number.parseInt(limit) : 10;
            const parsedOffset = offset ? Number.parseInt(offset) : 0;
            const { rows, count } = await this.brandDao.findAll(parsedLimit, parsedOffset);
            return ApiBuilder.success({ rows, count }, MESSAGES.SUCCESS).build();
        } catch (error) {
            throw new InternalServerErrorException((error as Error).message);
        }
    }

    async findById(id: string) {
        try {
            const brand = await this.brandDao.findById(id);
            if (!brand) throw new NotFoundException(MESSAGES.NOT_FOUND_ENTITY('Brand'));
            return ApiBuilder.success(brand, MESSAGES.SUCCESS).build();
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            throw new InternalServerErrorException((error as Error).message);
        }
    }

    async update(id: string, payload: any) {
        try {
            if (payload && payload.name && typeof payload.name === 'string') {
                payload.name = payload.name.trim();
                const existing = await this.brandDao.findByName(payload.name);
                if (existing && existing.id !== id) {
                    throw new ConflictException(MESSAGES.EXISTS_ENTITY('Brand'));
                }
            }
            if (payload && payload.slug && typeof payload.slug === 'string') {
                payload.slug = payload.slug.trim().toLowerCase();
            }

            const updatedBrand = await this.brandDao.update(id, payload);
            if (!updatedBrand) throw new NotFoundException(MESSAGES.NOT_FOUND_ENTITY('Brand'));
            this.logger.log(`update: brand id=${id} updated`);
            return ApiBuilder.success(updatedBrand, MESSAGES.UPDATED).build();
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            if (error instanceof ConflictException) throw error;
            if (error instanceof UniqueConstraintError || (error as any).name === 'SequelizeUniqueConstraintError') {
                throw new ConflictException(MESSAGES.EXISTS_ENTITY('Brand'));
            }
            this.logger.error(`update: unexpected error id=${id}`, error as any);
            throw new InternalServerErrorException((error as Error).message);
        }
    }

    async delete(id: string) {
        try {
            const deleted = await this.brandDao.delete(id);
            if (!deleted) throw new NotFoundException(MESSAGES.NOT_FOUND_ENTITY('Brand'));
            return ApiBuilder.success(null, MESSAGES.DELETED).build();
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            throw new InternalServerErrorException((error as Error).message);
        }
    }
}