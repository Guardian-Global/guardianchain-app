import React from "react";
import { Dialog } from "@headlessui/react";
import { useState } from "react";
import { Search, Home, User, Zap, Globe, Shield, Clock, Coins, TrendingUp, Settings, X, Menu, ChevronRight } from "lucide-react";
import { Link } from "wouter";

const navigationCategories = [
  {
    name: "Core",
    icon: Home,
    items: [
      { name: "Dashboard", href: "/dashboard", description: "Your control center", icon: Home },
      { name: "Capsule Explorer", href: "/explorer", description: "Discover and verify truth capsules", icon: Search },
      { name: "Social Hub", href: "/social", description: "Connect with guardians", icon: User },
      { name: "Create Capsule", href: "/create", description: "Submit truth capsules", icon: Zap },
    ]
  },
  {
    name: "Truth Tools",
    icon: Shield,
    items: [
      { name: "Truth Genome", href: "/truth-genome", description: "Emotion & authenticity analysis", icon: Zap },
      { name: "Capsule Viewer", href: "/capsule/demo", description: "Detailed capsule analysis", icon: Shield },
      { name: "Truth Auctions", href: "/truth-auctions", description: "Crowdfund disclosures", icon: Coins },
      { name: "Lineage Tracker", href: "/lineage", description: "Follow truth origins", icon: TrendingUp },
    ]
  },
  {
    name: "Blockchain",
    icon: Coins,
    items: [
      { name: "GTT Vault", href: "/gtt-vault", description: "Token management", icon: Coins },
      { name: "NFT Gallery", href: "/nft-gallery", description: "Minted capsules", icon: TrendingUp },
      { name: "Staking", href: "/stake", description: "Earn yield rewards", icon: Clock },
      { name: "Governance", href: "/dao", description: "Vote on proposals", icon: Settings },
    ]
  },
  {
    name: "Network",
    icon: Globe,
    items: [
      { name: "Guardian Map", href: "/guardian-map", description: "Global network", icon: Globe },
      { name: "Truth Net", href: "/truth-net", description: "Memory visualization", icon: TrendingUp },
      { name: "Leaderboard", href: "/leaderboard", description: "Top contributors", icon: Shield },
      { name: "Partners", href: "/partners", description: "Ecosystem allies", icon: User },
    ]
  }
];

const quickActions = [
  { name: "Quick Create", href: "/create", icon: Zap, color: "bg-cyan-500" },
  { name: "Wallet", href: "/wallet", icon: Coins, color: "bg-purple-500" },
  { name: "Notifications", href: "/notifications", icon: Settings, color: "bg-green-500" },
];

export default function EnhancedMegaNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(0);

  const filteredItems = navigationCategories.flatMap(category =>
    category.items.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 hover:border-cyan-400 transition-all duration-200 group"
        aria-label="Open navigation"
      >
        <Menu className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300" />
      </button>

      {/* Navigation Modal */}
      <Dialog open={isOpen} onClose={setIsOpen} className="relative z-50">
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-6xl w-full bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-cyan-500/20 shadow-2xl overflow-hidden">
            
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-cyan-500/20">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">GuardianChain</h2>
                  <p className="text-sm text-cyan-400">Sovereign Web3 Truth Platform</p>
                </div>
              </div>
              
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="p-6 border-b border-cyan-500/20">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search features, pages, or actions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-cyan-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                />
              </div>
            </div>

            <div className="flex h-96">
              {/* Category Sidebar */}
              <div className="w-64 bg-slate-800/30 border-r border-cyan-500/20 p-4">
                <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wide">Categories</h3>
                <nav className="space-y-2">
                  {navigationCategories.map((category, index) => (
                    <button
                      key={category.name}
                      onClick={() => setActiveCategory(index)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeCategory === index
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                          : 'text-gray-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <category.icon className="w-4 h-4" />
                      <span className="font-medium">{category.name}</span>
                    </button>
                  ))}
                </nav>

                {/* Quick Actions */}
                <div className="mt-8">
                  <h4 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">Quick Actions</h4>
                  <div className="space-y-2">
                    {quickActions.map((action) => (
                      <Link key={action.name} href={action.href}>
                        <button 
                          onClick={() => setIsOpen(false)}
                          className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                        >
                          <div className={`w-6 h-6 rounded ${action.color} flex items-center justify-center`}>
                            <action.icon className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-sm">{action.name}</span>
                        </button>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 p-6">
                {searchQuery ? (
                  /* Search Results */
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Search Results ({filteredItems.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {filteredItems.map((item) => (
                        <Link key={item.name} href={item.href}>
                          <button
                            onClick={() => setIsOpen(false)}
                            className="w-full p-4 bg-slate-800/30 rounded-xl border border-transparent hover:border-cyan-500/30 hover:bg-slate-800/50 transition-all text-left group"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
                                <item.icon className="w-5 h-5 text-cyan-400" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-white group-hover:text-cyan-400 transition-colors">
                                  {item.name}
                                </h4>
                                <p className="text-sm text-gray-400">{item.description}</p>
                              </div>
                              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                            </div>
                          </button>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* Category Content */
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">
                      {navigationCategories[activeCategory].name}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {navigationCategories[activeCategory].items.map((item) => (
                        <Link key={item.name} href={item.href}>
                          <button
                            onClick={() => setIsOpen(false)}
                            className="w-full p-6 bg-slate-800/30 rounded-xl border border-transparent hover:border-cyan-500/30 hover:bg-slate-800/50 transition-all text-left group"
                          >
                            <div className="flex items-start space-x-4">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
                                <item.icon className="w-6 h-6 text-cyan-400" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-white group-hover:text-cyan-400 transition-colors mb-1">
                                  {item.name}
                                </h4>
                                <p className="text-sm text-gray-400 leading-relaxed">
                                  {item.description}
                                </p>
                              </div>
                              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors mt-1" />
                            </div>
                          </button>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-800/30 border-t border-cyan-500/20">
              <div className="flex items-center justify-between text-sm text-gray-400">
                <div>GuardianChain v3.0 • Truth Vault Protocol</div>
                <div className="flex items-center space-x-4">
                  <span>Press ESC to close</span>
                  <kbd className="px-2 py-1 bg-slate-700 rounded text-xs">ESC</kbd>
                </div>
              </div>
            </div>

          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}