export interface CookieOptions {
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: boolean | 'lax' | 'strict' | 'none';
    maxAge?: number;
    path?: string;
    domain?: string;
}