// Topbar.tsx — GuardianChain Role-Aware Topbar
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Topbar() {
  const { data: session } = useSession();
  const role = session?.user?.role || "guest";

  return (
    <header className="w-full bg-white border-b shadow-sm px-6 py-3 flex justify-between items-center">
      <Link href="/" className="font-bold text-lg">🔐 GuardianChain</Link>
      <div className="space-x-4">
        <Link href="/create" className="btn btn-primary">🚀 Launch Capsule</Link>
        <Link href="/onboarding" className="text-blue-600 underline">Walkthrough</Link>
        {session ? (
          <span className="text-sm text-gray-600">Welcome, {role}</span>
        ) : (
          <Link href="/auth/signin" className="text-blue-500">Sign In</Link>
        )}
      </div>
    </header>
  );
}
