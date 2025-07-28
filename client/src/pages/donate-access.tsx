// Donate Unused Capsule Credits Page

import React, { useState } from "react";
import { donateCapsuleCredits } from "@/lib/donate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Heart, Users, Globe, ShieldCheck } from "lucide-react";
import { BRAND_COLORS, BRAND_NAME } from "@/lib/constants";

const donationCauses = [
  {
    id: "trauma-survivors",
    name: "Trauma Survivors",
    description:
      "Help survivors document their experiences for healing and legal protection",
    icon: <Heart className="w-5 h-5" />,
    recipients: 1247,
    color: "bg-red-600",
  },
  {
    id: "nonprofits",
    name: "Nonprofit Organizations",
    description:
      "Support NGOs documenting human rights violations and social impact",
    icon: <Users className="w-5 h-5" />,
    recipients: 856,
    color: "bg-blue-600",
  },
  {
    id: "public-truth",
    name: "Public Truth Initiatives",
    description:
      "Citizen journalism and community-driven truth verification projects",
    icon: <Globe className="w-5 h-5" />,
    recipients: 923,
    color: "bg-green-600",
  },
  {
    id: "whistleblowers",
    name: "Whistleblower Protection",
    description:
      "Anonymous capsule creation for reporting fraud and misconduct",
    icon: <ShieldCheck className="w-5 h-5" />,
    recipients: 445,
    color: "bg-purple-600",
  },
];

export default function DonateAccessPage() {
  const [amount, setAmount] = useState(1);
  const [selectedCause, setSelectedCause] = useState("trauma-survivors");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [isCustomRecipient, setIsCustomRecipient] = useState(false);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Mock user data - replace with actual user context
  const userCredits = 12; // Available credits to donate

  async function handleDonate(e: React.FormEvent) {
    e.preventDefault();

    if (amount > userCredits) {
      toast({
        title: "Insufficient Credits",
        description: `You only have ${userCredits} credits available to donate.`,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setStatus("Processing donation...");

    try {
      const recipient = isCustomRecipient ? recipientEmail : selectedCause;
      await donateCapsuleCredits({ to: recipient, amount });

      setStatus("Donation successful!");
      toast({
        title: "Donation Successful",
        description: `${amount} capsule credits donated successfully!`,
      });

      // Reset form
      setAmount(1);
      setRecipientEmail("");
    } catch (err: any) {
      const errorMessage = err.message || "Donation failed";
      setStatus("Error: " + errorMessage);
      toast({
        title: "Donation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <section className="pt-20 pb-8 bg-gradient-to-br from-purple-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Donate Capsule Credits</h1>
          <p className="text-xl text-slate-300 mb-6">
            Share your unused credits with those who need truth verification
            most
          </p>
          <Badge className="bg-purple-600 text-white px-4 py-2">
            <Heart className="w-4 h-4 mr-2" />
            Available Credits: {userCredits}
          </Badge>
        </div>
      </section>

      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Donation Form */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Heart
                    className="w-5 h-5 mr-2"
                    style={{ color: BRAND_COLORS.GUARDIAN }}
                  />
                  Make a Donation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleDonate} className="space-y-6">
                  {/* Amount Selection */}
                  <div>
                    <Label htmlFor="amount" className="text-slate-300">
                      Number of Credits to Donate
                    </Label>
                    <Input
                      id="amount"
                      type="number"
                      min={1}
                      max={userCredits}
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="mt-2 bg-slate-700 border-slate-600 text-white"
                      required
                    />
                    <p className="text-xs text-slate-400 mt-1">
                      Maximum: {userCredits} credits
                    </p>
                  </div>

                  {/* Recipient Type Toggle */}
                  <div>
                    <Label className="text-slate-300">Donation Target</Label>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="cause"
                          name="recipientType"
                          checked={!isCustomRecipient}
                          onChange={() => setIsCustomRecipient(false)}
                          className="text-purple-600"
                        />
                        <label htmlFor="cause" className="text-slate-300">
                          Donate to a cause
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="custom"
                          name="recipientType"
                          checked={isCustomRecipient}
                          onChange={() => setIsCustomRecipient(true)}
                          className="text-purple-600"
                        />
                        <label htmlFor="custom" className="text-slate-300">
                          Donate to specific person
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Cause Selection */}
                  {!isCustomRecipient && (
                    <div>
                      <Label className="text-slate-300">Select Cause</Label>
                      <div className="mt-2 space-y-2">
                        {donationCauses.map((cause) => (
                          <div
                            key={cause.id}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="radio"
                              id={cause.id}
                              name="cause"
                              value={cause.id}
                              checked={selectedCause === cause.id}
                              onChange={(e) => setSelectedCause(e.target.value)}
                              className="text-purple-600"
                            />
                            <label
                              htmlFor={cause.id}
                              className="text-slate-300 flex items-center"
                            >
                              <span
                                className={`p-1 rounded mr-2 ${cause.color}`}
                              >
                                {cause.icon}
                              </span>
                              {cause.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Custom Recipient */}
                  {isCustomRecipient && (
                    <div>
                      <Label htmlFor="recipient" className="text-slate-300">
                        Recipient Email or Wallet Address
                      </Label>
                      <Input
                        id="recipient"
                        type="text"
                        value={recipientEmail}
                        onChange={(e) => setRecipientEmail(e.target.value)}
                        placeholder="example@email.com or 0x..."
                        className="mt-2 bg-slate-700 border-slate-600 text-white"
                        required={isCustomRecipient}
                      />
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    style={{ backgroundColor: BRAND_COLORS.GUARDIAN }}
                    disabled={loading}
                  >
                    {loading
                      ? "Processing..."
                      : `Donate ${amount} Credit${amount !== 1 ? "s" : ""}`}
                  </Button>

                  {status && (
                    <p
                      className={`text-sm ${
                        status.includes("Error")
                          ? "text-red-400"
                          : "text-green-400"
                      }`}
                    >
                      {status}
                    </p>
                  )}
                </form>
              </CardContent>
            </Card>

            {/* Donation Impact */}
            <div className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Donation Impact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {donationCauses.map((cause) => (
                    <div
                      key={cause.id}
                      className="p-4 bg-slate-700/50 rounded-lg"
                    >
                      <div className="flex items-center mb-2">
                        <span className={`p-2 rounded mr-3 ${cause.color}`}>
                          {cause.icon}
                        </span>
                        <div>
                          <h4 className="text-white font-medium">
                            {cause.name}
                          </h4>
                          <p className="text-xs text-slate-400">
                            {cause.recipients} active recipients
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-slate-300">
                        {cause.description}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">How It Works</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-slate-300">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p>
                      Credits are transferred instantly to recipients' accounts
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p>
                      Recipients receive email notification with instructions
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p>
                      All donations are tracked for transparency and tax
                      purposes
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p>No fees - 100% of your donation reaches the recipient</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Impact Statement */}
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-purple-900/50 to-slate-800/50 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Your Impact Matters
              </h3>
              <p className="text-slate-300 max-w-2xl mx-auto">
                Donated capsule credits go directly to trauma survivors,
                nonprofits, and public truth initiatives. Each credit helps
                someone document their story, seek justice, or contribute to
                collective memory preservation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
