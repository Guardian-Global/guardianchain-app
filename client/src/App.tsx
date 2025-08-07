import React, { lazy, Suspense, useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { initializeWeb3Provider } from "@/lib/web3Provider";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NotificationProvider } from "@/components/ui/notification-system";
import { ThemeProvider } from "@/components/web3/theme-provider";
import WalletProvider from "@/components/providers/WalletProvider";
import { AssetProvider } from "@/components/assets/AssetProvider";
import EliteLayout from "@/components/layout/EliteLayout";
import OfflineIndicator from "@/components/OfflineIndicator";
import { LiveTokenTracker } from "@/components/live/LiveTokenTracker";
import WelcomeTour from "@/components/WelcomeTour";
import { GuardianBootHook } from "@/components/GuardianBootHook";
import EliteHomepage from "@/pages/EliteHomepage";
import CyberHomepage from "@/pages/CyberHomepage";
import EnhancedDashboard from "@/pages/EnhancedDashboard";
import { useAuth } from "./hooks/useAuth";
import { HelmetProvider } from "react-helmet-async";
import { TierProvider } from "./context/TierContext";
import { MascotProvider } from "./components/mascot/MascotProvider";
import { HelpProvider } from "@/components/help/HelpProvider";
import OnboardingProvider from "./components/onboarding/OnboardingProvider";

// Direct import auth pages to avoid suspension issues
import Signup from "@/pages/auth/Signup";
import Login from "@/pages/auth/Login";
import SimpleLanding from "@/pages/SimpleLanding";

// Complete Authentication System Import
const CompleteAuthPage = lazy(() => import("@/pages/auth/CompleteAuthPage"));

// Lazy load common pages
const CreateCapsule = lazy(() => import("@/pages/CreateCapsule"));
const BulkUpload = lazy(() => import("@/pages/BulkUpload"));
const Settings = lazy(() => import("@/pages/Settings"));
const ProfileOld = lazy(() => import("@/pages/profile"));
const Profile = lazy(() => import("@/pages/Profile"));
const UltimateProfile = lazy(() => import("@/pages/UltimateProfile"));
const VeritasBadges = lazy(() => import("@/pages/VeritasBadges"));
const TruthGenome = lazy(() => import("@/pages/TruthGenome"));
const TruthNet = lazy(() => import("@/pages/TruthNet"));
const Explorer = lazy(() => import("@/pages/Explorer"));
const Start = lazy(() => import("@/pages/Start"));
const Terms = lazy(() => import("@/pages/Terms"));
const Pricing = lazy(() => import("@/pages/Pricing"));
const Subscribe = lazy(() => import("@/pages/subscribe"));
const Checkout = lazy(() => import("@/pages/checkout"));
const Tokenomics = lazy(() => import("@/pages/tokenomics"));
const LandingPage = lazy(() => import("@/pages/landing"));
const WhitepaperPage = lazy(() => import("@/pages/whitepaper"));
const CapsuleRemixPage = lazy(() => import("@/pages/capsule/remix"));
const RevenueExplainer = lazy(() => import("@/pages/RevenueExplainer"));
const ValidatorPage = lazy(() => import("@/pages/ValidatorPage"));
const RedeemPage = lazy(() => import("@/pages/RedeemPage"));
const VerifiersPage = lazy(() => import("@/pages/explorer/VerifiersPage"));
const PartnersPage = lazy(() => import("@/pages/PartnersPage"));
const DAO = lazy(() => import("@/pages/DAO"));
// Consolidated master pages
const VaultClean = lazy(() => import("@/pages/vault-clean"));
const AdminMetrics = lazy(() => import("@/pages/admin-metrics"));
const AnalyticsPage = lazy(() => import("@/pages/analytics"));
const VotePage = lazy(() => import("@/pages/Vote"));
const StreamPage = lazy(() => import("@/pages/Stream"));
const LineagePage = lazy(() => import("@/pages/Lineage"));
const RewardsPage = lazy(() => import("@/pages/Rewards"));
const MetricsPage = lazy(() => import("@/pages/Metrics"));
const StakingPage = lazy(() => import("@/pages/Staking"));
const AuditPage = lazy(() => import("@/pages/Audit"));
const NewUserOnboarding = lazy(() => import("@/pages/NewUserOnboarding"));
const OnboardingPage = lazy(() => import("@/pages/OnboardingPage"));
const VestingDashboard = lazy(() => import("@/pages/VestingDashboard"));
// ViralShowcase archived during consolidation
const SocialHub = lazy(() => import("@/pages/SocialHub"));
const CapsuleExplorer = lazy(() => import("@/pages/CapsuleExplorer"));
const CapsuleViewer = lazy(() => import("@/pages/CapsuleViewer"));
// CapsuleAnalyticsDemo moved to archive during consolidation
const CapsuleAnalyticsPage = lazy(() => import("./pages/CapsuleAnalyticsPage"));
const InvestorDemo = lazy(() => import("@/pages/demo"));

