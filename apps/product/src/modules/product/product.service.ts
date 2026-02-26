import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from '../../models';

@Injectable()
export class ProductService {
    constructor(
        @InjectModel(Product)
        private readonly productRepository: typeof Product,
    ) { }
}
