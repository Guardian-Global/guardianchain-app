# Orphan Components Audit Report
Generated: 2025-08-06

## Scan Results

### Files with Suspicious Names
Finding files with keywords: test, dummy, old, backup, deprecated, copy, unused

### Protected Files (NOT ARCHIVED)
These files are protected and will NOT be moved:
- Any file in `/components/layout`, `/capsules`, `/vault`, `/truth`, `/dashboard`, `/mint`
- Files with prefixes: `veritas`, `guardian`, `truth`, `sealchain`, `vaultstream`, `yield`, `gtt`, `stripe`, `submission`, `auth`, `ai`
- Layout files: `layout.tsx`, `_app.tsx`, `_document.tsx`, `middleware.ts`, `app.tsx`
- Environment and config files

## ARCHIVED FILES (Moved to /archive/)

### Test Pages (4 files archived)
- `client/src/pages/asset-test.tsx` → ARCHIVED (not in routing)
- `client/src/pages/simple-test.tsx` → ARCHIVED (not in routing) 
- `client/src/pages/minting-test.tsx` → ARCHIVED (not in routing)
- `scripts/backupCapsules.ts` → ARCHIVED (backup script)

### Unused Assets (20+ files archived)
- All .zip export files from attached_assets/ → ARCHIVED
- All "Pasted-*" text files → ARCHIVED
- Old export backups and temporary files → ARCHIVED

## PROTECTED FILES (NOT TOUCHED)
✅ All layout files preserved
✅ All veritas/guardian/truth/capsule components preserved
✅ App.tsx and routing intact
✅ Authentication system intact
✅ Database schema preserved