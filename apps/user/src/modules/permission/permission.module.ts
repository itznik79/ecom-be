import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission } from '../../models/permission.model';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
import { PermissionDao } from './permission.dao';

@Module({
    imports: [SequelizeModule.forFeature([Permission])],
    controllers: [PermissionController],
    providers: [PermissionService, PermissionDao],
    exports: [PermissionService, PermissionDao],
})
export class PermissionModule { }