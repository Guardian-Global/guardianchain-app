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
import SealDemo from "@/pages/seal-demo";
import NFTDemo from "@/pages/nft-demo";
import CapsuleDetail from "@/pages/capsule-detail";
import ShareDemo from "@/pages/share-demo";
import AnalyticsDemo from "@/pages/analytics-demo";
import Web3Demo from "@/pages/web3-demo";
import SmartContractDemo from "@/pages/smart-contract-demo";
import Governance from "@/pages/governance";
import PrivateFeed from "@/pages/private";
import Dashboard from "@/pages/dashboard";
import Commander from "@/pages/commander";
import ContractDemo from "@/pages/contract-demo";
import MintNFT from "@/pages/mint-nft";
import NotFound from "@/pages/not-found";

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
        <Route path="/seal-demo" component={SealDemo} />
        <Route path="/nft-demo" component={NFTDemo} />
        <Route path="/capsule/:id" component={CapsuleDetail} />
        <Route path="/share-demo" component={ShareDemo} />
        <Route path="/analytics-demo" component={AnalyticsDemo} />
        <Route path="/web3-demo" component={Web3Demo} />
        <Route path="/smart-contract-demo" component={SmartContractDemo} />
        <Route path="/governance" component={Governance} />
        <Route path="/private" component={PrivateFeed} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/commander" component={Commander} />
        <Route path="/contract-demo" component={ContractDemo} />
        <Route path="/mint-nft" component={MintNFT} />
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
