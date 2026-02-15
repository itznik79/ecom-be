import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RefreshToken } from '../../models/refresh-token.model';
import { IRefreshToken } from '../../types';
import { Op } from 'sequelize';

@Injectable()
export class RefreshTokenDao {
    constructor(
        @InjectModel(RefreshToken)
        private readonly refreshTokenModel: typeof RefreshToken,
    ) { }

    async create(payload: Partial<IRefreshToken>): Promise<RefreshToken> {
        return this.refreshTokenModel.create(payload as any);
    }

    async findById(id: string): Promise<RefreshToken | null> {
        return this.refreshTokenModel.findOne({
            where: {
                id,
                revoked_at: null,
                expires_at: { [Op.gt]: new Date() }
            },
        });
    }

    async revokeToken(id: string): Promise<boolean> {
        const [affectedRows] = await this.refreshTokenModel.update(
            { revoked_at: new Date() },
            { where: { id } }
        );
        return affectedRows > 0;
    }

    async revokeAllByUserId(userId: string): Promise<number> {
        const [affectedRows] = await this.refreshTokenModel.update(
            { revoked_at: new Date() },
            {
                where: {
                    user_id: userId,
                    revoked_at: null
                }
            }
        );
        return affectedRows;
    }

    async deleteExpired(): Promise<number> {
        return this.refreshTokenModel.destroy({
            where: {
                [Op.or]: [
                    { expires_at: { [Op.lt]: new Date() } },
                    { revoked_at: { [Op.ne]: null } }
                ]
            }
        });
    }
}
