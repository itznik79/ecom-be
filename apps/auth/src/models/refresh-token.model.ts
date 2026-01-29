import { Table, Column, Model, DataType, PrimaryKey, Default } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { IRefreshToken } from '../types';

@Table({ tableName: 'refresh_tokens', timestamps: true, underscored: true })
export class RefreshToken extends Model<IRefreshToken> {
    @PrimaryKey
    @Default(uuidv4)
    @Column(DataType.UUID)
    id: string;

    @Column({ type: DataType.UUID, allowNull: false })
    user_id: string;

    @Column({ type: DataType.STRING, allowNull: false })
    token_hash: string;

    @Column({ type: DataType.DATE, allowNull: false })
    expires_at: Date;

    @Column({ type: DataType.DATE, allowNull: true })
    revoked_at: Date;
}
