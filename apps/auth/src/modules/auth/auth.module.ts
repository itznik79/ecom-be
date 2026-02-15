import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthDao } from './auth.dao';
import { SequelizeModule } from '@nestjs/sequelize';
import { HttpModule } from '@nestjs/axios';
import { UserCredential, RefreshToken } from '../../models';
import { RefreshTokenService } from './refresh-token.service';
import { RefreshTokenDao } from './refresh-token.dao';
import { RedisModule } from '@app/common';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
    imports: [
        SequelizeModule.forFeature([UserCredential, RefreshToken]),
        HttpModule,
        RedisModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, AuthDao, RefreshTokenService, RefreshTokenDao, GoogleStrategy],
    exports: [AuthService],
})
export class AuthModule { }
