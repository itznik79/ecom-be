import { Body, Controller, Post, Get, Query, UsePipes } from '@nestjs/common';
import { RolePermissionService } from './role-permission.service';
import { JoiValidationPipe, PaginationQuery } from '@app/common';
import { assignPermissionSchema, listRolePermissionSchema } from '../../validators/role-permission.validator';

@Controller('role-permissions')
export class RolePermissionController {
    constructor(private readonly rolePermissionService: RolePermissionService) { }

    @Post('assign')
    @UsePipes(new JoiValidationPipe(assignPermissionSchema))
    async assignPermissions(@Body() body: any) {
        return this.rolePermissionService.assignPermissions(body);
    }

    @Get()
    @UsePipes(new JoiValidationPipe(listRolePermissionSchema))
    async list(@Query() query: PaginationQuery) {
        return this.rolePermissionService.list(query);
    }
}
