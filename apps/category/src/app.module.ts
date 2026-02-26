import { Module } from '@nestjs/common';
import { MonitoringModule } from '../../../packages/monitoring/dist/monitoring.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/database';
import { Category } from './modules/category/category.model';
import { CategoryModule } from './modules/category/category.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true, envFilePath: '../../.env' }),
        DatabaseModule.forRoot({
            dbNameEnvKey: 'CATEGORY_DB_NAME',
            models: [Category]
        }),
        CategoryModule,
        MonitoringModule.forRoot({ sentry: { dsn: process.env.SENTRY_DSN, env: process.env.NODE_ENV }, metrics: true }),
    ],
})
export class AppModule { }
