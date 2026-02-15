import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserProfile } from '../../models';
import { UserProfileController } from './user-profile.controller';
import { UserProfileService } from './user-profile.service';
import { UserProfileDao } from './user-profile.dao';

@Module({
    imports: [SequelizeModule.forFeature([UserProfile])],
    controllers: [UserProfileController],
    providers: [UserProfileService, UserProfileDao],
    exports: [UserProfileService],
})
export class UserProfileModule { }
