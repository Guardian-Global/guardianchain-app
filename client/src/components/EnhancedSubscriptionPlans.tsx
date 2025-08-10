import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Zap, Rocket, Building2, Star, TrendingUp, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const SUBSCRIPTION_TIERS = [
	{
		id: "seeker",
		name: "Seeker",
		price: 0,
		period: "month",
		popular: false,
		description: "Perfect for exploring GuardianChain's truth preservation capabilities",
		features: [
			"Mint 3 Capsules per month",
			"View and unlock public Capsules",
			"Access to Timeline + Profile",
			"Basic AI content analysis",
			"Community discussions",
			"Mobile app access"
		],
		limitations: [
			"Limited minting capacity",
			"No advanced AI features",
			"No time-release capsules"
		],
		cta: "Start Free",
		icon: Shield,
		gradient: "from-slate-600 to-slate-800"
	},
	{
		id: "creator",
		name: "Creator+",
		price: 5,
		period: "month",
		popular: true,
		description: "Ideal for content creators and storytellers monetizing their truth",
		features: [
			"Unlimited Capsule minting",
			"Access Sovereign AI scoring",
			"Enable time-release + private sharing",
			"Earn GTT share dividends (70% creator share)",
			"Advanced encryption options",
			"Priority content verification",
			"Analytics dashboard",
			"Custom capsule branding",
			"Referral program access"
		],
		limitations: [],
		valueProps: [
			"Break even with just 1 premium capsule unlock per month",
			"Average creators earn $25-75/month in GTT yield",
			"15-40% higher revenue share than YouTube/Patreon"
		],
		cta: "Upgrade to Creator+",
		icon: Crown,
		gradient: "from-purple-600 to-pink-600"
	},
	{
		id: "builder",
		name: "Builder API",
		price: 25,
		period: "month",
		popular: false,
		description: "For developers integrating GuardianChain's truth infrastructure into their applications",
		features: [
			"Developer API access (5,000 credits/month)",
			"Embed Capsule minting on any site",
			"Access Veritas AI scoring API",
			"Webhook integration support",
			"Custom brand white-labeling",
			"Priority email support",
			"SDK access and documentation",
			"Sandbox environment",
			"Advanced analytics API",
			"Bulk operations support"
		],
		limitations: [],
		valueProps: [
			"Replace expensive truth verification services (save $200+/month)",
			"Add sovereign content features to existing platforms",
			"Monetize your app users' content creation"
		],
		apiFeatures: [
			"Capsule creation API",
			"AI truth scoring endpoint",
			"Blockchain minting interface",
			"Content encryption API",
			"User authentication SDK"
		],
		cta: "Start Building",
		icon: Rocket,
		gradient: "from-blue-600 to-cyan-600"
	},
	{
		id: "guardian_patron",
		name: "Guardian Patron",
		price: 99,
		period: "month",
		popular: false,
		description: "For power users, validators, and platform stakeholders driving GuardianChain's future",
		features: [
			"Everything in Creator+ and Builder API",
			"Early DAO governance access",
			"Veritas Seal overlay privileges",
			"Capsule lineage support tools",
			"Advanced truth network analytics",
			"Private validator node access",
			"Exclusive community channels",
			"Monthly founder office hours",
			"Custom API rate limits (25K requests)",
			"Priority feature voting",
			"Revenue sharing eligibility"
		],
		limitations: [],
		valueProps: [
			"Potential DAO governance token airdrops",
			"Revenue sharing from platform growth",
			"Influence platform development direction",
			"Premium validator rewards"
		],
		exclusiveFeatures: [
			"Truth Bounty creation privileges",
			"Cross-capsule lineage mapping",
			"Advanced grief analytics",
			"Community moderation tools"
		],
		cta: "Become a Guardian",
		icon: Building2,
		gradient: "from-yellow-600 to-orange-600"
	}
];

const COMPETITIVE_COMPARISON = [
	{
		platform: "YouTube Premium",
		price: "$11.99/month",
		creatorShare: "55%",
		limitations: "Platform control, censorship risk, algorithm dependency"
	},
	{
		platform: "Patreon Pro",
		price: "$12/month + 8% fees",
		creatorShare: "92%",
		limitations: "No content ownership, limited discovery, platform dependency"
	},
	{
		platform: "Substack Pro",
		price: "$10/month",
		creatorShare: "90%",
		limitations: "Text-centric, limited multimedia, no blockchain backing"
	}
];

export default function EnhancedSubscriptionPlans() {
	const [selectedTier, setSelectedTier] = useState("creator");
	const [showAnnual, setShowAnnual] = useState(false);

	const calculateAnnualPrice = (monthlyPrice: number) => {
		return monthlyPrice * 12 * 0.8; // 20% annual discount
	};

	const calculateROI = (tier: typeof SUBSCRIPTION_TIERS[0]) => {
		if (tier.id === "seeker") return null;
		if (tier.id === "creator") return "Break even with 1 capsule unlock/month";
		if (tier.id === "builder") return "Save $200+/month vs. traditional services";
		if (tier.id === "guardian_patron") return "Revenue sharing + governance rewards";
	};

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="text-center space-y-4">
				<h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
					Choose Your Sovereignty Level
				</h2>
				<p className="text-xl text-muted-foreground max-w-3xl mx-auto">
					Unlike legacy platforms that control your content, GuardianChain gives you true ownership plus higher revenue shares
				</p>
				{/* ...rest of component unchanged... */}
			</div>
		</div>
	);
}
