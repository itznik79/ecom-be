import { Table, Column, Model, DataType, PrimaryKey, Default, BelongsToMany } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { User } from './user.model';
import { UserRole } from './user-role.model';
import { Permission } from './permission.model';
import { RolePermission } from './role-permission.model';
import { IRole } from '../types';

@Table({ tableName: 'roles', timestamps: true, underscored: true })
export class Role extends Model<IRole> {
    @PrimaryKey
    @Default(uuidv4)
    @Column(DataType.UUID)
    id: string;

    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    name: string; // ADMIN, SELLER, USER

    @Column(DataType.STRING)
    description: string;

    @BelongsToMany(() => User, () => UserRole)
    users: User[];

    @BelongsToMany(() => Permission, () => RolePermission)
    permissions: Permission[];
}
