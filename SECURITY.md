# Security Best Practices for StackMart

## .env File Security ✅

Your `.env` file is properly secured:

- ✅ **Git Ignored**: `.env` is in `.gitignore` and will never be committed
- ✅ **File Permissions**: Set to `600` (read/write for owner only)
- ✅ **Not Tracked**: Verified that no `.env` files are in git history
- ✅ **Single Location**: Only one `.env` file in project root

## Current Security Status

### Protected Files
- `.env` - Contains private keys and secrets
- `settings/Mainnet.toml` - Contains deployment configuration
- `settings/Testnet.toml` - Contains testnet configuration

### What's Safe to Commit
- Contract code (`contracts/*.clar`)
- Frontend code (`frontend/src/`)
- Configuration templates (without secrets)
- Documentation

## Security Recommendations

### 1. Private Key Management
- ✅ **Current**: Private key stored in `.env` (local only)
- ⚠️ **For Production**: Consider using:
  - Hardware wallets
  - Key management services (AWS Secrets Manager, HashiCorp Vault)
  - Environment variables in deployment platform
  - Encrypted storage

### 2. Deployment Keys
- Use **separate keys** for different environments (testnet vs mainnet)
- Never use your main wallet key for deployments
- Consider using a dedicated deployment account

### 3. Chainhook Security
- Set `CHAINHOOK_SECRET` in chainhook server
- Use HTTPS for webhook endpoints
- Verify webhook signatures

### 4. Frontend Environment Variables
- Use `VITE_` prefix for public variables (they're exposed in bundle)
- Never put private keys in frontend `.env` files
- Use backend API for sensitive operations

## Quick Security Check

Run this to verify your setup:
```bash
# Check .env is ignored
git check-ignore .env && echo "✅ .env ignored"

# Check permissions
ls -la .env | grep "^-rw-------" && echo "✅ Secure permissions"

# Check not tracked
git ls-files | grep -q "\.env" || echo "✅ Not in git"
```

## What to Do If .env is Exposed

1. **Immediately rotate all keys** in the exposed `.env`
2. **Check git history**: `git log --all --full-history -- .env`
3. **Remove from history** if committed (requires force push)
4. **Revoke and regenerate** all API keys and secrets
5. **Monitor** accounts for unauthorized activity

## Best Practices Going Forward

1. ✅ Always check `.gitignore` before committing
2. ✅ Use `git status` to verify no sensitive files are staged
3. ✅ Never commit files with `.env`, `key`, `secret`, `password` in name
4. ✅ Use environment variables in CI/CD instead of files
5. ✅ Regularly audit what's in your git repository


