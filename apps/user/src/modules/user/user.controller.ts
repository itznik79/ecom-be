import { Controller, Get, Post, Put, Delete, Body, Param, Query, UsePipes } from '@nestjs/common';
import { UserService } from './user.service';
import { JoiValidationPipe, ApiBuilder, MESSAGES, PaginationQuery, buildPagination, buildPaginationMeta } from '@app/common';
import { createUserValidator, updateUserValidator, listUserSchema } from '../../validators';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post()
    async create(@Body() body: any) {
        const { profile, ...userData } = body;
        return this.userService.create(userData, profile || {});
    }

    @Get()
    @UsePipes(new JoiValidationPipe(listUserSchema))
    async findAll(@Query() query: PaginationQuery) {
        return this.userService.findAll(query);
    }

    @Get(':id')
    async findById(@Param('id') id: string) {
        return this.userService.findById(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body(new JoiValidationPipe(updateUserValidator)) body: any) {
        const { profile, ...userData } = body;
        return this.userService.update(id, userData, profile);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.userService.delete(id);
    }

    @Get(':id/permissions')
    async getPermissions(@Param('id') id: string) {
        return this.userService.getUserPermissions(id);
    }
}
