import React, { lazy, Suspense, useEffect } from "react";
import { ErrorBoundary } from "./ErrorBoundary";
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

// Lazy load pages for better code splitting
const CompleteAuthPage = lazy(() => import("@/pages/auth/CompleteAuthPage"));
const PersonalizedOnboarding = lazy(() => import("@/pages/PersonalizedOnboarding"));
const BrandPartnerships = lazy(() => import("@/pages/BrandPartnerships"));
const GamificationDashboard = lazy(() => import("@/pages/GamificationDashboard"));
const MobileAppComingSoon = lazy(() => import("@/pages/MobileAppComingSoon"));
const ReferralDashboard = lazy(() => import("@/pages/ReferralDashboard"));
const AiAnalyticsDashboard = lazy(() => import("@/pages/AiAnalyticsDashboard"));
const ApiDashboard = lazy(() => import("@/pages/ApiDashboard"));
const EnterpriseDashboard = lazy(() => import("@/pages/EnterpriseDashboard"));
const StakingDashboard = lazy(() => import("@/pages/StakingDashboard"));
const Marketplace = lazy(() => import("@/pages/Marketplace"));
const CreateCapsule = lazy(() => import("@/pages/CreateCapsule"));
const BulkUpload = lazy(() => import("@/pages/BulkUpload"));
const Profile = lazy(() => import("@/pages/profile"));
const UltimateProfile = lazy(() => import("@/pages/UltimateProfile"));
const VeritasBadges = lazy(() => import("@/pages/VeritasBadges"));
const TruthGenome = lazy(() => import("@/pages/TruthGenome"));
const TruthNet = lazy(() => import("@/pages/TruthNet"));
const Explorer = lazy(() => import("@/pages/Explorer"));
const Start = lazy(() => import("@/pages/Start"));
const Terms = lazy(() => import("@/pages/Terms"));
const Pricing = lazy(() => import("@/pages/Pricing"));
const Subscribe = lazy(() => import("@/pages/subscribe"));
const Subscription = lazy(() => import("@/pages/Subscription"));
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
const SocialHub = lazy(() => import("@/pages/SocialHub"));
const CapsuleExplorer = lazy(() => import("@/pages/CapsuleExplorer"));
const CapsuleViewer = lazy(() => import("@/pages/CapsuleViewer"));
const CapsuleAnalyticsPage = lazy(() => import("./pages/CapsuleAnalyticsPage"));
const InvestorDemo = lazy(() => import("@/pages/demo"));
const SubmitCapsule = lazy(() => import("./pages/submit"));
const MintCapsule = lazy(() => import("./pages/mint/[id]"));
const AdminPage = lazy(() => import("./pages/admin"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const Admin = lazy(() => import("./pages/admin"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));
const CapsuleStats = lazy(() => import("./pages/CapsuleStats"));
const CapsuleBrowser = lazy(() => import("./pages/CapsuleBrowser"));
const CapsuleDetail = lazy(() => import("./pages/CapsuleDetail"));
const PublicProfile = lazy(() => import("./pages/PublicProfile"));
const Claim = lazy(() => import("./pages/Claim"));

// Lazy load debugging components
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
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-cyan-300 text-lg">Loading GuardianChain...</p>
          <p className="text-gray-400 text-sm mt-2">Initializing secure environment</p>
        </div>
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
          <ErrorBoundary>
            <Suspense
              fallback={
                <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black">
                  <div className="text-center">
                    <div className="animate-spin w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto mb-6 neural-pulse"></div>
                    <h2 className="text-2xl font-bold mb-2 text-cyan-300">Loading Component...</h2>
                    <p className="text-gray-400">Preparing your secure experience</p>
                    <div className="mt-4 text-xs text-gray-500">
                      If this takes too long, please check your network connection
                    </div>
                  </div>
                </div>
              }
            >
              <Switch>
              <Route path="/onboarding" component={OnboardingPage} />
              <Route path="/onboarding-legacy" component={NewUserOnboarding} />
              <Route path="/onboarding-personal" component={PersonalizedOnboarding} />
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
              <Route path="/settings" component={() => {
                const SettingsPage = lazy(() => import("./pages/Settings"));
                return <SettingsPage />;
              }} />
              <Route path="/admin-dashboard" component={AdminDashboard} />
              <Route path="/admin" component={Admin} />
              <Route path="/admin/sessions" component={() => {
                const AdminSessions = lazy(() => import("./pages/admin/sessions"));
                return <AdminSessions />;
              }} />
              <Route path="/mint/register-reward" component={() => {
                const RegisterReward = lazy(() => import("./pages/mint/RegisterReward"));
                return <RegisterReward />;
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
              <Route path="/subscription" component={Subscription} />
              <Route path="/checkout/:amount?/:description?" component={Checkout} />
              <Route path="/validator" component={ValidatorPage} />
              <Route path="/redeem" component={RedeemPage} />
              <Route path="/dao" component={DAO} />
              <Route path="/explorer/verifiers" component={VerifiersPage} />
              <Route path="/partners" component={PartnersPage} />
              <Route path="/brand-partnerships" component={BrandPartnerships} />
              <Route path="/rewards" component={GamificationDashboard} />
              <Route path="/mobile" component={MobileAppComingSoon} />
              <Route path="/referrals" component={ReferralDashboard} />
              <Route path="/ai-analytics" component={AiAnalyticsDashboard} />
              <Route path="/api-dashboard" component={ApiDashboard} />
              <Route path="/enterprise-dashboard" component={EnterpriseDashboard} />
              <Route path="/staking-dashboard" component={StakingDashboard} />
              <Route path="/marketplace" component={Marketplace} />
              <Route path="/analytics" component={AnalyticsPage} />
              <Route path="/vote" component={VotePage} />
              <Route path="/stream" component={StreamPage} />
              <Route path="/lineage" component={LineagePage} />
              <Route path="/rewards-page" component={RewardsPage} />
              <Route path="/metrics" component={MetricsPage} />
              <Route path="/staking" component={StakingPage} />
              <Route path="/audit" component={AuditPage} />
              <Route path="/vesting-dashboard" component={VestingDashboard} />

              {/* New comprehensive pages */}
              <Route path="/submit" component={SubmitCapsule} />
              <Route path="/mint/:id" component={MintCapsule} />
              <Route path="/veritas/vote" component={lazy(() => import("./pages/veritas/vote"))} />

              <Route path="/social" component={SocialHub} />
              <Route path="/social-hub" component={SocialHub} />
              <Route path="/explorer" component={CapsuleExplorer} />
              <Route path="/capsule/:id" component={CapsuleViewer} />
              <Route path="/capsule/:id/analytics" component={CapsuleAnalyticsPage} />
              <Route component={NotFound} />
              </Switch>
            </Suspense>
          </ErrorBoundary>
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

  // Runtime check for Tailwind/CSS loading
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const test = document.createElement('div');
      test.className = 'hidden text-[rgb(0,255,225)]';
      document.body.appendChild(test);
      const style = getComputedStyle(test).color;
      if (style !== 'rgb(0, 255, 225)') {
        // Show warning if Tailwind/critical CSS is missing
        const warn = document.createElement('div');
        warn.style.position = 'fixed';
        warn.style.top = '0';
        warn.style.left = '0';
        warn.style.right = '0';
        warn.style.zIndex = '9999';
        warn.style.background = '#ff00d4';
        warn.style.color = '#fff';
        warn.style.fontWeight = 'bold';
        warn.style.textAlign = 'center';
        warn.style.padding = '12px 0';
        warn.textContent = '⚠️ Critical CSS not loaded! Please check your deployment/build settings.';
        document.body.appendChild(warn);
      }
      document.body.removeChild(test);
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