// New comprehensive pages
const SubmitCapsule = lazy(() => import("./pages/submit"));
const MintCapsule = lazy(() => import("./pages/mint/[id]"));
const AdminPage = lazy(() => import("./pages/admin"));

const NotFound = lazy(() => import("./pages/NotFound"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));
const CapsuleStats = lazy(() => import("./pages/CapsuleStats"));
const CapsuleBrowser = lazy(() => import("./pages/CapsuleBrowser"));
const CapsuleDetail = lazy(() => import("./pages/CapsuleDetail"));
const PublicProfile = lazy(() => import("./pages/PublicProfile"));
const Claim = lazy(() => import("./pages/Claim"));
const GuardianMascotFooter = lazy(() => import("@/components/GuardianMascotFooter"));
const GuardianMascot = lazy(() => import("@/components/GuardianMascot"));

const AuthDebugPanel = lazy(() => import("@/components/auth/AuthDebugPanel"));
const OnboardingStatusChecker = lazy(() => import("@/components/onboarding/OnboardingStatusChecker"));
const ComprehensiveAuthFlow = lazy(() => import("@/components/auth/ComprehensiveAuthFlow"));
const FullAppDebugger = lazy(() => import("@/components/debug/FullAppDebugger"));
const PWAInstallPrompt = lazy(() => import("@/components/ui/PWAInstallPrompt"));

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-hsl(218,54%,9%) via-hsl(220,39%,11%) to-hsl(222,47%,11%) flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  // Show authentication pages for unauthenticated users
  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/auth/signup" component={Signup} />
        <Route path="/auth/login" component={Login} />
        <Route path="/demo" component={InvestorDemo} />
        <Route path="/terms" component={Terms} />
        <Route path="*" component={SimpleLanding} />
      </Switch>
    );
  }

  return (
    <Switch>
      {/* Homepage - Full screen without layout */}
      <Route path="/" component={CyberHomepage} />
      <Route path="/elite" component={EliteHomepage} />
      <Route path="/demo" component={InvestorDemo} />
      
      {/* All other routes get the layout wrapper */}
      <Route>
        <EliteLayout>
          <WelcomeTour />
          <LiveTokenTracker position="top" />
          <PWAInstallPrompt />
          <Suspense
            fallback={
              <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                  <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p>Loading...</p>
                </div>
              </div>
            }
          >
            <Switch>
              <Route path="/onboarding" component={OnboardingPage} />
              <Route path="/onboarding-legacy" component={NewUserOnboarding} />
              <Route path="/dashboard" component={EnhancedDashboard} />
              <Route path="/vault" component={VaultClean} />
              <Route path="/admin/metrics" component={AdminMetrics} />
              <Route path="/valuation" component={lazy(() => import("@/pages/valuation"))} />
              <Route path="/tokenomics" component={Tokenomics} />
              <Route path="/landing" component={LandingPage} />
              <Route path="/whitepaper" component={WhitepaperPage} />
              <Route path="/capsule/:id/remix" component={CapsuleRemixPage} />
              <Route path="/revenue-explainer" component={RevenueExplainer} />
              <Route path="/create" component={CreateCapsule} />
              <Route path="/bulk-upload" component={BulkUpload} />
              <Route path="/profile" component={Profile} />
              <Route path="/profile/ultimate" component={UltimateProfile} />
              <Route path="/profile/:username" component={PublicProfile} />
              <Route path="/badges" component={VeritasBadges} />
              <Route path="/veritas-badges" component={VeritasBadges} />
              <Route path="/settings" component={Settings} />
              <Route path="/admin-dashboard" component={AdminDashboard} />
              <Route path="/admin" component={Admin} />
              <Route path="/admin/sessions" component={() => {
                const AdminSessions = lazy(() => import("./pages/admin/sessions"));
                return <AdminSessions />;
              }} />
              <Route path="/admin/panel" component={AdminPanel} />
              <Route path="/capsule-stats" component={CapsuleStats} />
              <Route path="/capsule-browser" component={CapsuleBrowser} />
              <Route path="/claim" component={Claim} />
              <Route path="/truth-genome" component={TruthGenome} />
              <Route path="/truth-net" component={TruthNet} />
              <Route path="/start" component={Start} />
              <Route path="/terms" component={Terms} />
              <Route path="/pricing" component={Pricing} />
              <Route path="/subscribe" component={Subscribe} />
              <Route path="/checkout/:amount?/:description?" component={Checkout} />
              <Route path="/validator" component={ValidatorPage} />
              <Route path="/redeem" component={RedeemPage} />
              <Route path="/dao" component={DAO} />
              <Route path="/explorer/verifiers" component={VerifiersPage} />
              <Route path="/partners" component={PartnersPage} />
              <Route path="/analytics" component={AnalyticsPage} />
              <Route path="/vote" component={VotePage} />
              <Route path="/stream" component={StreamPage} />
              <Route path="/lineage" component={LineagePage} />
              <Route path="/rewards" component={RewardsPage} />
              <Route path="/metrics" component={MetricsPage} />
              <Route path="/staking" component={StakingPage} />
              <Route path="/audit" component={AuditPage} />
              <Route path="/vesting-dashboard" component={VestingDashboard} />

              {/* New comprehensive pages */}
              <Route path="/submit" component={SubmitCapsule} />
              <Route path="/mint/:id" component={MintCapsule} />
              <Route path="/admin" component={AdminPage} />
              <Route path="/veritas/vote" component={lazy(() => import("./pages/veritas/vote"))} />

              <Route path="/social" component={SocialHub} />
              <Route path="/social-hub" component={SocialHub} />
              <Route path="/explorer" component={CapsuleExplorer} />
              <Route path="/capsule/:id" component={CapsuleViewer} />
              <Route path="/capsule/:id/analytics" component={CapsuleAnalyticsPage} />
              {/* Analytics demo route removed during consolidation */}
              <Route path="/dao" component={DAO} />
              <Route path="/profile" component={Profile} />
              <Route path="/settings" component={Settings} />
              <Route component={NotFound} />
            </Switch>
          </Suspense>
        </EliteLayout>
      </Route>
    </Switch>
  );
}

