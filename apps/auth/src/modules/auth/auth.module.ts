import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { AuthDao } from './dao/auth.dao';

@Module({
    controllers: [AuthController],
    providers: [AuthService, AuthDao],
    exports: [AuthService],
})
export class AuthModule { }
