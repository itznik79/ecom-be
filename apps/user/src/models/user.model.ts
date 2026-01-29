import { Table, Column, Model, DataType, PrimaryKey, Default, HasOne, HasMany, BelongsToMany } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { UserProfile } from './user-profile.model';
import { UserAddress } from './user-address.model';
import { Role } from './role.model';
import { UserRole } from './user-role.model';
import { IUser } from '../types';

@Table({ tableName: 'users', timestamps: true, underscored: true })
export class User extends Model<IUser> {
    @PrimaryKey
    @Default(uuidv4)
    @Column(DataType.UUID)
    id: string;

    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    email: string;

    @Column({ type: DataType.STRING, allowNull: false })
    provider: string;

    @Column({ type: DataType.STRING, allowNull: true })
    provider_id: string;

    @Default(true)
    @Column(DataType.BOOLEAN)
    is_active: boolean;

    @HasOne(() => UserProfile)
    profile: UserProfile;

    @HasMany(() => UserAddress)
    addresses: UserAddress[];

    @BelongsToMany(() => Role, () => UserRole)
    roles: Role[];
}
