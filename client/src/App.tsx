import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/web3/theme-provider";
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
        <Route component={NotFound} />
      </Switch>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
