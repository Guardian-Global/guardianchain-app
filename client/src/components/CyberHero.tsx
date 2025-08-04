export default function CyberHero() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#0d1117] text-[#f5f5f5] p-8 relative overflow-hidden">
      {/* Neon gradient blur backdrop */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#00ffe1]/10 to-[#ff00d4]/10 blur-3xl" />

      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-center font-[Orbitron] drop-shadow-[0_0_15px_rgba(0,255,225,0.4)]">
        GuardianChain
      </h1>
      <p className="mt-6 text-xl md:text-2xl max-w-2xl text-center text-[#94a3b8]">
        The sovereign memory chain. Immutable. AI-powered. Yours forever.
      </p>

      <div className="mt-10 flex flex-wrap gap-4">
        <a
          href="https://guardianchain.app"
          className="px-6 py-3 text-lg font-bold rounded-full bg-[#00ffe1] text-[#0d1117] hover:bg-[#00e5cb] shadow-[0_0_15px_#00ffe1] transition"
        >
          Launch App
        </a>
        <a
          href="/docs/Grant_Applicant_FAQ.pdf"
          className="px-6 py-3 text-lg font-bold rounded-full border border-[#ff00d4] text-[#ff00d4] hover:bg-[#ff00d4]/10 shadow-[0_0_12px_#ff00d4] transition"
        >
          Grant FAQ ↗
        </a>
      </div>
    </div>
  );
}