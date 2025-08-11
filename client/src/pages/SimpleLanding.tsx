import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Shield, Lock, Zap, Globe2, Layers, Rocket, ArrowRight, Sparkles } from "lucide-react";

const SimpleLanding: React.FC = () => {
  return (
    <div className="min-h-screen relative overflow-hidden bg-[#06090f] text-white">
      {/* Background accents */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute top-1/2 -right-32 h-[32rem] w-[32rem] rounded-full bg-fuchsia-600/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-40 w-[60%] bg-gradient-to-r from-cyan-500/10 via-purple-500/5 to-transparent blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-20">
        {/* Hero */}
        <header className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/15 to-purple-500/15 border border-cyan-500/30 mb-8">
            <Sparkles className="w-4 h-4 text-cyan-300" />
            <span className="text-xs tracking-wide font-medium text-cyan-200">TRUST • VERIFICATION • LONGEVITY</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight bg-gradient-to-r from-cyan-300 via-white to-fuchsia-300 bg-clip-text text-transparent drop-shadow-sm">
            Preserve Truth. Reward Integrity.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            GuardianChain lets you seal verifiable moments, testimonies, and evidence into cryptographic time capsules. Each capsule earns yield through communal validation and powers an economy of verified truth.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/signup">
              <Button
                className="group relative overflow-hidden bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-400 hover:via-blue-400 hover:to-purple-500 text-white font-semibold px-10 py-6 text-lg rounded-xl shadow-lg shadow-cyan-500/25"
                data-testid="button-signup"
              >
                <span className="relative z-10 flex items-center">Launch Your Vault <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" /></span>
                <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button
                variant="outline"
                className="px-10 py-6 text-lg rounded-xl border-slate-600 text-slate-200 hover:bg-slate-800/60 hover:text-white backdrop-blur"
                data-testid="button-login"
              >
                Sign In
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-xs uppercase tracking-wider text-slate-400">No speculation—utility, provenance & verifiable impact.</p>
        </header>

        {/* Feature Grid */}
        <section className="grid md:grid-cols-3 gap-8 mb-24">
          {[
            {
              icon: <Lock className="w-6 h-6" />,
              title: "Sealed Time Capsules",
              desc: "Timestamped, tamper‑evident containers anchoring human memory and factual testimony to decentralized ledgers.",
              accent: "from-cyan-500/10 to-cyan-400/0 border-cyan-400/30"
            },
            {
              icon: <Zap className="w-6 h-6" />,
              title: "Yield From Verification",
              desc: "Earn GTT emissions as your capsules gather peer attestations and integrity scores across the network.",
              accent: "from-purple-500/10 to-purple-400/0 border-purple-400/30"
            },
            {
              icon: <Globe2 className="w-6 h-6" />,
              title: "Collective Consensus",
              desc: "Layered validation using crowd heuristics + AI anomaly detection to elevate authentic, enduring signals.",
              accent: "from-fuchsia-500/10 to-fuchsia-400/0 border-fuchsia-400/30"
            }
          ].map((f, i) => (
            <Card key={i} className={`relative overflow-hidden bg-[#0c121a]/80 backdrop-blur-xl border ${f.accent} group`}> 
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none from-white/5 to-transparent" />
              <CardHeader className="pb-2 flex flex-row items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-slate-700/40 to-slate-800/60 text-cyan-200 ring-1 ring-white/10">
                  {f.icon}
                </div>
                <CardTitle className="text-base tracking-wide text-slate-100">{f.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 text-sm text-slate-400 leading-relaxed">
                {f.desc}
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Value Props */}
        <section className="grid md:grid-cols-2 gap-10 mb-24">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent mb-4">Why GuardianChain?</h2>
              <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                Attention markets amplify noise. GuardianChain inverts the model: verified continuity and factual scarcity become the yield source. Every validated capsule strengthens a provenance lattice—an open, composable substrate for historical, legal, scientific, and cultural integrity layers.
              </p>
            </div>
            <ul className="space-y-4 text-sm">
              {[
                { icon: <Layers className="w-4 h-4 text-cyan-400" />, label: "Composable on-chain attestations & cross‑chain anchors" },
                { icon: <Rocket className="w-4 h-4 text-purple-400" />, label: "Progressive decentralization roadmap with validator incentives" },
                { icon: <Shield className="w-4 h-4 text-fuchsia-400" />, label: "Cryptographic integrity + multi-source fraud resistance" },
                { icon: <Zap className="w-4 h-4 text-amber-400" />, label: "Dynamic yield curves rewarding enduring relevance" },
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-300">
                  <span className="mt-1">{item.icon}</span>
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-br from-cyan-500/40 to-purple-600/40 rounded-2xl blur opacity-60" />
            <div className="relative rounded-2xl border border-slate-700/60 bg-[#0b1219]/80 backdrop-blur-xl p-8 space-y-6">
              <h3 className="text-xl font-semibold text-slate-200 flex items-center gap-2">
                <Shield className="w-5 h-5 text-cyan-300" /> Guardian Capsule Lifecycle
              </h3>
              <ol className="space-y-4 text-slate-400 text-sm list-decimal list-inside">
                <li>Author seals data → cryptographic fingerprint anchored.</li>
                <li>Network validators + AI models score integrity & anomaly risk.</li>
                <li>Community attestation accrues—capsule yield adjusts over time.</li>
                <li>Redeemable value & historical relevance become verifiable assets.</li>
              </ol>
              <p className="text-slate-300 text-sm leading-relaxed">
                This pipeline forms a living archive that compounds value through collective trust rather than speculative churn.
              </p>
            </div>
          </div>
        </section>

        {/* Secondary CTA */}
        <section className="text-center mb-28">
          <div className="relative inline-flex flex-col items-center">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-fuchsia-500 rounded-2xl blur opacity-40" />
            <div className="relative bg-[#0b1219]/90 border border-slate-700/60 rounded-2xl px-10 py-12 space-y-6 max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-cyan-200 via-white to-purple-200 bg-clip-text text-transparent">
                Start Preserving Authenticity
              </h2>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                Your first capsules help bootstrap the verifiable memory graph. Join early, shape governance, and participate in calibrating the integrity economy.
              </p>
              <Link href="/auth/signup">
                <Button className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 px-8 py-5 rounded-xl text-base font-semibold">
                  Create Your First Capsule
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-xs text-slate-600">
          <p>© {new Date().getFullYear()} GuardianChain. Integrity Layer for Human Knowledge.</p>
        </footer>
      </div>
    </div>
  );
};

export default SimpleLanding;