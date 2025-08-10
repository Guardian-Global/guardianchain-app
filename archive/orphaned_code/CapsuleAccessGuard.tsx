// Archived due to Vercel/Vite build error: next-auth/react is not available in this project.
// If you need authentication, use a Vite-compatible solution or restore this file with proper dependencies.

"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

type Props = {
	children: ReactNode;
	requiredTier?: "admin" | "creator" | "member";
};

export default function CapsuleAccessGuard({ children, requiredTier = "admin" }: Props) {
	const { data: session, status } = useSession();
	const router = useRouter();

	useEffect(() => {
		if (status === "loading") return;

		const tier = session?.user?.tier || "guest";
		if (requiredTier === "admin" && tier !== "admin") {
			router.push("/unauthorized?reason=admin-required");
		} else if (requiredTier === "creator" && !["creator", "admin"].includes(tier)) {
			router.push("/unauthorized?reason=creator-tier-required");
		}
	}, [status, session, requiredTier, router]);

	if (status === "loading") {
		return <div className="p-4 text-gray-500">Validating session...</div>;
	}

	return <>{children}</>;
}
