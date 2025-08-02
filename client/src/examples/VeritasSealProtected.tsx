export default function VeritasSealPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-8">
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-8">
          Veritas Seal Console
        </h1>
        <p className="text-xl text-slate-300 mb-8">
          DocuSign-powered legal verification for truth capsules
        </p>

        {/* All protected Veritas Seal UI here */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Create Legal Truth Capsule
          </h2>
          <p className="text-slate-300">
            This feature is only available to Pro and Admin users.
          </p>
        </div>
      </div>
    </div>
  );
}
