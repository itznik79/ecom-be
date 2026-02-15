# Google Social Login

Enterprise-grade Google OAuth implementation using Passport.js and NestJS.

## Overview
This module enables users to sign in or register using their Google accounts. It handles account linking, automatic profile creation, and issues stateful JWT sessions.

## Configuration
Add the following to your root `.env` file:
```env
GOOGLE_CLIENT_ID=your_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_secret
GOOGLE_CALLBACK_URL=http://localhost:4000/auth/google/callback
```

## How it Works
1. **Initiation**: User hits `GET /auth/google`.
2. **Redirection**: The `GoogleAuthGuard` triggers the Passport strategy and redirects to Google.
3. **Profile Extraction**: `GoogleStrategy` fetches the user's `email`, `id`, `name`, and `picture`.
4. **Service Logic** (`AuthService.googleLogin`):
   - **New User**: Automatically registers the user and creates a profile in the `User` microservice.
   - **Linking**: If the email matches an existing local user, it links the Google provider info to that account.
5. **Token Issuance**: Generates a stateful Access Token (Redis) and a Refresh Token (Postgres Cookie).

## Files
- **Strategy**: `apps/auth/src/modules/auth/strategies/google.strategy.ts`
- **Guard**: `apps/auth/src/modules/auth/guards/google-auth.guard.ts`
- **Controller**: `apps/auth/src/modules/auth/auth.controller.ts`
