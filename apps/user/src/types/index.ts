export interface IUser {
    id: string;
    email: string;
    provider: string;
    provider_id?: string;
    is_active: boolean;
    created_at?: Date;
    updated_at?: Date;
}

export interface IUserProfile {
    id: string;
    user_id: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    avatar_url?: string;
    dob?: Date;
    created_at?: Date;
    updated_at?: Date;
}

export interface IUserAddress {
    id: string;
    user_id: string;
    type: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
    is_default: boolean;
    created_at?: Date;
    updated_at?: Date;
}

export interface IRole {
    id: string;
    name: string;
    description?: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface IPermission {
    id: string;
    key: string;
    description?: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface IUserRole {
    user_id: string;
    role_id: string;
    assigned_at: Date;
    created_at?: Date;
    updated_at?: Date;
}

export interface IRolePermission {
    role_id: string;
    permission_id: string;
    created_at?: Date;
    updated_at?: Date;
}
