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
// Replace mock implementation with:
import { useEffect } from "react";
import { useAuth } from "@replit/extensions";
import { getUserTier } from "@/utils/getUserTier";

export default function LoginPage() {
  const { user, isLoading, login } = useAuth();

  useEffect(() => {
    if (!user && !isLoading) {
      login();
    } else if (user) {
      const tier = getUserTier(user);
      if (tier === "admin") window.location.href = "/command";
      else if (tier === "pro") window.location.href = "/dashboard";
      else window.location.href = "/vault";
    }
  }, [user, isLoading, login]);

  return <div className="text-center pt-20 text-lg">Redirecting you based on your access tier...</div>;
}
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

### 4. Configure User Tier Management

Use the provided `assignUserTier` utilities for tier management:

```typescript
import { assignUserTier, fetchUserTier, updateUserTier } from '@/utils/assignUserTier';

// Assign tier to new user
await assignUserTier(user.id, 'pro');

// Fetch existing tier
const tier = await fetchUserTier(user.id);

// Update tier (for upgrades)
await updateUserTier(user.id, 'admin');
```

### 5. Update Environment Configuration

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