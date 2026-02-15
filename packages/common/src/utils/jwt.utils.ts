import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

export interface ITokenPayload {
    id: string;
    jti?: string;
}

export const generateToken = (payload: ITokenPayload): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] });
};

export const verifyToken = (token: string): ITokenPayload => {
    return jwt.verify(token, JWT_SECRET) as ITokenPayload;
};
