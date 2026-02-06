import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UsePipes } from '@nestjs/common';
import { CategoryService } from './category.service';
import { JoiValidationPipe, PaginationQuery } from '@app/common';
import { createCategorySchema, updateCategorySchema, listCategorySchema } from './category.validator';
import { ICategory } from '../../types';

@Controller('categories')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) { }

    @Post()
    @UsePipes(new JoiValidationPipe(createCategorySchema))
    async create(@Body() category: Partial<ICategory>) {
        return this.categoryService.create(category);
    }

    @Get()
    @UsePipes(new JoiValidationPipe(listCategorySchema))
    async list(@Query() query: PaginationQuery) {
        return this.categoryService.list(query);
    }

    @Get(':id')
    async getById(@Param('id') id: string) {
        return this.categoryService.getById(id);
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body(new JoiValidationPipe(updateCategorySchema)) data: Partial<ICategory>
    ) {
        return this.categoryService.update(id, data);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.categoryService.delete(id);
    }
}
