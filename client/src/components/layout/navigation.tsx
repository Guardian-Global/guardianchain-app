import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Shield, Menu, X, Coins, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import WalletConnect from "@/components/web3/wallet-connect";
import { useTheme } from "@/components/web3/theme-provider";

const navigation = [
  { name: "Explore", href: "/explore" },
  { name: "Create", href: "/create" },
  { name: "Leaderboard", href: "/leaderboard" },
  { name: "Profile", href: "/profile" },
  { name: "Private", href: "/private" },
  { name: "Dashboard", href: "/dashboard" },
  { name: "Commander", href: "/commander" },
  { name: "Contracts", href: "/contract-demo" },
  { name: "Mint NFT", href: "/mint-nft" },
  { name: "Govern", href: "/govern" },
  { name: "AI Recommendations", href: "/recommendations" },
  { name: "Enhanced Profile", href: "/enhanced-profile" },
  { name: "Explorer", href: "/explorer" },
  { name: "Enhanced Leaderboard", href: "/enhanced-leaderboard" },
  { name: "Certify", href: "/certify" },
  { name: "Insights", href: "/insight" },
  { name: "Capsule Forge", href: "/capsule-forge" },
  { name: "Stake", href: "/stake" },
  { name: "Launchpad", href: "/launchpad" },
  { name: "Referrals", href: "/referral" },
  { name: "Airdrop", href: "/airdrop" },
  { name: "Auction House", href: "/auction-house" },
  { name: "Yield Tracker", href: "/yield-tracker" },
  { name: "Governance", href: "/governance" },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-glass border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/">
              <div className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                  <Shield className="text-white h-5 w-5" />
                </div>
                <span className="text-xl font-bold">
                  <span style={{ color: "#7F5AF0" }}>GUARDIAN</span>
                  <span style={{ color: "#2CB67D" }}>CHAIN</span>
                </span>
              </div>
            </Link>
            <div className="hidden md:flex space-x-6">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant="ghost"
                    className={`text-slate-300 hover:text-white transition-colors ${
                      location === item.href ? "text-primary" : ""
                    }`}
                  >
                    {item.name}
                  </Button>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:block">
              <div className="flex items-center space-x-2 bg-slate-800 rounded-lg px-3 py-2">
                <Coins className="h-4 w-4 text-amber-400" />
                <span className="text-sm font-mono">1,247 GTT</span>
              </div>
            </div>
            
            <WalletConnect />
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-slate-300 hover:text-white"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {/* Mobile menu */}
            <div className="md:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-slate-300">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-slate-900 border-slate-800">
                  <div className="flex flex-col space-y-4 mt-8">
                    {navigation.map((item) => (
                      <Link key={item.name} href={item.href}>
                        <Button
                          variant="ghost"
                          className={`w-full justify-start text-slate-300 hover:text-white ${
                            location === item.href ? "text-primary" : ""
                          }`}
                          onClick={() => setIsOpen(false)}
                        >
                          {item.name}
                        </Button>
                      </Link>
                    ))}
                    <div className="pt-4 border-t border-slate-800">
                      <div className="flex items-center space-x-2 bg-slate-800 rounded-lg px-3 py-2 mb-4">
                        <Coins className="h-4 w-4 text-amber-400" />
                        <span className="text-sm font-mono">1,247 GTT</span>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
