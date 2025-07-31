# Replit Auth Integration Guide

## Implementation Status

The GUARDIANCHAIN platform now includes a complete Replit Auth integration framework with mock implementations that can be easily swapped for actual Replit Auth APIs.

## Quick Integration Steps

### 1. Install Replit Auth Package
```bash
npm install @replit/extensions
```

### 2. Replace Mock Implementations

#### In `utils/getUserTier.ts`:
```typescript
// Replace mock import with:
import { useAuth } from "@replit/extensions";

export function getUserTier(user: any): string {
  if (!user) return "guest";
  return user?.metadata?.tier || "guest";
}

export function useUserTier(): string {
  const { user } = useAuth();
  return getUserTier(user);
}
```

#### In `hooks/useReplitAuth.ts`:
```typescript
// Replace mock implementation with:
import { useAuth } from '@replit/extensions';
import { getUserTier } from '@/utils/getUserTier';

export function useReplitAuth(): UseReplitAuthReturn {
  const { user, isLoading } = useAuth();
  
  const tier: UserTier = user ? (getUserTier(user) as UserTier) : 'guest';
  const isAuthenticated = !!user;
  
  // Keep existing signIn, signOut, and redirectToTierDashboard functions
  // but use actual auth.signIn() and auth.signOut()
}
```

#### In `components/auth/AuthGate.tsx`:
```typescript
// Replace mock implementation with:
import { useAuth } from "@replit/extensions";

export default function AuthGate({ allowedRoles, children, fallback }: AuthGateProps) {
  const { user, isLoading } = useAuth();
  const [role, setRole] = useState("guest");

  useEffect(() => {
    if (!isLoading && user) {
      const tier = user?.metadata?.tier || "guest";
      setRole(tier);
      // Rest of the logic remains the same
    }
  }, [user, isLoading]);
  
  // Keep existing rendering logic
}
```

#### In `pages/login.tsx`:
```typescript
// Replace mock auth with:
import { useAuth } from '@replit/extensions';

const handleReplitLogin = async () => {
  const result = await auth.signIn();
  const userTier = result.user?.metadata?.tier || 'guest';
  const redirectRoute = getRedirectRouteForTier(userTier);
  window.location.href = redirectRoute;
};
```

### 3. Configure User Metadata

Ensure your Replit app can read/write user metadata for tier management:

```typescript
// Set user tier in Replit metadata
await replit.setUserMetadata(userId, { tier: 'pro' });

// Read user tier
const user = await replit.getCurrentUser();
const tier = user?.metadata?.tier || 'guest';
```

### 4. Update Environment Configuration

Add any required Replit Auth configuration to your environment:

```bash
# .env
REPLIT_APP_ID=your_app_id
REPLIT_CLIENT_SECRET=your_client_secret
```

## Architecture Overview

### Tier System
- **Guest**: Basic access to vault and view-only features
- **Pro**: Access to Veritas tools, capsule creation, dashboard
- **Admin**: Full access to all features including command center

### Route Protection
- Routes are automatically protected based on `routeAccessMap` in `utils/roleCheck.ts`
- Unauthorized access redirects to appropriate upgrade pages
- Component-level protection via `AuthGate` wrapper

### Access Flow
1. User authenticates via Replit Auth
2. Tier extracted from `user.metadata.tier`
3. Route access checked against permissions
4. Automatic redirection based on tier level

## Protected Routes

### Pro Access Required
- `/veritas-seal` - DocuSign legal verification
- `/truth-bounty` - Crowdsourced investigations
- `/truth-redemption` - Public accountability
- `/conspiracy-capsule` - Secure disclosures
- `/create-capsule` - Truth capsule creation
- `/dashboard` - User dashboard

### Admin Access Required
- `/admin` - Administration panel
- `/command` - Command center

### Public Routes
- `/vault` - Main landing page
- `/about` - About page
- `/pricing` - Pricing information

## Integration Benefits

1. **Seamless UX**: Single sign-on with Replit account
2. **Tier Management**: Automatic tier detection from metadata
3. **Feature Gating**: Professional upgrade prompts for restricted features
4. **Security**: Proper role-based access control
5. **Scalability**: Easy to add new tiers and permissions

## Testing

The current mock implementation allows full testing of the auth flow without requiring actual Replit Auth setup. Simply replace the mock functions with real Replit Auth calls when ready to deploy.

## Next Steps

1. Install `@replit/extensions` package
2. Replace mock implementations with actual Replit Auth calls
3. Configure user metadata management
4. Test tier-based access control
5. Deploy with full Replit Auth integration

The framework is designed for zero-disruption integration - all existing functionality remains intact while adding enterprise-grade authentication.