export default function App() {
  // Initialize safe Web3 provider without auto-connecting
  import("./lib/web3/safeProvider").then(({ safeWeb3Provider }) => {
    safeWeb3Provider.safeInit().catch(console.warn);
  });

  // Register service worker for PWA features
  React.useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        if (location.protocol === 'https:' || location.hostname === 'localhost') {
          navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('✅ Service Worker registered:', registration);
          }).catch(err => {
            console.warn('❌ Service Worker registration failed:', err);
          });
        } else {
          console.warn('⚠️ Skipping service worker — insecure origin');
        }
      });
    }
  }, []);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TierProvider>
          <OnboardingProvider>
            <HelpProvider>
              <MascotProvider>
                <WalletProvider>
                  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                    <AssetProvider>
                      <TooltipProvider>
                        <NotificationProvider>
                          <main className="flex-1">
                            <Router />
                            <PWAInstallPrompt />
                            <OfflineIndicator />
                          </main>
                          
                          {/* Guardian Mascot - Available on all pages */}
                          <Suspense fallback={null}>
                            <GuardianMascot />
                          </Suspense>
                          

                          
                          {/* Auth Debug Panel for development */}
                          <Suspense fallback={null}>
                            <AuthDebugPanel />
                          </Suspense>
                          
                          {/* Comprehensive Authentication Flow */}
                          <Suspense fallback={null}>
                            <ComprehensiveAuthFlow />
                          </Suspense>
                          
                          {/* Onboarding Status Checker */}
                          <Suspense fallback={null}>
                            <OnboardingStatusChecker />
                          </Suspense>

                          {/* Full App Debugger */}
                          <Suspense fallback={null}>
                            <FullAppDebugger />
                          </Suspense>
                          <Suspense fallback={<div className="h-20 bg-slate-900" />}>
                            <GuardianMascotFooter />
                          </Suspense>
                        </NotificationProvider>
                        <Toaster />
                      </TooltipProvider>
                    </AssetProvider>
                  </ThemeProvider>
                </WalletProvider>
              </MascotProvider>
            </HelpProvider>
          </OnboardingProvider>
        </TierProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}