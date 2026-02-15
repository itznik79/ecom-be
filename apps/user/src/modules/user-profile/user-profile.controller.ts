import { Controller, Get, Put, Body, Param } from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { JoiValidationPipe, ApiBuilder, MESSAGES } from '@app/common';
import { updateUserProfileValidator } from '../../validators';

@Controller('user-profiles')
export class UserProfileController {
    constructor(private readonly profileService: UserProfileService) { }

    @Get(':userId')
    async findByUserId(@Param('userId') userId: string) {
        return this.profileService.findByUserId(userId);
    }

    @Put(':userId')
    async update(
        @Param('userId') userId: string,
        @Body(new JoiValidationPipe(updateUserProfileValidator)) body: any
    ) {
        return this.profileService.update(userId, body);
    }
}
