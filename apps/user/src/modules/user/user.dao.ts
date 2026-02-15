import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/sequelize";
import { User, UserProfile, Role, UserRole, UserAddress, Permission } from '../../models';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class UserDao {
    constructor(
        @InjectModel(User) private readonly userModel: typeof User,
        @InjectModel(UserProfile) private readonly profileModel: typeof UserProfile,
        @InjectModel(UserAddress) private readonly userAddressModel: typeof UserAddress,
        @InjectModel(Role) private readonly roleModel: typeof Role,
        @InjectModel(UserRole) private readonly userRoleModel: typeof UserRole,
        @InjectModel(Permission) private readonly permissionModel: typeof Permission,
        private readonly sequelize: Sequelize
    ) { }

    async create(userData: any, profileData: any) {
        const transaction = await this.sequelize.transaction();
        try {
            // 1. Create User
            const user = await this.userModel.create(userData, { transaction });
            // 2. Create Profile
            await this.profileModel.create({
                ...profileData,
                user_id: user.id
            }, { transaction });
            // 3. Assign Default Role ('User')
            const defaultRole = await this.roleModel.findOne({
                where: { name: 'User' },
                transaction
            });
            if (defaultRole) {
                await this.userRoleModel.create({
                    user_id: user.id,
                    role_id: defaultRole.id
                }, { transaction });
            }
            await transaction.commit();
            return user;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
    async findAll(limit?: number, offset?: number) {
        return this.userModel.findAndCountAll({
            limit,
            offset,
            include: [
                { model: this.profileModel, as: 'profile' },
                { model: this.roleModel, as: 'roles' },
                { model: this.userAddressModel, as: 'addresses' },
                { model: this.userRoleModel, as: 'user_roles' }
            ],
            distinct: true,
            order: [['created_at', 'DESC']]
        });
    }

    async findById(id: string) {
        return this.userModel.findByPk(id, {
            include: [
                { model: this.profileModel, as: 'profile' },
                { model: this.roleModel, as: 'roles' },
                { model: this.userAddressModel, as: 'addresses' },
                { model: this.userRoleModel, as: 'user_roles' }
            ]
        });
    }

    async findByCredentialId(credentialId: string) {
        return this.userModel.findOne({
            where: { credential_id: credentialId },
            include: [
                { model: this.profileModel, as: 'profile' },
                { model: this.roleModel, as: 'roles' }
            ]
        });
    }

    async update(id: string, userData: any, profileData?: any) {
        const transaction = await this.sequelize.transaction();
        try {
            await this.userModel.update(userData, {
                where: { id },
                transaction
            });

            if (profileData) {
                await this.profileModel.update(profileData, {
                    where: { user_id: id },
                    transaction
                });
            }

            await transaction.commit();
            return this.findById(id);
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async delete(id: string) {
        return this.userModel.destroy({ where: { id } });
    }

    async getUserPermissions(id: string) {
        const user = await this.userModel.findByPk(id, {
            include: [
                {
                    model: this.roleModel,
                    as: 'roles',
                    include: [
                        {
                            model: this.permissionModel,
                            as: 'permissions'
                        }
                    ]
                }
            ]
        });

        if (!user) return [];

        const permissions = new Set<string>();
        user.roles.forEach(role => {
            role.permissions.forEach(perm => {
                permissions.add(perm.key);
            });
        });

        return Array.from(permissions);
    }
}


