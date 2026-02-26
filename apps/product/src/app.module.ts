import { Module } from '@nestjs/common';
import { MonitoringModule } from '../../../packages/monitoring/dist/monitoring.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/database';
import { ProductModule } from './modules/product/product.module';
import {
    Product,
    ProductVariant,
    ProductImages,
    Brand,
    Attributes,
    VariantAttributeValues,
    CategoryAttributes,
    AttributeValue,
} from './models';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true, envFilePath: '../../.env' }),
        DatabaseModule.forRoot({
            dbNameEnvKey: 'PRODUCT_DB',
            models: [
                Product,
                Brand,
                ProductVariant,
                ProductImages,
                Attributes,
                VariantAttributeValues,
                CategoryAttributes,
                AttributeValue,
            ],
        }),
        ProductModule,
        MonitoringModule.forRoot({ sentry: { dsn: process.env.SENTRY_DSN, env: process.env.NODE_ENV }, metrics: true }),
    ],
})
export class AppModule { }