import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserDao } from './user.dao';
import { User, UserProfile, UserAddress, Role, UserRole, Permission, RolePermission } from '../../models';

@Module({
    imports: [SequelizeModule.forFeature([User, UserProfile, UserAddress, Role, UserRole, Permission, RolePermission])],
    controllers: [UserController],
    providers: [UserService, UserDao],
    exports: [UserService],
})
export class UserModule { }
