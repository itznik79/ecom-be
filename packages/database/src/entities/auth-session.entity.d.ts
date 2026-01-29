import { Model } from 'sequelize-typescript';
export declare class AuthSession extends Model {
    id: string;
    userId: string;
    token: string;
    userAgent: string;
    ipAddress: string;
    expiresAt: Date;
    isRevoked: boolean;
}
