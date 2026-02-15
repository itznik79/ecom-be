import { AuthProvider } from './auth-provider.enum';

export interface IUserCredential {
    user_id: string;
    email: string;
    password_hash?: string;
    provider: AuthProvider;
    provider_id?: string;
    is_active: boolean;
    last_login_at?: Date;
    created_at?: Date;
    updated_at?: Date;
}

export interface IRefreshToken {
    id: string;
    user_id: string;
    token_hash: string;
    expires_at: Date;
    revoked_at?: Date;
    created_at?: Date;
    updated_at?: Date;
}
