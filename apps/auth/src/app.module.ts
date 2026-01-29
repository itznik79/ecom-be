import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/database';
import { UserCredential, RefreshToken } from './models';
import { AuthModule } from './modules/auth/auth.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true, envFilePath: '../../.env' }),
        DatabaseModule.forRoot({
            dbNameEnvKey: 'AUTH_DB_NAME',
            models: [UserCredential, RefreshToken]
        }),
        AuthModule,
    ],
})
export class AppModule { }
