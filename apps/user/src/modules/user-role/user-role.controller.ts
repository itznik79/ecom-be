import { Controller, Get, Post, Delete, Body, Param, UsePipes, Query } from '@nestjs/common';
import { UserRoleService } from './user-role.service';
import { JoiValidationPipe, ApiBuilder, MESSAGES, PaginationQuery } from '@app/common';
import { createUserRoleValidator } from '../../validators';

@Controller('user-roles')
export class UserRoleController {
    constructor(private readonly userRoleService: UserRoleService) { }

    @Post()
    @UsePipes(new JoiValidationPipe(createUserRoleValidator))
    async assignRole(@Body() body: any) {
        const { user_id, role_id } = body;
        return this.userRoleService.assignRole(user_id, role_id);
    }

    @Get(':userId')
    async findByUserId(@Param('userId') userId: string, @Query() query: PaginationQuery) {
        return this.userRoleService.findByUserId(userId, query);
    }

    @Delete(':userId/:roleId')
    async removeRole(@Param('userId') userId: string, @Param('roleId') roleId: string) {
        return this.userRoleService.removeRole(userId, roleId);
    }
}
