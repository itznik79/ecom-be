import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserProfile } from '../../models';
import { IUserProfile } from '../../types';

@Injectable()
export class UserProfileDao {
    constructor(
        @InjectModel(UserProfile)
        private readonly profileModel: typeof UserProfile,
    ) { }

    async findByUserId(userId: string): Promise<UserProfile | null> {
        return this.profileModel.findOne({ where: { user_id: userId } });
    }

    async update(userId: string, payload: Partial<IUserProfile>): Promise<UserProfile | null> {
        const [affectedCount, affectedRows] = await this.profileModel.update(payload, {
            where: { user_id: userId },
            returning: true,
        });
        return affectedCount > 0 ? affectedRows[0] : null;
    }
}
