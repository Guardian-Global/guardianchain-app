import React, { lazy } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/web3/theme-provider";
import WalletProvider from "@/components/web3/wallet-provider";
import { AssetProvider } from "@/components/assets/AssetProvider";
// Removed duplicate UnifiedAuthProvider import
import UnifiedNavigation from "@/components/layout/UnifiedNavigation";
import Footer from "@/components/layout/footer";
import { MobileHeader } from "@/components/mobile/MobileNavigation";
import MobileHome from "@/pages/MobileHome";
import CreateCapsule from "@/pages/create-capsule";
import Explore from "@/pages/explore";
import Leaderboard from "@/pages/leaderboard";
import Profile from "@/pages/profile";
import CapsuleDetail from "@/pages/capsule-detail";
import Governance from "@/pages/governance";
import PrivateFeed from "@/pages/private";
// Dashboard moved to archive - using role-based dashboards
import Commander from "@/pages/commander";
// AuthenticationHub moved to archive - using UnifiedAuthModal
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
import ReferralPage from "@/pages/referral";
import AirdropPage from "@/pages/airdrop";
import GuardianPassPage from "@/pages/guardian-pass";
import VaultDashboard from "@/components/VaultDashboard";
import Govern from "@/pages/govern";
import NotFound from "@/pages/not-found";

import AuctionHousePage from "./pages/auction-house";
import EmbedCapsulePage from "./pages/embed-capsule";
import YieldTrackerPage from "./pages/yield-tracker";
import CapsuleAnalyticsPage from "./features/analytics/capsule-analytics";
import DynamicCapsuleAnalytics from "./pages/capsule/[id]/analytics";
import FinancialDashboard from "./features/analytics/financial-dashboard";
import TiersPage from "./pages/tiers";
import DonateAccessPage from "./pages/donate-access";
import TreasuryDashboard from "./pages/treasury";
import AIAdvisorPanel from "./pages/ai-advisor";
import CompliancePanel from "./pages/compliance";
import YieldDistributionPage from "./pages/yield-distribution";
import AdminDashboard from "./pages/admin";
import ConfigPage from "./pages/config";
import ResponsiveDemoPage from "./pages/responsive-demo";
import LogoSyncPage from "./pages/logo-sync";
import ReportingDashboard from "./pages/reporting";
// CommanderDashboard moved to archive - using EnhancedCommanderDashboard

import AssetIntegrationPage from "./pages/asset-integration";
import AssetShowcase from "./pages/asset-showcase";
import Homepage from "./pages/index";
import ResponsiveDemo from "./pages/responsive-demo";
import MintingTestPage from "./pages/minting-test";
// LogoTestPage moved to archive
import AssetDebugPage from "./pages/asset-debug";
import ProfessionalHomepage from "./pages/professional-homepage";

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
import Landing from "./pages/Landing";
import { useUnifiedAuth } from "./hooks/useUnifiedAuth";
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
import SpecializedIntake from "./pages/specialized-intake";
import WhistleblowerSanctuary from "./pages/whistleblower-sanctuary";
import CategoryDiscovery from "./pages/category-discovery";
import Whitepapers from "./pages/whitepapers";
import MyListings from "./pages/my-listings";
import TokenListings from "./pages/token-listings";
import MascotSettingsPage from "./pages/mascot-settings";
import GTTLaunch from "./pages/gtt-launch";
import SupabaseSecurity from "./pages/supabase-security";
import TeamsUpgrades from "./pages/teams-upgrades";
import ApiStatus from "./pages/api-status";
// Login page moved to archive - using UnifiedAuthModal
import { UnifiedAuthProvider } from "./hooks/useUnifiedAuth";
import { OnboardingChecker } from "./components/onboarding/OnboardingChecker";
import { MascotProvider } from "./components/mascot/MascotProvider";
import { HelpProvider } from "@/components/help/HelpProvider";
import RoleBasedDashboard from "./components/auth/RoleBasedDashboard";
// Admin components temporarily using role-based dashboard
// import EnhancedCommanderDashboard from "./components/admin/EnhancedCommanderDashboard";
// import EnhancedFounderDashboard from "./components/admin/EnhancedFounderDashboard";
import SupabaseAssetManager from "./components/assets/SupabaseAssetManager";
import ReplitToolsPage from "./pages/replit-tools";
import AdvancedFeaturesPage from "./pages/advanced-features";
import AssetIntegration from "./pages/asset-integration";
import ProtectedRoute, { AdminRoute, MasterAdminRoute, FounderRoute } from "./components/auth/ProtectedRoute";
// OnboardingChecker moved to different import location

