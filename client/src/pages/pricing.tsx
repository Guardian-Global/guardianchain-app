import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Check,
  Crown,
  Zap,
  Users,
  Shield,
  FileText,
  TrendingUp,
  Star,
  ArrowRight,
  Building2,
  Sparkles,
} from "lucide-react";

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  const tiers = [
    {
      name: "Explorer",
      description: "Perfect for individuals getting started",
      icon: Users,
      price: { monthly: 0, annual: 0 },
      popular: false,
      features: [
        "View public truth capsules",
        "Basic verification participation",
        "Earn up to 10 GTT/month",
        "Community access",
        "Basic analytics",
        "Mobile app access",
      ],
      limitations: [
        "Limited capsule creation (3/month)",
        "Basic verification tools only",
        "Standard support",
      ],
      cta: "Start Free",
      ctaAction: () => (window.location.href = "/api/login"),
    },
    {
      name: "Pro",
      description: "For active truth verifiers and content creators",
      icon: Star,
      price: { monthly: 29, annual: 290 },
      popular: true,
      features: [
        "Unlimited truth capsule creation",
        "Access to Veritas tools suite",
        "Advanced analytics dashboard",
        "Earn up to 500 GTT/month",
        "Priority verification queue",
        "Advanced privacy controls",
        "DocuSign integration",
        "Truth bounty participation",
        "Customizable verification criteria",
        "Export data and reports",
      ],
      limitations: [],
      cta: "Upgrade to Pro",
      ctaAction: () => (window.location.href = "/api/login"),
    },
    {
      name: "Enterprise",
      description: "For organizations and institutions",
      icon: Building2,
      price: { monthly: "Custom", annual: "Custom" },
      popular: false,
      features: [
        "White-label solution",
        "API access & integrations",
        "Dedicated support manager",
        "Unlimited GTT earning potential",
        "Custom verification workflows",
        "Advanced security features",
        "Compliance reporting",
        "Team management tools",
        "Custom branding",
        "SLA guarantees",
        "Priority development requests",
      ],
      limitations: [],
      cta: "Contact Sales",
      ctaAction: () => (window.location.href = "/contact"),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <section className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-300">
              Start earning GTT tokens today
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-white">Choose Your</span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Truth Verification Plan
            </span>
          </h1>

          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Join thousands earning rewards for truth verification. Scale from
            individual explorer to enterprise deployment.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span
              className={`text-sm ${!annual ? "text-white" : "text-slate-400"}`}
            >
              Monthly
            </span>
            <Switch
              checked={annual}
              onCheckedChange={setAnnual}
              className="data-[state=checked]:bg-blue-600"
            />
            <span
              className={`text-sm ${annual ? "text-white" : "text-slate-400"}`}
            >
              Annual
            </span>
            {annual && (
              <Badge className="bg-green-600 text-white ml-2">Save 17%</Badge>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tiers.map((tier, index) => {
              const Icon = tier.icon;
              const price = tier.price[annual ? "annual" : "monthly"];

              return (
                <Card
                  key={tier.name}
                  className={`relative ${
                    tier.popular
                      ? "bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-500 shadow-2xl shadow-blue-500/20 scale-105"
                      : "bg-slate-800 border-slate-700"
                  } hover:shadow-xl transition-all duration-300`}
                >
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1">
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-4">
                    <div
                      className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                        tier.popular
                          ? "bg-gradient-to-r from-blue-600 to-purple-600"
                          : "bg-slate-700"
                      }`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    <CardTitle className="text-2xl font-bold text-white">
                      {tier.name}
                    </CardTitle>

                    <p className="text-slate-400 text-sm">{tier.description}</p>

                    <div className="mt-4">
                      {typeof price === "number" ? (
                        <div>
                          <span className="text-4xl font-bold text-white">
                            ${price}
                          </span>
                          <span className="text-slate-400 text-sm">
                            /{annual ? "year" : "month"}
                          </span>
                          {annual && price > 0 && (
                            <div className="text-green-400 text-xs mt-1">
                              Save ${(price / 10) * 12 - price}/year
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-2xl font-bold text-white">
                          {price}
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    {/* Features */}
                    <div className="space-y-3 mb-6">
                      {tier.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                          <span className="text-slate-300 text-sm">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Limitations */}
                    {tier.limitations.length > 0 && (
                      <div className="space-y-2 mb-6 border-t border-slate-700 pt-4">
                        <div className="text-slate-400 text-xs uppercase tracking-wide">
                          Limitations
                        </div>
                        {tier.limitations.map((limitation, i) => (
                          <div key={i} className="text-slate-500 text-sm">
                            • {limitation}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* CTA Button */}
                    <Button
                      className={`w-full ${
                        tier.popular
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          : tier.name === "Explorer"
                            ? "bg-slate-700 hover:bg-slate-600 text-white"
                            : "border-slate-600 hover:bg-slate-800"
                      }`}
                      variant={
                        tier.popular || tier.name === "Explorer"
                          ? "default"
                          : "outline"
                      }
                      onClick={tier.ctaAction}
                    >
                      {tier.cta}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* GTT Token Economics */}
      <section className="py-16 bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            Earning Potential with GTT Tokens
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-amber-900/20 to-amber-800/20 border-amber-700/50">
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-amber-400 mb-2">
                  Current GTT Price
                </h3>
                <div className="text-2xl font-bold text-white mb-1">
                  $0.0075
                </div>
                <div className="text-green-400 text-sm">+19.05% (24h)</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 border-blue-700/50">
              <CardContent className="p-6 text-center">
                <FileText className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-blue-400 mb-2">
                  Per Capsule
                </h3>
                <div className="text-2xl font-bold text-white mb-1">
                  5-50 GTT
                </div>
                <div className="text-slate-400 text-sm">$0.04-$0.38 USD</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 border-purple-700/50">
              <CardContent className="p-6 text-center">
                <Shield className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-purple-400 mb-2">
                  Per Verification
                </h3>
                <div className="text-2xl font-bold text-white mb-1">
                  2-15 GTT
                </div>
                <div className="text-slate-400 text-sm">$0.02-$0.11 USD</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-900/20 to-green-800/20 border-green-700/50">
              <CardContent className="p-6 text-center">
                <Crown className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-green-400 mb-2">
                  Monthly Potential
                </h3>
                <div className="text-2xl font-bold text-white mb-1">
                  500+ GTT
                </div>
                <div className="text-slate-400 text-sm">$3.75+ USD (Pro)</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-2">
                  How do I earn GTT tokens?
                </h3>
                <p className="text-slate-300">
                  Create truth capsules that get verified by the community,
                  participate in verification of others' submissions, and stake
                  your GTT tokens for governance rewards. The more accurate your
                  contributions, the more you earn.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Can I upgrade or downgrade my plan?
                </h3>
                <p className="text-slate-300">
                  Yes, you can change your plan at any time. Upgrades take
                  effect immediately, and downgrades take effect at your next
                  billing cycle. All earned GTT tokens remain in your wallet
                  regardless of plan changes.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-2">
                  What are Veritas tools?
                </h3>
                <p className="text-slate-300">
                  Professional truth verification suite including Veritas Seal
                  (DocuSign integration), Truth Bounty (crowdsourced
                  investigations), Truth Redemption (accountability platform),
                  and Conspiracy Capsule (secure disclosure portal).
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Is my data secure and private?
                </h3>
                <p className="text-slate-300">
                  Yes, we use blockchain technology for immutable truth
                  verification with advanced privacy controls. You control who
                  can access your capsules and at what verification level.
                  Enterprise plans include additional security features and
                  compliance reporting.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6 text-white">
            Ready to Start Earning?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Join the truth verification revolution. Start with Explorer tier and
            upgrade as you grow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4"
              onClick={() => (window.location.href = "/api/login")}
            >
              Start Free Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-4"
              onClick={() => (window.location.href = "/contact")}
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
