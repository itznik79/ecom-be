import { Table, Column, Model, DataType, PrimaryKey, Default, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { User } from './user.model';
import { IUserAddress } from '../types';

@Table({ tableName: 'user_addresses', timestamps: true, underscored: true })
export class UserAddress extends Model<IUserAddress> {
    @PrimaryKey
    @Default(uuidv4)
    @Column(DataType.UUID)
    id: string;

    @ForeignKey(() => User)
    @Column({ type: DataType.UUID, allowNull: false })
    user_id: string;

    @BelongsTo(() => User)
    user: User;

    @Column(DataType.STRING)
    type: string; // home | office | billing

    @Column(DataType.STRING)
    address_line1: string;

    @Column(DataType.STRING)
    address_line2: string;

    @Column(DataType.STRING)
    city: string;

    @Column(DataType.STRING)
    state: string;

    @Column(DataType.STRING)
    country: string;

    @Column(DataType.STRING)
    postal_code: string;

    @Default(false)
    @Column(DataType.BOOLEAN)
    is_default: boolean;
}
