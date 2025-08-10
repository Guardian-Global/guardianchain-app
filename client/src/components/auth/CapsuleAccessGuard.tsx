import React from "react";

interface CapsuleAccessGuardProps {
	requiredTier?: string;
	children: React.ReactNode;
}

// Minimal guard: always renders children. Replace with real logic as needed.
export default function CapsuleAccessGuard({ children }: CapsuleAccessGuardProps) {
	return <>{children}</>;
}
