import { Table, Column, Model, DataType, PrimaryKey, Default, BelongsToMany } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { Role } from './role.model';
import { RolePermission } from './role-permission.model';
import { IPermission } from '../types';

@Table({ tableName: 'permissions', timestamps: true, underscored: true })
export class Permission extends Model<IPermission> {
    @PrimaryKey
    @Default(uuidv4)
    @Column(DataType.UUID)
    id: string;

    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    key: string; // order.create, product.update

    @Column(DataType.STRING)
    description: string;

    @BelongsToMany(() => Role, () => RolePermission)
    roles: Role[];
}
