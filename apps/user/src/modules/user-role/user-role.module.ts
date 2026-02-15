import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserRole, Role } from '../../models';
import { UserRoleController } from './user-role.controller';
import { UserRoleService } from './user-role.service';
import { UserRoleDao } from './user-role.dao';

@Module({
    imports: [SequelizeModule.forFeature([UserRole, Role])],
    controllers: [UserRoleController],
    providers: [UserRoleService, UserRoleDao],
    exports: [UserRoleService],
})
export class UserRoleModule { }
