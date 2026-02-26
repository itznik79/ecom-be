import { Module } from '@nestjs/common';
import { MonitoringModule } from '../../../packages/monitoring/dist/monitoring.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/database';
import { UserCredential, RefreshToken } from './models/index';
import { AuthModule } from './modules/auth/auth.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true, envFilePath: '../../.env' }),
        DatabaseModule.forRoot({
            dbNameEnvKey: 'AUTH_DB_NAME',
            models: [UserCredential, RefreshToken]
        }),
        AuthModule,
        MonitoringModule.forRoot({ sentry: { dsn: process.env.SENTRY_DSN, env: process.env.NODE_ENV }, metrics: true }),
    ],
})
export class AppModule { }
