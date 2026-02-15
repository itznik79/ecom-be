import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RedisService, PERMISSIONS_KEY } from '@app/common';

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private redisService: RedisService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredPermissions || requiredPermissions.length === 0) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user; // Assumes user is already attached by AuthGuard

        if (!user || !user.id) {
            throw new ForbiddenException('User identification failed');
        }

        const cachedPerms = await this.redisService.get(`perms:${user.id}`);
        if (!cachedPerms) {
            // Ideally should re-fetch if not in cache, but for now we expect it to be there
            throw new ForbiddenException('Permissions not found in cache. Please re-login.');
        }

        const userPermissions: string[] = JSON.parse(cachedPerms);

        const hasPermission = requiredPermissions.every((permission) =>
            userPermissions.includes(permission)
        );

        if (!hasPermission) {
            throw new ForbiddenException('Insufficient permissions');
        }

        return true;
    }
}
