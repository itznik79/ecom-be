import { Table, Column, Model, DataType, ForeignKey, PrimaryKey } from 'sequelize-typescript';
import { User } from './user.model';
import { Role } from './role.model';
import { IUserRole } from '../types';

@Table({ tableName: 'user_roles', timestamps: true, underscored: true })
export class UserRole extends Model<IUserRole> {
    @ForeignKey(() => User)
    @PrimaryKey
    @Column(DataType.UUID)
    user_id: string;

    @ForeignKey(() => Role)
    @PrimaryKey
    @Column(DataType.UUID)
    role_id: string;

    @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
    assigned_at: Date;
}
