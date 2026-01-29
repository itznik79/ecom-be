import { Table, Column, Model, DataType, ForeignKey, PrimaryKey } from 'sequelize-typescript';
import { Role } from './role.model';
import { Permission } from './permission.model';
import { IRolePermission } from '../types';

@Table({ tableName: 'role_permissions', timestamps: false, underscored: true })
export class RolePermission extends Model<IRolePermission> {
    @ForeignKey(() => Role)
    @PrimaryKey
    @Column(DataType.UUID)
    role_id: string;

    @ForeignKey(() => Permission)
    @PrimaryKey
    @Column(DataType.UUID)
    permission_id: string;
}
