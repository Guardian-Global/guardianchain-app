// components/layout/Layout.tsx — Themed Layout Wrapper
import { Helmet } from "react-helmet-async";
import Sidebar from "./Sidebar";
import Breadcrumbs from "./Breadcrumbs";
import MobileDrawer from "./MobileDrawer";
import TopbarCommandMenu from "./TopbarCommandMenu";
import PWAInstallButton from "../PWAInstallButton";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  tier?: string;
}

export default function Layout({
  children,
  title = "GuardianChain",
  tier = "guest",
}: LayoutProps) {
  return (
    <div className="min-h-screen bg-brand-secondary text-brand-light font-brand">
      <Helmet>
        <title>{title}</title>
        <meta name="theme-color" content="#3b82f6" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/assets/logo/GUARDIANCHAIN_logo.png" />
      </Helmet>
      <div className="flex">
        <Sidebar userTier={tier} />
        <MobileDrawer tier={tier} />
        <main className="flex-1">
          <div className="flex justify-between items-center px-6 pt-4">
            <Breadcrumbs />
            <div className="flex items-center gap-4">
              <TopbarCommandMenu tier={tier} />
              <PWAInstallButton />
            </div>
          </div>
          <div className="px-6 pb-10">{children}</div>
        </main>
      </div>
    </div>
  );
}
