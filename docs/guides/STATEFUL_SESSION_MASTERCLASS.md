# Masterclass: Stateful Session & Token Strategy

This guide explains the dual-token storage strategy used for enterprise-level security and performance.

---

## 1. The Dual-Token Strategy
We use two different storage mechanisms to balance **speed** and **revocability**.

| Token Type | Storage | Tool | Lifespan | Benefit |
|------------|---------|------|----------|---------|
| **Access Token (AT)** | Redis | `ioredis` | Short (15m) | Instant Revocation (Blacklisting) |
| **Refresh Token (RT)** | Postgres | `Sequelize` | Long (7d) | Persistent Session History |

## 2. Access Tokens (Stateful JWT)
Normally JWTs are stateless. In this project, we make them **stateful** by adding a `jti` (JWT ID) and storing it in Redis.

**Method**: `AuthService.createAccessToken`
**Key**: `at:{userId}:{jti}`

```typescript
private async createAccessToken(userId: string): Promise<string> {
    const jti = crypto.randomUUID();
    const accessToken = generateToken({ id: userId, jti });
    await this.redisService.set(`at:${userId}:${jti}`, 'active', 900); // 15 mins
    return accessToken;
}
```

## 3. Refresh Tokens (Composite Security)
Refresh Tokens are stored in Postgres using a "Composite Token" strategy: `id.secret`.
- **ID**: Used for fast indexed lookup.
- **Secret**: Only the hash is stored in DB. The user receives the plain secret.

**Method**: `RefreshTokenService.createRefreshToken`
**Verification**: We compare the provided secret against the DB hash using `bcrypt`.

## 4. Token Rotation (Anti-Theft)
When a user refreshes their session:
1. The old Refresh Token is **revoked** (deleted from DB).
2. All Access Tokens for that specific session are cleared from Redis.
3. A brand new set of tokens is issued.
*This prevents attackers from using a stolen token after one use.*

## 5. Global Logout
When a user logs out:
1. `refreshTokenService.revokeAll(userId)` → Clears all Postgres entries.
2. `redisService.del(keys)` → Clears all stateful Access Tokens.
3. Browser cookies are cleared via `clearCookie(res, 'refreshToken')`.

---
**Ready to code?** Refer back to the [Google Login Masterclass](./GOOGLE_LOGIN_MASTERCLASS.md).
