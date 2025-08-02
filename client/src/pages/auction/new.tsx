import { useState } from "react";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function NewTruthAuctionPage() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [reservePrice, setReservePrice] = useState("");
  const [beneficiaries, setBeneficiaries] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim() || !reservePrice.trim()) {
      setError("All fields are required.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auction/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          summary,
          reservePrice: parseFloat(reservePrice),
          beneficiaries: beneficiaries.split(",").map((addr) => addr.trim()),
        }),
      });

      const json = await res.json();
      setLoading(false);
      
      if (json.id) {
        toast.success("Truth auction created successfully!");
        setLocation(`/auction/${json.id}`);
      } else {
        setError(json.error || "Auction creation failed.");
        toast.error(json.error || "Failed to create auction");
      }
    } catch (err) {
      setLoading(false);
      setError("Network error occurred");
      toast.error("Network error occurred");
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 text-white px-6 py-16">
      <ToastContainer position="bottom-right" autoClose={3000} />
      <Card className="bg-slate-800 p-8 max-w-2xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-6 text-center">📢 Launch Truth Auction</h1>
        <p className="text-slate-400 mb-8 text-center">
          Create a sealed disclosure capsule and set your own reserve. Let the crowd fund the truth they demand — and decide who benefits when it's revealed.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 text-sm text-slate-300">Truth Title *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Whistleblower Testimony 2020"
              className="bg-slate-700 text-white border-slate-600"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-slate-300">Summary *</label>
            <Textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={4}
              placeholder="Brief overview of what will be disclosed if reserve is met..."
              className="bg-slate-700 text-white border-slate-600"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-slate-300">Reserve Price (in GTT) *</label>
            <Input
              type="number"
              value={reservePrice}
              onChange={(e) => setReservePrice(e.target.value)}
              placeholder="e.g. 5000"
              className="bg-slate-700 text-white border-slate-600"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-slate-300">Beneficiaries (comma-separated wallet addresses)</label>
            <Input
              value={beneficiaries}
              onChange={(e) => setBeneficiaries(e.target.value)}
              placeholder="0xabc..., 0xdef..."
              className="bg-slate-700 text-white border-slate-600"
            />
          </div>

          {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

          <Button 
            type="submit" 
            disabled={loading} 
            className="w-full text-lg bg-indigo-600 hover:bg-indigo-700"
          >
            {loading ? "Sealing..." : "Create Truth Auction"}
          </Button>
        </form>
      </Card>
    </main>
  );
}