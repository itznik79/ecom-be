# Masterclass: Google Social Login Implementation

This guide provides a "perfect" step-by-step implementation of Google OAuth2 within a NestJS microservices environment.

---

## 1. Prerequisites & Environment
Ensure your root `.env` has the following placeholders:
```env
GOOGLE_CLIENT_ID=your_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_secret
GOOGLE_CALLBACK_URL=http://localhost:4000/auth/google/callback
```

## 2. Installation (Auth Service)
Developers must install the Passport Google strategy in the `auth` service.
```bash
cd apps/auth
npm install passport-google-oauth20
npm install -D @types/passport-google-oauth20
```

## 3. The Strategy (`google.strategy.ts`)
The strategy is responsible for normalizing the data received from Google.
**Location**: `apps/auth/src/modules/auth/strategies/google.strategy.ts`

```typescript
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(private configService: ConfigService) {
        super({
            clientID: configService.get('GOOGLE_CLIENT_ID'),
            clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
            callbackURL: configService.get('GOOGLE_CALLBACK_URL'),
            scope: ['email', 'profile'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) {
        const { name, emails, photos, id } = profile;
        const user = {
            email: emails[0].value,
            firstName: name.givenName,
            lastName: name.familyName,
            picture: photos[0].value,
            providerId: id,
            accessToken,
        };
        done(null, user);
    }
}
```

## 4. The Guard (`google-auth.guard.ts`)
We use a guard to trigger the strategy.
**Location**: `apps/auth/src/modules/auth/guards/google-auth.guard.ts`

```typescript
@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {}
```

## 5. The Service Logic (`auth.service.ts`)
The logic handles account linking (if a user exists) or registration (if new).
**Location**: `apps/auth/src/modules/auth/auth.service.ts`

```typescript
async googleLogin(googleProfile: any, res: Response) {
    const { email, firstName, lastName, providerId } = googleProfile;
    let user = await this.authDao.findByEmail(email);

    if (!user) {
        // Handle Automatic Registration
        const registerPayload = {
            email,
            provider: 'google',
            provider_id: providerId,
            profile: { name: `${firstName} ${lastName}` }
        };
        return this.register(registerPayload, res);
    }

    // Handle Account Linking
    if (user.provider === 'local') {
        await this.authDao.updateByUserId(user.user_id, {
            provider: 'google',
            provider_id: providerId
        });
    }

    // Token Issuance...
}
```

## 6. Registration in Module
Finally, ensure the strategy is registered in your `AuthModule` providers.
```typescript
@Module({
    providers: [AuthService, GoogleStrategy],
})
export class AuthModule {}
```
---
**Next Step**: Read the [PBAC Masterclass](./PBAC_MASTERCLASS.md) to see how we secure routes after login.
