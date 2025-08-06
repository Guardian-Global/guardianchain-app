import SystemValidator from "@/components/SystemValidator";

export default function SystemValidationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            System Validation Suite
          </h1>
          <p className="text-slate-300 max-w-3xl mx-auto">
            Comprehensive testing of all GUARDIANCHAIN functionality including
            authentication flows, capsule lifecycle, yield mechanics, export
            capabilities, responsive design, and error handling.
          </p>
        </div>

        <SystemValidator />
      </div>
    </div>
  );
}
