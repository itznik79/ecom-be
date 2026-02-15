import { Injectable } from '@nestjs/common';
import { UserCredential } from '../../models';
import { IUserCredential } from '../../types';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class AuthDao {
    constructor(
        @InjectModel(UserCredential)
        private readonly userCredentialModel: typeof UserCredential,
    ) { }

    async findByEmail(email: string): Promise<UserCredential | null> {
        return this.userCredentialModel.findOne({ where: { email } });
    }

    async findByUserId(userId: string): Promise<UserCredential | null> {
        return this.userCredentialModel.findOne({ where: { user_id: userId } });
    }

    async create(payload: Omit<IUserCredential, 'is_active' | 'last_login_at'>): Promise<UserCredential> {
        return this.userCredentialModel.create(payload);
    }

    async updateByUserId(userId: string, payload: Partial<IUserCredential>): Promise<boolean> {
        const [affectedRows] = await this.userCredentialModel.update(payload, { where: { user_id: userId } });
        return affectedRows > 0;
    }

    async softDeleteByUserId(userId: string): Promise<boolean> {
        const deleted = await this.userCredentialModel.destroy({ where: { user_id: userId } });
        return deleted > 0;
    }

    async delete(userId: string): Promise<boolean> {
        const deleted = await this.userCredentialModel.destroy({ where: { user_id: userId } });
        return deleted > 0;
    }
}

