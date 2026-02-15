import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes } from '@nestjs/common';
import { RoleService } from './role.service';
import { JoiValidationPipe, PaginationQuery } from '@app/common';
import { createRoleSchema, updateRoleSchema, listRoleSchema } from '../../validators/role.validator';

@Controller('roles')
export class RoleController {
    constructor(private readonly roleService: RoleService) { }

    @Post()
    @UsePipes(new JoiValidationPipe(createRoleSchema))
    async create(@Body() body: any) {
        return this.roleService.create(body);
    }

    @Get()
    @UsePipes(new JoiValidationPipe(listRoleSchema))
    async list(@Query() query: PaginationQuery) {
        return this.roleService.list(query);
    }

    @Get(':id')
    async findById(@Param('id') id: string) {
        return this.roleService.findById(id);
    }

    @Put(':id')
    @Put(':id')
    async update(@Param('id') id: string, @Body(new JoiValidationPipe(updateRoleSchema)) body: any) {
        return this.roleService.update(id, body);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.roleService.delete(id);
    }
}
