import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/database';
import { Category } from './models';
import { CategoryModule } from './modules/category/category.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true, envFilePath: '../../.env' }),
        DatabaseModule.forRoot({
            dbNameEnvKey: 'CATEGORY_DB_NAME',
            models: [Category]
        }),
        CategoryModule,
    ],
})
export class AppModule { }
