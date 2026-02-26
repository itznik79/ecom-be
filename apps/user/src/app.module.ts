import { Module } from '@nestjs/common';
import { MonitoringModule } from '../../../packages/monitoring/dist/monitoring.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/database';
import { User, UserProfile, UserAddress, Role, Permission, UserRole, RolePermission } from './models';
import { UserModule } from './modules/user/user.module';
import { RoleModule } from './modules/role/role.module';
import { PermissionModule } from './modules/permission/permission.module';
import { RolePermissionModule } from './modules/role-permission/role-permission.module';
import { UserProfileModule } from './modules/user-profile/user-profile.module';
import { UserRoleModule } from './modules/user-role/user-role.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true, envFilePath: '../../.env' }),
        DatabaseModule.forRoot({
            dbNameEnvKey: 'USER_DB_NAME',
            models: [User, UserProfile, UserAddress, Role, Permission, UserRole, RolePermission]
        }),
        UserModule,
        RoleModule,
        PermissionModule,
        RolePermissionModule,
        UserProfileModule,
        UserRoleModule,
        MonitoringModule.forRoot({ sentry: { dsn: process.env.SENTRY_DSN, env: process.env.NODE_ENV }, metrics: true }),
    ],
})
export class AppModule { }
