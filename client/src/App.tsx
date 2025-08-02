import React, { lazy, Suspense, startTransition, useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/web3/theme-provider";
import WalletProvider from "@/components/web3/wallet-provider";
import { AssetProvider } from "@/components/assets/AssetProvider";
import UnifiedNavigation from "@/components/layout/UnifiedNavigation";
import EnhancedNavigation from "@/components/navigation/EnhancedNavigation";
import NavigationProvider from "@/components/navigation/NavigationProvider";
import NavigationMenu from "@/components/NavigationMenu";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import OfflineIndicator from "@/components/OfflineIndicator";
import { serviceWorkerManager } from "@/utils/serviceWorkerManager";
import Footer from "@/components/layout/footer";
import EnhancedLayout from "@/components/layout/EnhancedLayout";
import { LiveTokenTracker } from "@/components/live/LiveTokenTracker";
import { MobileHeader } from "@/components/mobile/MobileNavigation";
import WelcomeTour from "@/components/WelcomeTour";
import { GuardianBootHook } from "@/components/GuardianBootHook";
import UltimateHomepage from "@/pages/UltimateHomepage";
import MobileHome from "@/pages/MobileHome";
import CreateCapsule from "@/pages/CreateCapsule";
import Explore from "@/pages/explore";
import Leaderboard from "@/pages/leaderboard";
import Profile from "@/pages/profile";
import CapsuleDetail from "@/pages/capsule-detail";
import Governance from "@/pages/governance";
import PrivateFeed from "@/pages/private";
// Dashboard moved to archive - using role-based dashboards
import Commander from "@/pages/commander";
import OnboardingPage from "@/pages/onboarding";
import MintNFT from "@/pages/mint-nft";
import RecommendationsPage from "@/pages/recommendations";
import EnhancedProfile from "@/pages/enhanced-profile";

import EnhancedLeaderboard from "@/pages/enhanced-leaderboard";
import Explorer from "@/pages/explorer";
import Certify from "@/pages/certify";
import InsightPage from "@/pages/insight";
import CapsuleForgePage from "@/pages/capsule-forge";
import StakePage from "@/pages/stake";
import LaunchpadPage from "@/pages/launchpad";
// ReferralPage import removed - using direct import
import AirdropPage from "@/pages/airdrop";
import GuardianPassPage from "@/pages/guardian-pass";
import VaultDashboard from "@/components/VaultDashboard";
import Govern from "@/pages/govern";
import NotFound from "./pages/NotFound";
import Search from "./pages/Search";

// Veritas Tools Components
import VeritasSealPage from "./pages/veritas-seal";
import TruthBountyPage from "./pages/truth-bounty";
import TruthRedemptionPage from "./pages/truth-redemption";
import ConspiracyCapsulePage from "./pages/conspiracy-capsule";

// Specialized Portal Components
import WhistleblowerSanctuary from "./pages/WhistleblowerSanctuary";
import TimeMessages from "./pages/TimeMessages";
import SpecializedIntake from "./pages/specialized-intake";
import CategoryDiscoveryPage from "./pages/category-discovery";

import AuctionHousePage from "./pages/auction-house";
import EmbedCapsulePage from "./pages/embed-capsule";
import YieldTrackerPage from "./pages/yield-tracker";
import ReelsViewer from "./pages/reels-viewer";
import CapsuleAnalyticsPage from "./features/analytics/capsule-analytics";
import DynamicCapsuleAnalytics from "./pages/capsule/[id]/analytics";
import FinancialDashboard from "./features/analytics/financial-dashboard";
import TiersPage from "./pages/tiers";
import DonateAccessPage from "./pages/donate-access";
import TreasuryDashboard from "./pages/treasury";
import AIAdvisorPanel from "./pages/ai-advisor";
import CompliancePanel from "./pages/compliance";
import YieldDistributionPage from "./pages/yield-distribution";
// AdminDashboard import removed - using direct import
import ConfigPage from "./pages/config";

import LogoSyncPage from "./pages/logo-sync";
import ReportingDashboard from "./pages/reporting";
// CommanderDashboard moved to archive - using EnhancedCommanderDashboard

import AssetIntegrationPage from "./pages/asset-integration";
import AssetShowcase from "./pages/asset-showcase";

// Design System
import DesignTokenShowcase from "./components/design/DesignTokenShowcase";
import FigmaIntegrationGuide from "./components/design/FigmaIntegrationGuide";

// Trading & Institutional Features
const WhaleTracker = lazy(() => import("@/pages/whale-tracker"));
const TradingBots = lazy(() => import("@/pages/trading-bots"));
const DeFiIntegrations = lazy(() => import("@/pages/defi-integrations"));
const InstitutionalDashboard = lazy(
  () => import("@/pages/institutional-dashboard"),
);
const MarketMaker = lazy(() => import("@/pages/market-maker"));

// Revolutionary Revenue Components
const AITradingOracle = lazy(() => import("@/pages/ai-trading-oracle"));
const CryptoHedgeFund = lazy(() => import("@/pages/crypto-hedge-fund"));
const TokenLaunchpadPro = lazy(() => import("@/pages/token-launchpad-pro"));
const NFTMarketplacePro = lazy(() => import("@/pages/nft-marketplace-pro"));
const EnterpriseDAOSuite = lazy(() => import("@/pages/enterprise-dao-suite"));

// Premium Legacy Capsules
const InstitutionalLegacy = lazy(() => import("@/pages/institutional-legacy"));
const EarthLegacy = lazy(() => import("@/pages/earth-legacy"));
const CulturalLegacy = lazy(() => import("@/pages/cultural-legacy"));
const SovereignLegacy = lazy(() => import("@/pages/sovereign-legacy"));
const TechnologicalLegacy = lazy(() => import("@/pages/technological-legacy"));

// Communication & Streaming
const Messaging = lazy(() => import("@/pages/messaging"));
const LiveStreaming = lazy(() => import("@/pages/live-streaming"));
import Dashboard from "./pages/auth/Dashboard";

// Memory Vault System Components
import MemoryVault from "./pages/memory-vault";
import EternalStaking from "./pages/eternal-staking";
import FamilyLegacy from "./pages/family-legacy";
// Removed duplicate - using new TimeMessages.tsx
import InfiniteRecovery from "./pages/infinite-recovery";
import Referrals from "./pages/referrals";
import Earnings from "./pages/earnings";
import GameifiedOnboardingPage from "./pages/gamified-onboarding";
import OnboardingProvider from "./components/onboarding/OnboardingProvider";
import Vault from "./pages/vault";

import MintingTestPage from "./pages/minting-test";
// LogoTestPage moved to archive

// Legacy homepage files removed - using UltimateHomepage

import MasterAccess from "./pages/master-access";
import ProfileCustomization from "./pages/profile-customization";
import ProtocolStrategy from "./pages/protocol-strategy";
import EnterpriseSuite from "./pages/enterprise-suite";
import PremiumFeaturesPage from "./pages/premium-features";
import ViralTools from "./pages/viral-tools";
import MasterAdmin from "./pages/MasterAdmin";
import ContactInfo from "./components/ContactInfo";
import Notifications from "./pages/Notifications";
import BillingDashboard from "./features/payments/BillingDashboard";
// Landing page removed - using UltimateHomepage
import { useAuth } from "./hooks/useAuth";
// Unified auth hooks removed - using simplified useAuth
import { HelmetProvider } from "react-helmet-async";
import PrivacyPolicy from "./pages/legal/privacy";
// Removed duplicate AuthProvider import
import TermsOfService from "./pages/legal/terms";
import SecurityPolicy from "./pages/legal/security";
import SimpleTokenLaunch from "@/pages/simple-token-launch";
// SimpleHome and WorkingProfileDashboard moved to archive
import EnhancedProfileDashboard from "@/components/profile/EnhancedProfileDashboard";
// StripeCheckout moved to features/payments/components/
// AdminLogin and AdminDashboard moved to archive - using unified auth
import AdminDashboardPage from "./pages/admin";

import BlockchainPlayground from "./pages/blockchain-playground";
import Whitepapers from "./pages/whitepapers";
import MyListings from "./pages/my-listings";
import TokenListings from "./pages/token-listings";
import MascotSettingsPage from "./pages/mascot-settings";
import GTTLaunch from "./pages/gtt-launch";
import GTTDemo from "./pages/GTTDemo";
import SupabaseSecurity from "./pages/supabase-security";
import TeamsUpgrades from "./pages/teams-upgrades";
import ApiStatus from "./pages/api-status";
import { TierProvider } from "./context/TierContext";
import { MascotProvider } from "./components/mascot/MascotProvider";
import { HelpProvider } from "@/components/help/HelpProvider";
// Admin components temporarily using role-based dashboard
// import EnhancedCommanderDashboard from "./components/admin/EnhancedCommanderDashboard";
// import EnhancedFounderDashboard from "./components/admin/EnhancedFounderDashboard";
import SupabaseAssetManager from "./components/assets/SupabaseAssetManager";

// New pages for production deployment
import Partners from "./pages/Partners";
import Analytics from "./pages/dashboard/Analytics";
import DemoKit from "./pages/investor/DemoKit";
import ReplitToolsPage from "./pages/replit-tools";
import AdvancedFeaturesPage from "./pages/advanced-features";
import AdminVisualsPage from "./pages/admin-visuals";
import PricingPage from "./pages/pricing";
import CapsulePricingPage from "./pages/capsule-pricing";
import LaunchBonuses from "./pages/launch-bonuses";
import TradeCompetition from "./pages/trade-competition";
import RevenueDashboard from "./pages/revenue-dashboard";
import FlashTrading from "./pages/flash-trading";
import WhaleAlerts from "./pages/whale-alerts";
import FOMOCountdown from "./pages/fomo-countdown";
import UpgradePage from "./pages/upgrade";
import AssetIntegration from "./pages/asset-integration";
import TopRevenueDrivers from "./pages/top-revenue-drivers";
import TruthVaultDashboard from "./pages/truth-vault-dashboard";
import CrossTradingPage from "./pages/cross-trading";

// Enhanced UI Pages
import YieldDashboard from "./pages/dashboard/Yield";
import ReferralDashboard from "./pages/referral";
import VaultExplorer from "./pages/vault";
import RedemptionCapsulePage from "./pages/redemption-capsule";
import LaunchDashboard from "./pages/launch-dashboard";
import ExchangeListings from "./pages/exchange-listings";
import MicroInteractionsShowcase from "./pages/micro-interactions-showcase";
import MemoryFeaturesPage from "./pages/memory-features";
import ProtectedRoute, {
  AdminRoute,
  MasterAdminRoute,
  FounderRoute,
} from "./components/auth/ProtectedRoute";

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

  // Show elite landing page for unauthenticated users
  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/" component={UltimateHomepage} />
        <Route
          path="/test-auth"
          component={lazy(() => import("./pages/TestAuth"))}
        />
        <Route path="/legal/privacy" component={PrivacyPolicy} />
        <Route path="/legal/terms" component={TermsOfService} />
        <Route path="/legal/security" component={SecurityPolicy} />
        <Route component={UltimateHomepage} />
      </Switch>
    );
  }

  // Check if user should go to validator dashboard
  const isValidator =
    user &&
    (user as any).email &&
    ((user as any).email === "founder@guardianchain.app" ||
      (user as any).email === "master@guardianchain.app");

  if (isValidator && window.location.pathname === "/") {
    window.location.href = "/validator-dashboard";
    return null;
  }

  return (
    <EnhancedLayout>
      <WelcomeTour />
      <LiveTokenTracker position="top" />
      <div className="max-w-screen-xl mx-auto">
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
            {/* Core Routes */}
            <Route
              path="/"
              component={lazy(() => import("./pages/EnhancedDashboard"))}
            />
            <Route
              path="/dashboard"
              component={lazy(() => import("./pages/EnhancedDashboard"))}
            />
            <Route path="/dashboard/yield" component={YieldDashboard} />
            <Route path="/dashboard/analytics" component={Analytics} />
            <Route path="/partners" component={Partners} />
            <Route path="/investor/demo-kit" component={DemoKit} />
            <Route path="/create" component={CreateCapsule} />
            <Route
              path="/eternal-contracts"
              component={lazy(() => import("./pages/EternalContracts"))}
            />
            <Route
              path="/guardian-map"
              component={lazy(() => import("./pages/GuardianMap"))}
            />
            <Route path="/vault" component={Vault} />
            <Route
              path="/capsule/:id"
              component={lazy(() => import("./components/CapsuleReplayView"))}
            />
            <Route
              path="/admin"
              component={lazy(() => import("./pages/admin"))}
            />
            <Route
              path="/unauthorized"
              component={lazy(() => import("./pages/unauthorized"))}
            />
            <Route path="/dao" component={lazy(() => import("./pages/dao"))} />
            <Route
              path="/dao/results/:id"
              component={lazy(() => import("./pages/dao/results"))}
            />
            <Route
              path="/governance"
              component={lazy(() => import("./pages/dao"))}
            />
            <Route
              path="/capsules/gallery"
              component={lazy(() => import("./pages/capsules/gallery"))}
            />
            <Route
              path="/capsule-view/:id"
              component={lazy(() => import("./pages/capsule-view"))}
            />
            <Route path="/create-capsule" component={CreateCapsule} />
            <Route
              path="/gtt-yield"
              component={lazy(() => import("./pages/gtt-yield"))}
            />
            <Route
              path="/validator"
              component={lazy(() => import("./pages/validator"))}
            />
            <Route
              path="/validator-dashboard"
              component={lazy(() => import("./pages/validator"))}
            />
            <Route
              path="/jury"
              component={lazy(() => import("./pages/jury"))}
            />
            <Route
              path="/explorer"
              component={lazy(() => import("./pages/explorer"))}
            />
            <Route
              path="/capsule-explorer"
              component={lazy(() => import("./pages/explorer"))}
            />
            <Route
              path="/storage-capsules"
              component={lazy(() => import("./pages/storage-capsules"))}
            />
            <Route
              path="/upload-capsule"
              component={lazy(() => import("./pages/upload-capsule"))}
            />
            <Route
              path="/system-validation"
              component={lazy(() => import("./pages/system-validation"))}
            />
            <Route
              path="/launch"
              component={lazy(() => import("./pages/launch-announcement"))}
            />
            <Route
              path="/launch-enhancements"
              component={lazy(() => import("./pages/launch-enhancements"))}
            />

            <Route
              path="/asset-showcase"
              component={lazy(() => import("./pages/asset-showcase"))}
            />
            <Route
              path="/u/:username"
              component={lazy(() => import("./pages/u/[username]"))}
            />
            <Route
              path="/reels"
              component={lazy(() => import("./pages/reels"))}
            />
            <Route path="/gtt-launch" component={GTTLaunch} />
            <Route path="/gtt-demo" component={GTTDemo} />

            <Route
              path="/create"
              component={lazy(() => import("./pages/CreateCapsuleStreamlined"))}
            />
            <Route
              path="/create-streamlined"
              component={lazy(() => import("./pages/CreateCapsuleStreamlined"))}
            />
            <Route path="/create-with-help" component={CreateCapsule} />
            <Route path="/create-truth-capsule" component={CreateCapsule} />
            <Route
              path="/eternal-contracts"
              component={lazy(() => import("./pages/EternalContracts"))}
            />
            <Route
              path="/lineage"
              component={lazy(() => import("./pages/LineageGraph"))}
            />
            <Route
              path="/reputation"
              component={lazy(() => import("./pages/ReputationIndex"))}
            />
            <Route
              path="/smri"
              component={lazy(() => import("./pages/ReputationIndex"))}
            />
            <Route
              path="/smri-dashboard"
              component={lazy(() => import("./pages/SMRIDashboard"))}
            />
            <Route
              path="/guardian-map"
              component={lazy(() => import("./pages/GuardianMap"))}
            />
            <Route path="/search" component={Search} />

            {/* Enhanced UI Routes */}
            <Route path="/yield" component={YieldDashboard} />
            <Route
              path="/referral-earn"
              component={lazy(() => import("./pages/referral"))}
            />
            <Route path="/truth-vault" component={VaultExplorer} />
            <Route
              path="/live-demo"
              component={lazy(() => import("./pages/LiveDemo"))}
            />
            <Route
              path="/tier-access"
              component={lazy(() => import("./pages/TierAccess"))}
            />
            <Route
              path="/institutional-onboarding"
              component={lazy(
                () => import("./components/onboarding/InstitutionalOnboarding"),
              )}
            />

            {/* Memory Vault System Routes */}
            <Route path="/memory-vault" component={MemoryVault} />
            <Route path="/eternal-staking" component={EternalStaking} />
            <Route path="/family-legacy" component={FamilyLegacy} />
            <Route path="/time-messages" component={TimeMessages} />
            <Route path="/infinite-recovery" component={InfiniteRecovery} />

            {/* Veritas Tools - Working Pages */}
            <Route path="/veritas-seal" component={VeritasSealPage} />
            <Route path="/truth-bounty" component={TruthBountyPage} />
            <Route path="/truth-redemption" component={TruthRedemptionPage} />
            <Route
              path="/conspiracy-capsule"
              component={ConspiracyCapsulePage}
            />

            {/* Specialized Portal Pages */}
            <Route
              path="/whistleblower-sanctuary"
              component={WhistleblowerSanctuary}
            />
            <Route path="/specialized-intake" component={SpecializedIntake} />
            <Route
              path="/category-discovery"
              component={CategoryDiscoveryPage}
            />

            {/* Revenue Analysis & Truth Vault Dashboard */}
            <Route path="/top-revenue-drivers" component={TopRevenueDrivers} />
            <Route
              path="/truth-vault-dashboard"
              component={TruthVaultDashboard}
            />

            {/* Advanced Trading & Verification Features */}
            <Route path="/cross-trading" component={CrossTradingPage} />
            <Route
              path="/redemption-capsule"
              component={RedemptionCapsulePage}
            />
            <Route path="/launch-dashboard" component={LaunchDashboard} />
            <Route path="/exchange-listings" component={ExchangeListings} />
            <Route
              path="/micro-interactions"
              component={MicroInteractionsShowcase}
            />
            <Route path="/explore" component={Explore} />
            <Route path="/leaderboard" component={Leaderboard} />

            {/* Profile Routes - Prioritized to prevent 404 conflicts */}
            <Route
              path="/profile/:id"
              component={() => <EnhancedProfileDashboard />}
            />
            <Route
              path="/profile"
              component={() => <EnhancedProfileDashboard />}
            />
            <Route
              path="/profile-dashboard"
              component={() => <EnhancedProfileDashboard />}
            />
            <Route
              path="/advanced-profile"
              component={lazy(() => import("./pages/advanced-profile"))}
            />

            <Route path="/my-listings" component={MyListings} />
            <Route path="/token-listings" component={TokenListings} />
            <Route path="/mascot-settings" component={MascotSettingsPage} />
            <Route path="/gtt-launch" component={GTTLaunch} />
            <Route path="/replit-tools" component={ReplitToolsPage} />
            <Route
              path="/auth-hub"
              component={() => <div>Use unified auth modal</div>}
            />

            {/* Specialized Components */}
            <Route path="/veritas-seal" component={CreateCapsule} />
            <Route path="/truth-bounty" component={CreateCapsule} />
            <Route path="/truth-auction" component={CreateCapsule} />
            <Route path="/truth-redemption" component={CreateCapsule} />
            <Route path="/capsule/conspiracy" component={CreateCapsule} />

            {/* Creator Capsule Types */}
            <Route path="/capsule/podcaster" component={CreateCapsule} />
            <Route path="/capsule/artist" component={CreateCapsule} />
            <Route path="/capsule/scientist" component={CreateCapsule} />
            <Route path="/capsule/media" component={CreateCapsule} />
            <Route path="/capsule/musician" component={CreateCapsule} />
            <Route path="/onboarding" component={OnboardingPage} />
            <Route path="/unified-onboarding" component={OnboardingPage} />
            <Route path="/capsule/:id" component={CapsuleDetail} />
            <Route path="/governance" component={Governance} />
            <Route path="/private" component={PrivateFeed} />
            <Route path="/capsules" component={Explore} />
            <Route path="/analytics" component={CapsuleAnalyticsPage} />
            <Route path="/dao" component={Governance} />
            <Route path="/commander">
              <ProtectedRoute requiredRole="COMMANDER">
                <Commander />
              </ProtectedRoute>
            </Route>

            <Route path="/mint-nft" component={MintNFT} />
            <Route path="/govern" component={Govern} />
            <Route path="/recommendations" component={RecommendationsPage} />
            <Route path="/enhanced-profile" component={EnhancedProfile} />
            <Route
              path="/enhanced-leaderboard"
              component={EnhancedLeaderboard}
            />
            <Route path="/explorer" component={Explorer} />
            <Route path="/certify" component={Certify} />
            <Route path="/insight" component={InsightPage} />
            <Route path="/capsule-forge" component={CapsuleForgePage} />
            <Route path="/stake" component={StakePage} />
            <Route path="/launchpad" component={LaunchpadPage} />
            <Route
              path="/referral"
              component={lazy(() => import("./pages/referral"))}
            />
            <Route path="/referrals" component={Referrals} />
            <Route path="/earnings" component={Earnings} />
            <Route
              path="/gamified-onboarding"
              component={GameifiedOnboardingPage}
            />

            <Route
              path="/login-success"
              component={lazy(() => import("./pages/login-success"))}
            />
            <Route
              path="/terms"
              component={lazy(() => import("./pages/terms"))}
            />
            <Route
              path="/privacy"
              component={lazy(() => import("./pages/privacy"))}
            />
            <Route path="/airdrop" component={AirdropPage} />
            <Route path="/guardian-pass" component={GuardianPassPage} />
            <Route path="/vault" component={() => <VaultDashboard />} />
            <Route path="/auction-house" component={AuctionHousePage} />
            <Route path="/embed/capsule" component={EmbedCapsulePage} />
            <Route path="/yield-tracker" component={YieldTrackerPage} />
            <Route path="/reels-viewer" component={ReelsViewer} />
            <Route path="/capsule-analytics" component={CapsuleAnalyticsPage} />
            <Route
              path="/capsule/:id/analytics"
              component={DynamicCapsuleAnalytics}
            />
            <Route path="/financial-dashboard" component={FinancialDashboard} />

            <Route
              path="/blockchain-playground"
              component={BlockchainPlayground}
            />
            <Route path="/tiers" component={TiersPage} />
            <Route path="/donate-access" component={DonateAccessPage} />
            <Route path="/treasury" component={TreasuryDashboard} />
            <Route path="/ai-advisor" component={AIAdvisorPanel} />
            <Route path="/compliance" component={CompliancePanel} />
            <Route
              path="/yield-distribution"
              component={YieldDistributionPage}
            />
            <Route path="/admin">
              <AdminRoute>
                <AdminDashboardPage />
              </AdminRoute>
            </Route>
            <Route path="/config" component={ConfigPage} />
            <Route path="/reporting" component={ReportingDashboard} />
            {/* Duplicate dashboard route removed */}

            <Route path="/asset-integration" component={AssetIntegrationPage} />
            <Route path="/design-tokens" component={DesignTokenShowcase} />
            <Route
              path="/figma-integration"
              component={FigmaIntegrationGuide}
            />
            <Route
              path="/mint-example"
              component={lazy(() => import("./pages/MintExample"))}
            />
            <Route path="/protocol-strategy" component={ProtocolStrategy} />
            <Route path="/enterprise-suite" component={EnterpriseSuite} />
            <Route path="/premium-features" component={PremiumFeaturesPage} />
            <Route path="/viral-tools" component={ViralTools} />
            <Route path="/master-admin">
              <MasterAdminRoute>
                <MasterAdmin />
              </MasterAdminRoute>
            </Route>
            <Route path="/contact" component={() => <ContactInfo />} />
            <Route path="/notifications" component={Notifications} />
            <Route path="/billing-dashboard" component={BillingDashboard} />
            <Route path="/token-launch" component={SimpleTokenLaunch} />
            <Route path="/specialized-intake" component={SpecializedIntake} />
            <Route
              path="/whistleblower-sanctuary"
              component={WhistleblowerSanctuary}
            />
            <Route
              path="/category-discovery"
              component={CategoryDiscoveryPage}
            />
            <Route path="/whitepapers" component={Whitepapers} />
            <Route path="/asset-showcase" component={AssetShowcase} />

            <Route path="/master-access" component={MasterAccess} />
            <Route
              path="/profile-customization"
              component={ProfileCustomization}
            />
            <Route path="/supabase-security" component={SupabaseSecurity} />
            <Route path="/teams-upgrades" component={TeamsUpgrades} />
            <Route path="/api-status" component={ApiStatus} />

            <Route path="/logo-sync" component={LogoSyncPage} />
            <Route path="/minting-test" component={MintingTestPage} />
            {/* LogoTestPage moved to archive */}

            <Route path="/professional-homepage" component={UltimateHomepage} />
            <Route
              path="/supabase-assets"
              component={lazy(() => import("./pages/asset-showcase"))}
            />
            <Route path="/founder-dashboard">
              <FounderRoute>
                <div>Founder Dashboard Content</div>
              </FounderRoute>
            </Route>
            <Route path="/asset-manager" component={SupabaseAssetManager} />
            <Route path="/asset-integration" component={AssetIntegration} />
            <Route path="/replit-tools" component={ReplitToolsPage} />
            <Route path="/advanced-features" component={AdvancedFeaturesPage} />
            <Route path="/admin-visuals" component={AdminVisualsPage} />
            <Route path="/pricing" component={PricingPage} />
            <Route path="/capsule-pricing" component={CapsulePricingPage} />
            <Route path="/launch-bonuses" component={LaunchBonuses} />
            <Route path="/trade-competition" component={TradeCompetition} />
            <Route path="/revenue-dashboard" component={RevenueDashboard} />
            <Route path="/flash-trading" component={FlashTrading} />
            <Route path="/whale-alerts" component={WhaleAlerts} />
            <Route path="/fomo-countdown" component={FOMOCountdown} />
            <Route path="/plans" component={PricingPage} />

            {/* Trading & Institutional Features */}
            <Route path="/whale-tracker" component={WhaleTracker} />
            <Route path="/trading-bots" component={TradingBots} />
            <Route path="/defi-integrations" component={DeFiIntegrations} />
            <Route
              path="/institutional-dashboard"
              component={InstitutionalDashboard}
            />
            <Route path="/market-maker" component={MarketMaker} />

            {/* Revolutionary Revenue Components */}
            <Route path="/ai-trading-oracle" component={AITradingOracle} />
            <Route path="/crypto-hedge-fund" component={CryptoHedgeFund} />
            <Route path="/token-launchpad-pro" component={TokenLaunchpadPro} />
            <Route path="/nft-marketplace-pro" component={NFTMarketplacePro} />
            <Route
              path="/enterprise-dao-suite"
              component={EnterpriseDAOSuite}
            />

            {/* Premium Legacy Capsules */}
            <Route
              path="/institutional-legacy"
              component={InstitutionalLegacy}
            />
            <Route path="/earth-legacy" component={EarthLegacy} />
            <Route path="/cultural-legacy" component={CulturalLegacy} />
            <Route path="/sovereign-legacy" component={SovereignLegacy} />
            <Route
              path="/technological-legacy"
              component={TechnologicalLegacy}
            />

            {/* Communication & Streaming */}
            <Route path="/messaging" component={Messaging} />
            <Route path="/live-streaming" component={LiveStreaming} />
            <Route path="/memory-features" component={MemoryFeaturesPage} />
            <Route path="/upgrade" component={UpgradePage} />
            {/* AdminLogin archived - using unified auth */}
            <Route path="/admin/dashboard" component={AdminDashboardPage} />
            <Route path="/admin/users" component={AdminDashboardPage} />
            <Route path="/admin/treasury" component={FinancialDashboard} />
            <Route path="/admin/chain-audit" component={AdminDashboardPage} />

            {/* Asset Test Page */}
            <Route
              path="/asset-test"
              component={lazy(() => import("./pages/asset-showcase"))}
            />

            {/* Legal Pages */}
            <Route path="/legal/privacy" component={PrivacyPolicy} />
            <Route path="/legal/terms" component={TermsOfService} />
            <Route path="/legal/security" component={SecurityPolicy} />

            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </div>
      <Footer />
    </EnhancedLayout>
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
                        <NavigationProvider>
                          <GuardianBootHook />
                          <main className="flex-1">
                            <Router />
                          </main>
                        </NavigationProvider>
                        <Toaster />
                        <NavigationMenu />
                        <PWAInstallPrompt />
                        <OfflineIndicator />
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