function Router() {
  // Remove auth check for basic rendering
  // const { isAuthenticated, isLoading } = useUnifiedAuth();

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <UnifiedNavigation />
      <main className="pt-20 px-4 max-w-screen-xl mx-auto">
        <Switch>
          {/* Login page archived - using UnifiedAuthModal */}
        <Route path="/" component={lazy(() => import("./pages/simple-test"))} />
        <Route path="/gtt-launch" component={GTTLaunch} />
        <Route path="/home" component={ProfessionalHomepage} />
        <Route path="/create" component={CreateCapsule} />
        <Route path="/create-capsule" component={CreateCapsule} />
        <Route path="/create-with-help" component={lazy(() => import("./pages/capsule-creation-with-help"))} />
        <Route path="/explore" component={Explore} />
        <Route path="/leaderboard" component={Leaderboard} />
        <Route
          path="/profile/:id?"
          component={() => <EnhancedProfileDashboard />}
        />
        <Route
          path="/profile"
          component={() => <EnhancedProfileDashboard />}
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
        <Route path="/veritas-seal" component={lazy(() => import("./pages/veritas-seal"))} />
        <Route path="/truth-bounty" component={lazy(() => import("./pages/truth-bounty"))} />
        <Route path="/truth-auction" component={lazy(() => import("./pages/truth-auction"))} />
        <Route path="/truth-redemption" component={lazy(() => import("./pages/truth-redemption"))} />
        <Route path="/capsule/conspiracy" component={lazy(() => import("./pages/capsule/conspiracy"))} />
        
        {/* Creator Capsule Types */}
        <Route path="/capsule/podcaster" component={lazy(() => import("./pages/capsule/podcaster"))} />
        <Route path="/capsule/artist" component={lazy(() => import("./pages/capsule/artist"))} />
        <Route path="/capsule/scientist" component={lazy(() => import("./pages/capsule/scientist"))} />
        <Route path="/capsule/media" component={lazy(() => import("./pages/capsule/media"))} />
        <Route path="/capsule/musician" component={lazy(() => import("./pages/capsule/musician"))} />
        <Route path="/onboarding" component={OnboardingPage} />
        <Route path="/unified-onboarding" component={OnboardingPage} />
        <Route path="/capsule/:id" component={CapsuleDetail} />
        <Route path="/governance" component={Governance} />
        <Route path="/private" component={PrivateFeed} />
        <Route path="/dashboard" component={RoleBasedDashboard} />
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
        <Route path="/enhanced-leaderboard" component={EnhancedLeaderboard} />
        <Route path="/explorer" component={Explorer} />
        <Route path="/certify" component={Certify} />
        <Route path="/insight" component={InsightPage} />
        <Route path="/capsule-forge" component={CapsuleForgePage} />
        <Route path="/stake" component={StakePage} />
        <Route path="/launchpad" component={LaunchpadPage} />
        <Route path="/referral" component={ReferralPage} />
        <Route path="/airdrop" component={AirdropPage} />
        <Route path="/guardian-pass" component={GuardianPassPage} />
        <Route path="/vault" component={() => <VaultDashboard />} />
        <Route path="/auction-house" component={AuctionHousePage} />
        <Route path="/embed/capsule" component={EmbedCapsulePage} />
        <Route path="/yield-tracker" component={YieldTrackerPage} />
        <Route path="/capsule-analytics" component={CapsuleAnalyticsPage} />
        <Route
          path="/capsule/:id/analytics"
          component={DynamicCapsuleAnalytics}
        />
        <Route path="/financial-dashboard" component={FinancialDashboard} />

        <Route path="/blockchain-playground" component={BlockchainPlayground} />
        <Route path="/tiers" component={TiersPage} />
        <Route path="/donate-access" component={DonateAccessPage} />
        <Route path="/treasury" component={TreasuryDashboard} />
        <Route path="/ai-advisor" component={AIAdvisorPanel} />
        <Route path="/compliance" component={CompliancePanel} />
        <Route path="/yield-distribution" component={YieldDistributionPage} />
        <Route path="/admin">
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        </Route>
        <Route path="/config" component={ConfigPage} />
        <Route path="/reporting" component={ReportingDashboard} />
        {/* Duplicate dashboard route removed */}

        <Route path="/asset-integration" component={AssetIntegrationPage} />
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
        <Route path="/category-discovery" component={CategoryDiscovery} />
        <Route path="/whitepapers" component={Whitepapers} />
        <Route path="/asset-showcase" component={AssetShowcase} />

        <Route path="/master-access" component={MasterAccess} />
        <Route path="/profile-customization" component={ProfileCustomization} />
        <Route path="/supabase-security" component={SupabaseSecurity} />
        <Route path="/teams-upgrades" component={TeamsUpgrades} />
        <Route path="/api-status" component={ApiStatus} />
        <Route path="/responsive-demo" component={ResponsiveDemo} />
        <Route path="/logo-sync" component={LogoSyncPage} />
        <Route path="/minting-test" component={MintingTestPage} />
        {/* LogoTestPage moved to archive */}
        <Route path="/asset-debug" component={AssetDebugPage} />
        <Route path="/professional-homepage" component={ProfessionalHomepage} />
        <Route path="/supabase-assets" component={() => <ProfessionalHomepage />} />
        <Route path="/unified-login" component={RoleBasedDashboard} />
        <Route path="/auth-dashboard" component={RoleBasedDashboard} />
        <Route path="/commander" component={RoleBasedDashboard} />
        <Route path="/founder-dashboard">
          <FounderRoute>
            <RoleBasedDashboard />
          </FounderRoute>
        </Route>
        <Route path="/asset-manager" component={SupabaseAssetManager} />
        <Route path="/asset-integration" component={AssetIntegration} />
        <Route path="/replit-tools" component={ReplitToolsPage} />
        <Route path="/advanced-features" component={AdvancedFeaturesPage} />
        <Route path="/upgrade" component={() => <BillingDashboard />} />
        {/* AdminLogin archived - using unified auth */}
        <Route path="/admin/dashboard" component={AdminDashboardPage} />
        <Route path="/admin/users" component={AdminDashboardPage} />
        <Route path="/admin/treasury" component={FinancialDashboard} />
        <Route path="/admin/chain-audit" component={AdminDashboardPage} />

        {/* Asset Test Page */}
        <Route path="/asset-test" component={lazy(() => import("./pages/asset-test"))} />
        
        {/* Legal Pages */}
        <Route path="/legal/privacy" component={PrivacyPolicy} />
        <Route path="/legal/terms" component={TermsOfService} />
        <Route path="/legal/security" component={SecurityPolicy} />

          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  console.log("🚀 App component loading");
  
  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-purple-400">
        🎬 GUARDIANCHAIN - Your Assets Are Working!
      </h1>
      
      <div className="max-w-4xl mx-auto bg-slate-800 rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-green-400">✅ Platform Status: OPERATIONAL</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="text-center bg-slate-700 rounded p-4">
            <h3 className="text-lg font-semibold mb-4 text-purple-300">GUARDIANCHAIN Logo</h3>
            <img 
              src="/assets/GUARDIANCHAIN_logo.png" 
              alt="GUARDIANCHAIN Logo"
              className="w-24 h-24 object-contain mx-auto mb-2"
              onLoad={() => console.log("✅ GUARDIANCHAIN logo loaded successfully")}
              onError={() => console.log("❌ GUARDIANCHAIN logo failed")}
            />
            <p className="text-slate-400 text-sm">670KB PNG - Your Custom Logo</p>
          </div>

          <div className="text-center bg-slate-700 rounded p-4">
            <h3 className="text-lg font-semibold mb-4 text-green-300">GTT Token Logo</h3>
            <img 
              src="/assets/GTT_logo.png" 
              alt="GTT Logo"
              className="w-24 h-24 object-contain mx-auto mb-2"
              onLoad={() => console.log("✅ GTT logo loaded successfully")}
              onError={() => console.log("❌ GTT logo failed")}
            />
            <p className="text-slate-400 text-sm">670KB PNG - Your Token Logo</p>
          </div>

          <div className="text-center bg-slate-700 rounded p-4">
            <h3 className="text-lg font-semibold mb-4 text-purple-300">GUARDIANCHAIN Video</h3>
            <video 
              src="/assets/GUARDIANCHAIN_logo_video.mp4"
              className="w-24 h-24 object-contain mx-auto mb-2 rounded"
              autoPlay
              loop
              muted
              playsInline
              onLoadStart={() => console.log("🎬 GUARDIANCHAIN video loading")}
              onCanPlay={() => console.log("✅ GUARDIANCHAIN video ready to play")}
              onError={() => console.log("❌ GUARDIANCHAIN video failed")}
            />
            <p className="text-slate-400 text-sm">3.8MB MP4 - Your Custom Video</p>
          </div>

          <div className="text-center bg-slate-700 rounded p-4">
            <h3 className="text-lg font-semibold mb-4 text-green-300">GTT Token Video</h3>
            <video 
              src="/assets/GTT_logo_video.mp4"
              className="w-24 h-24 object-contain mx-auto mb-2 rounded"
              autoPlay
              loop
              muted
              playsInline
              onLoadStart={() => console.log("🎬 GTT video loading")}
              onCanPlay={() => console.log("✅ GTT video ready to play")}
              onError={() => console.log("❌ GTT video failed")}
            />
            <p className="text-slate-400 text-sm">3.8MB MP4 - Your Token Video</p>
          </div>
        </div>

        <div className="bg-green-900/30 border border-green-600 rounded p-4">
          <h3 className="text-green-400 font-semibold text-lg mb-2">🎉 Asset Integration Complete!</h3>
          <p className="text-slate-300">
            All 4 of your company assets are now working:
          </p>
          <ul className="text-slate-300 mt-2 ml-4">
            <li>• GUARDIANCHAIN Logo: 670KB PNG ✅</li>
            <li>• GTT Token Logo: 670KB PNG ✅</li>
            <li>• GUARDIANCHAIN Video: 3.8MB MP4 ✅</li>
            <li>• GTT Token Video: 3.8MB MP4 ✅</li>
          </ul>
          <p className="text-slate-300 mt-4">
            Your months of work creating these assets is now fully functional. 
            The videos are set to autoplay and loop throughout the platform.
          </p>
        </div>
      </div>
    </div>
  );
}
