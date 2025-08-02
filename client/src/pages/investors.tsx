import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  TrendingUp,
  DollarSign,
  Users,
  Globe,
  Shield,
  Zap,
  Award,
  BarChart3,
  Target,
  Rocket,
  Mail,
  Download,
  ExternalLink,
  Lock,
  Crown,
} from "lucide-react";

interface InvestmentMetric {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "stable";
}

export default function InvestorsPage() {
  const [contactForm, setContactForm] = useState({
    name: "",
    organization: "",
    email: "",
    investmentRange: "",
    message: "",
  });

  const metrics: InvestmentMetric[] = [
    {
      label: "Total Value Locked",
      value: "$2.4M",
      change: "+15%",
      trend: "up",
    },
    { label: "Active Users", value: "12,847", change: "+23%", trend: "up" },
    { label: "GTT Market Cap", value: "$890K", change: "+8%", trend: "up" },
    { label: "Platform Revenue", value: "$156K", change: "+31%", trend: "up" },
    {
      label: "Verified Capsules",
      value: "45,231",
      change: "+12%",
      trend: "up",
    },
    {
      label: "Global Reach",
      value: "67 Countries",
      change: "+5%",
      trend: "up",
    },
  ];

  const investmentTiers = [
    {
      name: "Seed Round",
      amount: "$500K - $2M",
      equity: "5-15%",
      status: "Active",
      perks: [
        "Board Observer Rights",
        "Quarterly Reports",
        "Platform Beta Access",
      ],
      badge: "seed",
    },
    {
      name: "Series A",
      amount: "$2M - $10M",
      equity: "10-25%",
      status: "Planning",
      perks: [
        "Board Seat",
        "Monthly Reports",
        "Strategic Partnerships",
        "Token Allocation",
      ],
      badge: "series-a",
    },
    {
      name: "Strategic",
      amount: "$1M+",
      equity: "Negotiable",
      status: "Open",
      perks: [
        "Custom Terms",
        "Technology Partnership",
        "Integration Opportunities",
      ],
      badge: "strategic",
    },
  ];

  const teamMembers = [
    {
      name: "Alex Chen",
      role: "Founder & CEO",
      background: "Former Meta AI, Stanford CS",
      expertise: "Blockchain, AI, Product Strategy",
    },
    {
      name: "Sarah Martinez",
      role: "CTO",
      background: "Ex-Google, MIT PhD",
      expertise: "Distributed Systems, Cryptography",
    },
    {
      name: "David Kim",
      role: "Head of Growth",
      background: "Former Coinbase, Harvard MBA",
      expertise: "Product Growth, Community Building",
    },
  ];

  const useCase = [
    {
      title: "Digital Memory Preservation",
      description: "Immutable storage of personal and institutional memories",
      market: "$45B+ Digital Archiving Market",
    },
    {
      title: "Truth Verification",
      description: "AI-powered content authenticity and fact-checking",
      market: "$12B+ Content Verification Market",
    },
    {
      title: "Decentralized Governance",
      description: "Community-driven decision making and reputation systems",
      market: "$8B+ DAO and Governance Market",
    },
    {
      title: "NFT & Digital Collectibles",
      description: "Unique truth capsules as verifiable digital assets",
      market: "$35B+ NFT Market",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle contact form submission
    console.log("Investor contact form submitted:", contactForm);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "down":
        return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
      default:
        return <TrendingUp className="w-4 h-4 text-gray-500" />;
    }
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "seed":
        return "bg-green-100 text-green-800";
      case "series-a":
        return "bg-blue-100 text-blue-800";
      case "strategic":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 text-white">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <Crown className="w-16 h-16 text-yellow-400 mr-4" />
              <h1 className="text-5xl font-bold">GuardianChain</h1>
            </div>
            <h2 className="text-3xl font-semibold mb-6">
              Revolutionizing Truth Preservation & Digital Memory
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
              Join us in building the world's first sovereign memory
              infrastructure. Combining blockchain technology, AI verification,
              and community governance to preserve truth for future generations.
            </p>
            <div className="flex justify-center space-x-4">
              <Button
                size="lg"
                className="bg-yellow-500 hover:bg-yellow-600 text-black"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Pitch Deck
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-black"
              >
                <Mail className="w-5 h-5 mr-2" />
                Contact Team
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Key Metrics */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            Platform Performance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {metrics.map((metric, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {metric.label}
                      </p>
                      <p className="text-2xl font-bold">{metric.value}</p>
                      <div className="flex items-center mt-1">
                        {getTrendIcon(metric.trend)}
                        <span
                          className={`text-sm ml-1 ${
                            metric.trend === "up"
                              ? "text-green-600"
                              : metric.trend === "down"
                                ? "text-red-600"
                                : "text-gray-600"
                          }`}
                        >
                          {metric.change}
                        </span>
                      </div>
                    </div>
                    <BarChart3 className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Market Opportunity */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            Market Opportunity
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-6 h-6 mr-2" />
                  Total Addressable Market
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    $100B+
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Combined digital archiving, content verification, and
                    blockchain markets
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Rocket className="w-6 h-6 mr-2" />
                  Growth Projections
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Year 1 Revenue</span>
                    <span className="font-bold">$2.5M</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Year 3 Revenue</span>
                    <span className="font-bold">$25M</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Year 5 Revenue</span>
                    <span className="font-bold">$100M+</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Use Cases */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Key Use Cases</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {useCase.map((item, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {item.description}
                  </p>
                  <Badge
                    variant="outline"
                    className="text-green-600 border-green-600"
                  >
                    {item.market}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Investment Tiers */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            Investment Opportunities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {investmentTiers.map((tier, index) => (
              <Card key={index} className="relative">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{tier.name}</CardTitle>
                    <Badge className={getBadgeColor(tier.badge)}>
                      {tier.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Investment Range
                      </p>
                      <p className="text-2xl font-bold">{tier.amount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Equity Range
                      </p>
                      <p className="text-lg font-semibold">{tier.equity}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Investor Perks
                      </p>
                      <ul className="space-y-1">
                        {tier.perks.map((perk, perkIndex) => (
                          <li
                            key={perkIndex}
                            className="flex items-center text-sm"
                          >
                            <Shield className="w-3 h-3 mr-2 text-green-500" />
                            {perk}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            Leadership Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {teamMembers.map((member, index) => (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-2">
                    {member.role}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {member.background}
                  </p>
                  <p className="text-xs text-gray-500">{member.expertise}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Technology Stack */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            Technology Advantages
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Shield className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Blockchain Security</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Immutable storage with cryptographic verification
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Zap className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">AI Verification</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Advanced ML models for content authenticity
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Globe className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Global Scale</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Distributed infrastructure for worldwide access
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Award className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Token Economics</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Sustainable yield generation and governance
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Contact Form */}
        <section className="mb-16">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center flex items-center justify-center">
                <Mail className="w-6 h-6 mr-2" />
                Investor Contact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Name *
                    </label>
                    <Input
                      value={contactForm.name}
                      onChange={(e) =>
                        setContactForm((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Organization *
                    </label>
                    <Input
                      value={contactForm.organization}
                      onChange={(e) =>
                        setContactForm((prev) => ({
                          ...prev,
                          organization: e.target.value,
                        }))
                      }
                      placeholder="Investment firm / Fund name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email *
                  </label>
                  <Input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) =>
                      setContactForm((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Investment Range
                  </label>
                  <select
                    value={contactForm.investmentRange}
                    onChange={(e) =>
                      setContactForm((prev) => ({
                        ...prev,
                        investmentRange: e.target.value,
                      }))
                    }
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                  >
                    <option value="">Select range...</option>
                    <option value="<$500K">Under $500K</option>
                    <option value="$500K-$2M">$500K - $2M</option>
                    <option value="$2M-$10M">$2M - $10M</option>
                    <option value="$10M+">$10M+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Message
                  </label>
                  <Textarea
                    value={contactForm.message}
                    onChange={(e) =>
                      setContactForm((prev) => ({
                        ...prev,
                        message: e.target.value,
                      }))
                    }
                    placeholder="Tell us about your investment thesis and interests..."
                    rows={4}
                  />
                </div>

                <Button type="submit" className="w-full" size="lg">
                  <Lock className="w-5 h-5 mr-2" />
                  Send Secure Message
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  All communications are confidential and protected by NDA
                </p>
              </form>
            </CardContent>
          </Card>
        </section>

        {/* Additional Resources */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-8">
            Additional Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Download className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Pitch Deck</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Comprehensive overview of our vision, market, and opportunity
                </p>
                <Button variant="outline" className="w-full">
                  Download PDF
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <BarChart3 className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Financial Model</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Detailed projections and unit economics analysis
                </p>
                <Button variant="outline" className="w-full">
                  Request Access
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <ExternalLink className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Live Demo</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Experience the platform and see our technology in action
                </p>
                <Button variant="outline" className="w-full">
                  Schedule Demo
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
