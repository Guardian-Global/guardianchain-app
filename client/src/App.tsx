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
// Optional pages (kept lazy, routes added below only if needed)
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

// Additional lazy-loaded components for comprehensive functionality
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

// Lazy load common pages
const CreateCapsule = lazy(() => import("@/pages/CreateCapsule"));
const BulkUpload = lazy(() => import("@/pages/BulkUpload"));
// Settings imported dynamically to avoid conflicts
// Use exact casing to avoid duplicate module entries on case-sensitive FS
const Profile = lazy(() => import("@/pages/Profile"));
const UltimateProfile = lazy(() => import("@/pages/UltimateProfile"));
const VeritasBadges = lazy(() => import("@/pages/VeritasBadges"));
const TruthGenome = lazy(() => import("@/pages/TruthGenome"));
const TruthNet = lazy(() => import("@/pages/TruthNet"));
const Explorer = lazy(() => import("@/pages/Explorer"));
const Start = lazy(() => import("@/pages/Start"));
const Terms = lazy(() => import("@/pages/Terms"));
const Pricing = lazy(() => import("@/pages/Pricing"));
const Subscribe = lazy(() => import("@/pages/Subscribe"));
const Subscription = lazy(() => import("@/pages/Subscription"));
const Checkout = lazy(() => import("@/pages/checkout"));
const Tokenomics = lazy(() => import("@/pages/Tokenomics"));
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
const AdminPage = lazy(() => import("./pages/Admin"));

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
          <ErrorBoundary>
            <Suspense
              fallback={
                <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black">
                  <div className="text-center">
                    <div className="animate-spin w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto mb-6 neural-pulse"></div>
                    <h2 className="text-2xl font-bold mb-2 text-cyan-300">Loading GuardianChain...</h2>
                    <p className="text-gray-400">Please wait while we load the next-gen experience.</p>
                    <div className="mt-4 text-xs text-gray-500">
                      If this takes too long, try refreshing the page.
                    </div>
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
              {/* Wrap Subscribe to match Route's expected signature */}
              <Route path="/subscribe" component={() => <Subscribe />} />
              <Route path="/subscription" component={Subscription} />
              {/* Parse params and pass to Checkout as props */}
              <Route path="/checkout/:amount?/:description?" component={({ params }) => {
                const amount = params?.amount ? Number(params.amount) : undefined;
                const description = params?.description;
                return <Checkout amount={amount} description={description} />;
              }} />
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
              
              {/* Additional comprehensive routes */}
              <Route path="/onboarding-personal" component={PersonalizedOnboarding} />
              <Route path="/partners" component={BrandPartnerships} />
              <Route path="/rewards" component={GamificationDashboard} />
              <Route path="/mobile" component={MobileAppComingSoon} />
              <Route path="/referrals" component={ReferralDashboard} />
              <Route path="/ai-analytics" component={AiAnalyticsDashboard} />
              <Route path="/api-dashboard" component={ApiDashboard} />
              <Route path="/enterprise-dashboard" component={EnterpriseDashboard} />
              <Route path="/staking-dashboard" component={StakingDashboard} />
              <Route path="/marketplace" component={Marketplace} />

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
  // Add a safety timeout to prevent blank screens
  const [appReady, setAppReady] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    // Set a timeout to show a fallback if the app doesn't load
    const timeout = setTimeout(() => {
      if (!appReady) {
        console.warn('App loading timeout - showing fallback UI');
        setHasError(true);
      }
    }, 10000); // 10 second timeout

    // Mark app as ready after initial render
    const readyTimeout = setTimeout(() => {
      setAppReady(true);
    }, 100);

    return () => {
      clearTimeout(timeout);
      clearTimeout(readyTimeout);
    };
  }, [appReady]);

  // Initialize safe Web3 provider without auto-connecting
  React.useEffect(() => {
    import("./lib/web3/safeProvider")
      .then(({ safeWeb3Provider }) => {
        safeWeb3Provider.safeInit().catch(console.warn);
      })
      .catch((err) => {
        console.warn('Failed to initialize Web3 provider:', err);
      });
  }, []);

  // Service worker is registered centrally via registerServiceWorker() in main.tsx

  // Runtime check for Tailwind/CSS loading
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const test = document.createElement('div');
      test.className = 'sr-only';
      test.style.position = 'absolute';
      test.style.opacity = '0';
      test.style.pointerEvents = 'none';
      document.body.appendChild(test);
      
      // Check if Tailwind's sr-only class is working
      const computedStyle = getComputedStyle(test);
      const isTailwindLoaded = computedStyle.position === 'absolute' && 
                              (computedStyle.width === '1px' || computedStyle.clip !== 'auto');
      
      if (!isTailwindLoaded) {
        // Only show warning in development or if there's a real CSS issue
        const isDevMode = import.meta.env.MODE === 'development';
        const hasStyledElements = document.querySelector('.bg-gradient-to-br, .text-cyan-300, .border-cyan-400');
        
        if (isDevMode || !hasStyledElements) {
          console.warn('⚠️ Tailwind CSS may not be fully loaded');
          // Only show warning banner in development
          if (isDevMode) {
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
            warn.style.padding = '8px 0';
            warn.style.fontSize = '14px';
            warn.textContent = '⚠️ Development: Checking CSS loading...';
            document.body.appendChild(warn);
            
            // Remove warning after 3 seconds if page is working
            setTimeout(() => {
              if (warn.parentNode) {
                warn.parentNode.removeChild(warn);
              }
            }, 3000);
          }
        }
      }
      document.body.removeChild(test);
    }
  }, []);

  // Show fallback UI if there's an error
  if (hasError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black flex items-center justify-center text-white">
        <div className="text-center max-w-md p-8">
          <h1 className="text-3xl font-bold mb-4">🔄 Loading Issue Detected</h1>
          <p className="text-gray-300 mb-6">
            The app is taking longer than expected to load. This might be due to network issues or heavy traffic.
          </p>
          <div className="space-y-3">
            <button 
              onClick={() => window.location.reload()} 
              className="w-full px-6 py-3 bg-cyan-600 hover:bg-cyan-700 rounded-lg font-medium transition-colors"
            >
              🔄 Refresh Page
            </button>
            <button 
              onClick={() => {setHasError(false); setAppReady(false);}} 
              className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
            >
              🚀 Try Again
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            If the issue persists, please check your internet connection.
          </p>
        </div>
      </div>
    );
  }

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