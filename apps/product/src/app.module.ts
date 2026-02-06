import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/database';
import { Product } from './models/product.model';
import { ProductModule } from './modules/product/product.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true, envFilePath: '../../.env' }),
        DatabaseModule.forRoot({
            dbNameEnvKey: 'PRODUCT_DB_NAME',
            models: [Product]
        }),
        ProductModule,
    ],
})
export class AppModule { }
