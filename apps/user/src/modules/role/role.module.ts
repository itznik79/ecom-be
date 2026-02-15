import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role } from '../../models/role.model';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { RoleDao } from './role.dao';

@Module({
    imports: [SequelizeModule.forFeature([Role])],
    controllers: [RoleController],
    providers: [RoleService, RoleDao],
    exports: [RoleService, RoleDao],
})
export class RoleModule { }
