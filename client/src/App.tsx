import React, { lazy, Suspense } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NotificationProvider } from "@/components/ui/notification-system";
import { ThemeProvider } from "@/components/web3/theme-provider";
import WalletProvider from "@/components/providers/WalletProvider";
import { AssetProvider } from "@/components/assets/AssetProvider";
import EliteLayout from "@/components/layout/EliteLayout";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
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

// Lazy load common pages
const CreateCapsule = lazy(() => import("@/pages/CreateCapsule"));
const BulkUpload = lazy(() => import("@/pages/BulkUpload"));
const Profile = lazy(() => import("@/pages/profile"));
const UltimateProfile = lazy(() => import("@/pages/UltimateProfile"));
const TruthGenome = lazy(() => import("@/pages/TruthGenome"));
const TruthNet = lazy(() => import("@/pages/TruthNet"));
const Explorer = lazy(() => import("@/pages/explorer"));
const Start = lazy(() => import("@/pages/Start"));
const Terms = lazy(() => import("@/pages/terms"));
const Pricing = lazy(() => import("@/pages/pricing"));
const Subscribe = lazy(() => import("@/pages/Subscribe"));
const EnterpriseCenter = lazy(() => import("@/pages/EnterpriseCenter"));
const Tokenomics = lazy(() => import("@/pages/tokenomics"));
const RevenueExplainer = lazy(() => import("@/pages/RevenueExplainer"));
const ValidatorPage = lazy(() => import("@/pages/ValidatorPage"));
const RedeemPage = lazy(() => import("@/pages/RedeemPage"));
const VerifiersPage = lazy(() => import("@/pages/explorer/VerifiersPage"));
const PartnersPage = lazy(() => import("@/pages/PartnersPage"));
const DAO = lazy(() => import("@/pages/DAO"));
const EnhancedProfilePage = lazy(() => import("@/pages/enhanced-profile"));
const AdminTimelineView = lazy(() => import("@/pages/admin-timeline"));
const AnalyticsPage = lazy(() => import("@/pages/analytics"));
const VotePage = lazy(() => import("@/pages/Vote"));
const StreamPage = lazy(() => import("@/pages/Stream"));
const LineagePage = lazy(() => import("@/pages/Lineage"));
const RewardsPage = lazy(() => import("@/pages/Rewards"));
const MetricsPage = lazy(() => import("@/pages/Metrics"));
const StakingPage = lazy(() => import("@/pages/Staking"));
const AuditPage = lazy(() => import("@/pages/Audit"));
const NewUserOnboarding = lazy(() => import("@/pages/NewUserOnboarding"));
const ViralShowcase = lazy(() => import("@/pages/ViralShowcase"));
const SocialHub = lazy(() => import("@/pages/SocialHub"));
const CapsuleExplorer = lazy(() => import("@/pages/CapsuleExplorer"));
const CapsuleViewer = lazy(() => import("@/pages/CapsuleViewer"));
const NotFound = lazy(() => import("./pages/NotFound"));
const GuardianMascotFooter = lazy(() => import("@/components/GuardianMascotFooter"));
const GuardianMascot = lazy(() => import("@/components/GuardianMascot"));
const MascotDebug = lazy(() => import("@/components/MascotDebug"));
const AuthDebugPanel = lazy(() => import("@/components/auth/AuthDebugPanel"));
const OnboardingStatusChecker = lazy(() => import("@/components/onboarding/OnboardingStatusChecker"));
const ComprehensiveAuthFlow = lazy(() => import("@/components/auth/ComprehensiveAuthFlow"));
const FullAppDebugger = lazy(() => import("@/components/debug/FullAppDebugger"));

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  // Show landing page for unauthenticated users
  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/" component={() => import("@/pages/LandingPage").then(m => m.default)} />
        <Route path="/onboarding" component={() => import("@/pages/OnboardingFlow").then(m => m.default)} />
        <Route path="/login" component={() => import("@/pages/LoginPage").then(m => m.default)} />
        <Route path="/elite" component={EliteHomepage} />
        <Route path="/explorer" component={Explorer} />
        <Route path="/terms" component={Terms} />
        <Route path="/start" component={Start} />
        <Route path="/pricing" component={Pricing} />
        <Route path="/subscribe/:tier" component={Subscribe} />
        <Route component={() => import("@/pages/LandingPage").then(m => m.default)} />
      </Switch>
    );
  }

  return (
    <Switch>
      {/* Homepage - Full screen without layout */}
      <Route path="/" component={CyberHomepage} />
      <Route path="/elite" component={EliteHomepage} />
      
      {/* All other routes get the layout wrapper */}
      <Route>
        <EliteLayout>
          <WelcomeTour />
          <LiveTokenTracker position="top" />
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
              <Route path="/enhanced-onboarding" component={() => import("@/pages/enhanced-onboarding").then(m => m.default)} />
              <Route path="/dashboard" component={EnhancedDashboard} />
              <Route path="/enterprise" component={EnterpriseCenter} />
              <Route path="/tokenomics" component={Tokenomics} />
              <Route path="/revenue-explainer" component={RevenueExplainer} />
              <Route path="/create" component={CreateCapsule} />
              <Route path="/bulk-upload" component={BulkUpload} />
              <Route path="/profile" component={Profile} />
              <Route path="/profile/ultimate" component={UltimateProfile} />
              <Route path="/profile/enhanced" component={EnhancedProfilePage} />
              <Route path="/truth-genome" component={TruthGenome} />
              <Route path="/truth-net" component={TruthNet} />
              <Route path="/start" component={Start} />
              <Route path="/terms" component={Terms} />
              <Route path="/pricing" component={Pricing} />
              <Route path="/subscribe/:tier" component={Subscribe} />
              <Route path="/validator" component={ValidatorPage} />
              <Route path="/redeem" component={RedeemPage} />
              <Route path="/dao" component={DAO} />
              <Route path="/profile" component={EnhancedProfilePage} />
              <Route path="/explorer/verifiers" component={VerifiersPage} />
              <Route path="/partners" component={PartnersPage} />
              <Route path="/admin/timeline" component={AdminTimelineView} />
              <Route path="/analytics" component={AnalyticsPage} />
              <Route path="/vote" component={VotePage} />
              <Route path="/stream" component={StreamPage} />
              <Route path="/lineage" component={LineagePage} />
              <Route path="/rewards" component={RewardsPage} />
              <Route path="/metrics" component={MetricsPage} />
              <Route path="/staking" component={StakingPage} />
              <Route path="/audit" component={AuditPage} />
              <Route path="/onboarding" component={NewUserOnboarding} />
              <Route path="/viral-showcase" component={ViralShowcase} />
              <Route path="/social" component={SocialHub} />
              <Route path="/explorer" component={CapsuleExplorer} />
              <Route path="/capsule/:id" component={CapsuleViewer} />
              <Route path="/test-preview" component={() => import("@/pages/CapsulePreviewTest").then(m => m.default)} />
              <Route path="/enhancements" component={() => import("@/pages/EnhancementShowcase").then(m => m.default)} />
              <Route path="/profile" component={() => import("@/pages/UserProfile").then(m => m.default)} />
              <Route path="/social-profile">
                {() => {
                  const EnhancedSocialProfile = lazy(() => import("@/components/profile/EnhancedSocialProfile").then(m => ({ default: m.EnhancedSocialProfile })));
                  return <EnhancedSocialProfile />;
                }}
              </Route>
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
                          <GuardianBootHook />
                          <main className="flex-1">
                            <Router />
                            <PWAInstallPrompt />
                            <OfflineIndicator />
                          </main>
                          
                          {/* Guardian Mascot - Available on all pages */}
                          <Suspense fallback={null}>
                            <GuardianMascot />
                          </Suspense>
                          
                          {/* Debug Mascot to test visibility */}
                          <Suspense fallback={null}>
                            <MascotDebug />
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