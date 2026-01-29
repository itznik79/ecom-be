import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/database';
import { User, UserProfile, UserAddress, Role, Permission, UserRole, RolePermission } from './models';
import { UserModule } from './modules/user/user.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true, envFilePath: '../../.env' }),
        DatabaseModule.forRoot({
            dbNameEnvKey: 'USER_DB_NAME',
            models: [User, UserProfile, UserAddress, Role, Permission, UserRole, RolePermission]
        }),
        UserModule,
    ],
})
export class AppModule { }
