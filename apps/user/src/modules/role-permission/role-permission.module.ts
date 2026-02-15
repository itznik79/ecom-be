import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RolePermission } from '../../models/role-permission.model';
import { RolePermissionController } from './role-permission.controller';
import { RolePermissionService } from './role-permission.service';
import { RolePermissionDao } from './role-permission.dao';

@Module({
    imports: [SequelizeModule.forFeature([RolePermission])],
    controllers: [RolePermissionController],
    providers: [RolePermissionService, RolePermissionDao],
    exports: [RolePermissionService, RolePermissionDao],
})
export class RolePermissionModule { }
