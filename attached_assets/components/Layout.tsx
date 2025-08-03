// Layout.tsx — updated with GuardianMap nav link
import Link from "next/link";
export default function Layout({ children }) {
  return (
    <div>
      <nav className="bg-gray-900 text-white p-4 flex justify-between">
        <div className="text-xl font-bold">GuardianChain</div>
        <div className="space-x-4">
          <Link href="/">Home</Link>
          <Link href="/capsules">Capsules</Link>
          <Link href="/guardianmap" className="text-teal-400">🧭 GuardianMap</Link>
        </div>
      </nav>
      <main className="p-4">{children}</main>
    </div>
  );
}
