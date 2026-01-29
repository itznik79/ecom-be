import { Table, Column, Model, DataType, PrimaryKey, Default } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { IUserCredential } from '../types';

@Table({ tableName: 'user_credentials', timestamps: true, underscored: true })
export class UserCredential extends Model<IUserCredential> {
    @PrimaryKey
    @Default(uuidv4)
    @Column(DataType.UUID)
    user_id: string;

    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    email: string;

    @Column({ type: DataType.STRING, allowNull: true })
    password_hash: string; // Nullable for OAuth

    @Column({ type: DataType.STRING, allowNull: false })
    provider: string; // local | google | github

    @Column({ type: DataType.STRING, allowNull: true })
    provider_id: string;

    @Default(true)
    @Column(DataType.BOOLEAN)
    is_active: boolean;

    @Column({ type: DataType.DATE, allowNull: true })
    last_login_at: Date;
}
