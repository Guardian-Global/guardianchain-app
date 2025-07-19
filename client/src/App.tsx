import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/web3/theme-provider";
import WalletProvider from "@/components/web3/wallet-provider";
import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import Home from "@/pages/home";
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
import ProtocolStrategy from "./pages/protocol-strategy";
import EnterpriseSuite from "./pages/enterprise-suite";
import PremiumFeaturesPage from "./pages/premium-features";
import ViralTools from "./pages/viral-tools";
import MasterAdmin from "./pages/MasterAdmin";
import ContactInfo from "./components/ContactInfo";
import Contact from "./pages/Contact";
import Notifications from "./pages/Notifications";

function Router() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Navigation />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/create" component={CreateCapsule} />
        <Route path="/explore" component={Explore} />
        <Route path="/leaderboard" component={Leaderboard} />
        <Route path="/profile/:id?" component={Profile} />
        <Route path="/profile" component={Profile} />
        <Route path="/auth" component={AuthenticationHub} />
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
        <Route path="/auction-house" component={AuctionHousePage} />
        <Route path="/embed/capsule" component={EmbedCapsulePage} />
        <Route path="/yield-tracker" component={YieldTrackerPage} />
        <Route path="/capsule-analytics" component={CapsuleAnalyticsPage} />
        <Route path="/capsule/:id/analytics" component={DynamicCapsuleAnalytics} />
        <Route path="/financial-dashboard" component={FinancialDashboard} />
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

        <Route component={NotFound} />
      </Switch>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <TooltipProvider>
            <Router />
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
      </WalletProvider>
    </QueryClientProvider>
  );
}

export default App;
