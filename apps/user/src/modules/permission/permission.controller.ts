import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { JoiValidationPipe, PaginationQuery } from '@app/common';
import { createPermissionSchema, updatePermissionSchema, listPermissionSchema } from '../../validators/permission.validator';

@Controller('permissions')
export class PermissionController {
    constructor(private readonly permissionService: PermissionService) { }

    @Post()
    @UsePipes(new JoiValidationPipe(createPermissionSchema))
    async create(@Body() body: any) {
        return this.permissionService.create(body);
    }

    @Get()
    @UsePipes(new JoiValidationPipe(listPermissionSchema))
    async list(@Query() query: PaginationQuery) {
        return this.permissionService.list(query);
    }

    @Get(':id')
    async findById(@Param('id') id: string) {
        return this.permissionService.findById(id);
    }

    @Put(':id')
    @Put(':id')
    async update(@Param('id') id: string, @Body(new JoiValidationPipe(updatePermissionSchema)) body: any) {
        return this.permissionService.update(id, body);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.permissionService.delete(id);
    }
}
