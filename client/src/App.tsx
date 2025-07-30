import { Switch, Route } from "wouter";
import { lazy } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/web3/theme-provider";
import WalletProvider from "@/components/web3/wallet-provider";
import { AssetProvider } from "@/components/assets/AssetProvider";
import EnhancedMegaNavigation from "@/components/layout/EnhancedMegaNavigation";
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
import Dashboard from "@/pages/dashboard";
import Commander from "@/pages/commander";
import AuthenticationHub from "@/components/auth/AuthenticationHub";
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
import CapsuleAnalyticsPage from "./pages/capsule-analytics";
import DynamicCapsuleAnalytics from "./pages/capsule/[id]/analytics";
import FinancialDashboard from "./pages/financial-dashboard";
import TiersPage from "./pages/tiers";
import DonateAccessPage from "./pages/donate-access";
import TreasuryDashboard from "./pages/treasury";
import AIAdvisorPanel from "./pages/ai-advisor";
import CompliancePanel from "./pages/compliance";
import YieldDistributionPage from "./pages/yield-distribution";
import AdminDashboard from "./pages/admin";
import ConfigPage from "./pages/config";
import ReportingDashboard from "./pages/reporting";
import CommanderDashboard from "./pages/dashboard";

import AssetIntegrationPage from "./pages/asset-integration";
import AssetShowcase from "./pages/asset-showcase";
import Homepage from "./pages/index";

import MasterAccess from "./pages/master-access";
import ProfileCustomization from "./pages/profile-customization";
import ProtocolStrategy from "./pages/protocol-strategy";
import EnterpriseSuite from "./pages/enterprise-suite";
import PremiumFeaturesPage from "./pages/premium-features";
import ViralTools from "./pages/viral-tools";
import MasterAdmin from "./pages/MasterAdmin";
import ContactInfo from "./components/ContactInfo";
import Notifications from "./pages/Notifications";
import BillingDashboard from "./pages/BillingDashboard";
import Landing from "./pages/Landing";
import { useAuth } from "./hooks/useAuth";
import Login from "./pages/Login";
import PrivacyPolicy from "./pages/legal/privacy";
import { AuthProvider } from "@/hooks/useAuth";
import TermsOfService from "./pages/legal/terms";
import SecurityPolicy from "./pages/legal/security";
import SimpleTokenLaunch from "@/pages/simple-token-launch";
import SimpleHome from "@/pages/simple-home";
import WorkingProfileDashboard from "@/components/profile/WorkingProfileDashboard";
import StripeCheckout from "@/components/payments/StripeCheckout";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboardPage from "./pages/AdminDashboard";

import BlockchainPlayground from "./pages/blockchain-playground";
import SpecializedIntake from "./pages/specialized-intake";
import WhistleblowerSanctuary from "./pages/whistleblower-sanctuary";
import CategoryDiscovery from "./pages/category-discovery";
import Whitepapers from "./pages/whitepapers";
import MyListings from "./pages/my-listings";
import TokenListings from "./pages/token-listings";
import GTTLaunch from "./pages/gtt-launch";
import SupabaseSecurity from "./pages/supabase-security";
import TeamsUpgrades from "./pages/teams-upgrades";
import ApiStatus from "./pages/api-status";
import UnifiedLogin from "./pages/UnifiedLogin";
import { CompleteAuthProvider } from "./hooks/useCompleteAuth";
import RoleBasedDashboard from "./components/auth/RoleBasedDashboard";
import EnhancedCommanderDashboard from "./components/admin/EnhancedCommanderDashboard";
import EnhancedFounderDashboard from "./components/admin/EnhancedFounderDashboard";
import SupabaseAssetManager from "./components/assets/SupabaseAssetManager";
import AssetIntegration from "./pages/asset-integration";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <EnhancedMegaNavigation />
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/" component={Homepage} />
        <Route path="/gtt-launch" component={GTTLaunch} />
        <Route path="/home" component={SimpleHome} />
        <Route path="/create" component={CreateCapsule} />
        <Route path="/explore" component={Explore} />
        <Route path="/leaderboard" component={Leaderboard} />
        <Route
          path="/profile/:id?"
          component={() => <WorkingProfileDashboard user={undefined} />}
        />
        <Route
          path="/profile"
          component={() => <WorkingProfileDashboard user={undefined} />}
        />
        <Route path="/my-listings" component={MyListings} />
        <Route path="/token-listings" component={TokenListings} />
        <Route path="/gtt-launch" component={GTTLaunch} />
        <Route
          path="/auth-hub"
          component={() => <AuthenticationHub onAuthenticated={() => {}} />}
        />
        <Route path="/onboarding" component={OnboardingPage} />
        <Route path="/capsule/:id" component={CapsuleDetail} />
        <Route path="/governance" component={Governance} />
        <Route path="/private" component={PrivateFeed} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/commander" component={Commander} />

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
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/config" component={ConfigPage} />
        <Route path="/reporting" component={ReportingDashboard} />
        <Route path="/dashboard" component={CommanderDashboard} />

        <Route path="/asset-integration" component={AssetIntegrationPage} />
        <Route path="/protocol-strategy" component={ProtocolStrategy} />
        <Route path="/enterprise-suite" component={EnterpriseSuite} />
        <Route path="/premium-features" component={PremiumFeaturesPage} />
        <Route path="/viral-tools" component={ViralTools} />
        <Route path="/master-admin" component={MasterAdmin} />
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
        <Route path="/unified-login" component={UnifiedLogin} />
        <Route path="/auth-dashboard" component={RoleBasedDashboard} />
        <Route path="/commander" component={EnhancedCommanderDashboard} />
        <Route path="/founder-dashboard" component={EnhancedFounderDashboard} />
        <Route path="/asset-manager" component={SupabaseAssetManager} />
        <Route path="/asset-integration" component={AssetIntegration} />
        <Route path="/upgrade" component={StripeCheckout} />
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/admin/dashboard" component={AdminDashboardPage} />

        {/* Legal Pages */}
        <Route path="/legal/privacy" component={PrivacyPolicy} />
        <Route path="/legal/terms" component={TermsOfService} />
        <Route path="/legal/security" component={SecurityPolicy} />

        <Route component={NotFound} />
      </Switch>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <CompleteAuthProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <WalletProvider>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
              <AssetProvider>
                <TooltipProvider>
                  <main className="flex-1">
                    <Router />
                  </main>
                  <Toaster />
                </TooltipProvider>
              </AssetProvider>
            </ThemeProvider>
          </WalletProvider>
        </AuthProvider>
      </QueryClientProvider>
    </CompleteAuthProvider>
  );
}

export default App;
