import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductController } from './controllers/product.controller';
import { ProductService } from './services/product.service';
import { Product } from '../../models/product.model';

@Module({
    imports: [SequelizeModule.forFeature([Product])],
    controllers: [ProductController],
    providers: [ProductService],
})
export class ProductModule { }
