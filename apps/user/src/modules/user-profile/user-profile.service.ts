import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UserProfileDao } from './user-profile.dao';
import { ApiBuilder, MESSAGES } from '@app/common';
import { IUserProfile } from '../../types';

@Injectable()
export class UserProfileService {
    constructor(private readonly profileDao: UserProfileDao) { }

    async findByUserId(userId: string) {
        try {
            const profile = await this.profileDao.findByUserId(userId);
            if (!profile) throw new NotFoundException(MESSAGES.NOT_FOUND_ENTITY('UserProfile'));
            return ApiBuilder.success(profile, MESSAGES.SUCCESS).build();
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            throw new InternalServerErrorException((error as Error).message);
        }
    }

    async update(userId: string, payload: Partial<IUserProfile>) {
        try {
            const updatedProfile = await this.profileDao.update(userId, payload);
            if (!updatedProfile) throw new NotFoundException(MESSAGES.NOT_FOUND_ENTITY('UserProfile'));
            return ApiBuilder.success(updatedProfile, MESSAGES.UPDATED).build();
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            throw new InternalServerErrorException((error as Error).message);
        }
    }
}
