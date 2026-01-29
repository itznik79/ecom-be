import { Table, Column, Model, DataType, PrimaryKey, Default, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { User } from './user.model';
import { IUserProfile } from '../types';

@Table({ tableName: 'user_profiles', timestamps: true, underscored: true })
export class UserProfile extends Model<IUserProfile> {
    @PrimaryKey
    @Default(uuidv4)
    @Column(DataType.UUID)
    id: string;

    @ForeignKey(() => User)
    @Column({ type: DataType.UUID, unique: true, allowNull: false })
    user_id: string;

    @BelongsTo(() => User)
    user: User;

    @Column(DataType.STRING)
    first_name: string;

    @Column(DataType.STRING)
    last_name: string;

    @Column({ type: DataType.STRING, unique: true, allowNull: true })
    phone: string;

    @Column(DataType.STRING)
    avatar_url: string;

    @Column(DataType.DATEONLY)
    dob: Date;
}
