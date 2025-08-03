// NavSidebar.tsx — GuardianChain Elite Sidebar
import Link from "next/link";
import { useRouter } from "next/router";

const navItems = [
  { label: "Capsules", href: "/capsules", icon: "📦" },
  { label: "Lineage", href: "/lineage/map", icon: "🧬" },
  { label: "Yield", href: "/gtt/vault", icon: "💰" },
  { label: "SMRI", href: "/smri/me", icon: "📊" },
  { label: "DAO", href: "/dao", icon: "🗳" },
  { label: "Certificates", href: "/certificates", icon: "📜" },
  { label: "GuardianMap", href: "/guardianmap", icon: "🗺" },
  { label: "Docs", href: "/docs/how-it-works", icon: "📚" },
];

export default function NavSidebar() {
  const router = useRouter();
  return (
    <aside className="w-60 h-screen bg-slate-900 text-white flex flex-col p-4 space-y-2">
      <div className="font-extrabold text-lg mb-4">⚔️ GuardianChain</div>
      {navItems.map(({ label, href, icon }) => (
        <Link key={href} href={href} className={\`p-2 rounded hover:bg-slate-700 \${router.pathname.startsWith(href) ? "bg-slate-800 font-bold" : ""}\`}>
          {icon} {label}
        </Link>
      ))}
    </aside>
  );
}
