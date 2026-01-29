import { Module } from '@nestjs/common';
import { CategoryController } from './controllers/category.controller';
import { CategoryService } from './services/category.service';
import { CategoryDao } from './dao/category.dao';

@Module({
    controllers: [CategoryController],
    providers: [CategoryService, CategoryDao],
    exports: [CategoryService],
})
export class CategoryModule { }
