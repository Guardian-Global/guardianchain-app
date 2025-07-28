import RecommendationEngine from "@/components/recommendations/RecommendationEngine";

export default function RecommendationsPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">
            AI-Powered Recommendations
          </h1>
          <p className="text-slate-400 text-lg">
            Discover personalized truth capsules powered by advanced AI analysis
          </p>
        </div>

        <RecommendationEngine />
      </div>
    </div>
  );
}
