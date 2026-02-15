import { Body, Controller, Post, Get, Res, UsePipes, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JoiValidationPipe, MESSAGES } from '@app/common';
import { loginSchema, registerSchema } from '../../validator/auth.validator';
import { Response, Request } from 'express';
import { GoogleAuthGuard } from './guards/google-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    @UsePipes(new JoiValidationPipe(registerSchema))
    async register(@Body() body: any, @Res() res: Response) {
        const response = await this.authService.register(body, res);
        return res.status(response.statusCode).json(response);
    }

    @Post('login')
    @UsePipes(new JoiValidationPipe(loginSchema))
    async login(@Body() body: any, @Res() res: Response) {
        const response = await this.authService.login(body, res);
        return res.status(response.statusCode).json(response);
    }

    @Get('google')
    @UseGuards(GoogleAuthGuard)
    async googleAuth(@Req() req: Request) { }

    @Get('google/callback')
    @UseGuards(GoogleAuthGuard)
    async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
        const response = await this.authService.googleLogin(req.user, res);
        return res.status(response.statusCode).json(response);
    }

    @Post('refresh')
    async refresh(@Req() req: Request, @Res() res: Response) {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) throw new UnauthorizedException(MESSAGES.UNAUTHORIZED);

        const response = await this.authService.refresh(refreshToken, res);
        return res.status(response.statusCode).json(response);
    }

    @Post('logout')
    async logout(@Req() req: Request, @Res() res: Response) {
        const authHeader = req.headers.authorization;
        const token = authHeader ? authHeader.split(' ')[1] : undefined;

        // Use the refresh token from cookies to identify user if access token isn't provided/valid
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken && !token) throw new UnauthorizedException(MESSAGES.UNAUTHORIZED);

        let userId: string;
        if (token) {
            const payload = await this.authService.verifyAccessToken(token);
            userId = payload.id;
        } else {
            // If only RT exists, we still want to logout
            const { verifyToken } = await import('@app/common');
            const [id] = refreshToken.split('.');
            // Note: This is a bit simplified, usually you'd verify the RT properly
            // but for logout, we just need to clear it.
            // Let's stick to the simplest version for now.
            throw new UnauthorizedException("Cannot logout without active session");
        }

        const response = await this.authService.logout(userId, res, token);
        return res.status(response.statusCode).json(response);
    }
}
