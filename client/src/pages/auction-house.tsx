import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import TruthAuctionPanel from "@/components/web3/TruthAuctionPanel";
import { BRAND_NAME } from "@/lib/constants";

export default function AuctionHousePage() {
  return (
    <div className="min-h-screen pt-20 pb-12 bg-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/">
            <button className="flex items-center gap-2 text-slate-400 hover:text-white mb-4 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </button>
          </Link>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent">
            {BRAND_NAME} Auction House
          </h1>
          <p className="text-slate-400 text-lg max-w-3xl">
            Participate in truth value discovery through decentralized auctions.
            Bid on capsule yield rights and help establish fair market pricing
            for verified content.
          </p>
        </div>

        <TruthAuctionPanel />
      </div>
    </div>
  );
}
