import { Model } from 'sequelize-typescript';
export declare class User extends Model {
    id: string;
    email: string;
    password: string;
    name: string;
    phone: string;
    avatar: string;
    isEmailVerified: boolean;
    isActive: boolean;
    lastLogin: Date;
}
