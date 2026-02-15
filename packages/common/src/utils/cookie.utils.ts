import { Response } from 'express';
import { CookieOptions } from '../types/cookies.types';

const DEFAULT_COOKIE_OPTIONS: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 24 * 60 * 60 * 1000 // 1 day
};

export const setCookie = (res: Response, name: string, value: string, options: CookieOptions = {}) => {
    res.cookie(name, value, { ...DEFAULT_COOKIE_OPTIONS, ...options });
};

export const clearCookie = (res: Response, name: string, options: CookieOptions = {}) => {
    res.clearCookie(name, { ...DEFAULT_COOKIE_OPTIONS, ...options });
};
