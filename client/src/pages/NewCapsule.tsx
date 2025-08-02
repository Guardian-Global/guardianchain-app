import { useState } from "react";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Loader2, CheckCircle, AlertCircle } from "lucide-react";

export default function NewCapsulePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [category, setCategory] = useState("Personal Truth");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [, setLocation] = useLocation();

  const categories = [
    "Personal Truth",
    "Scientific Truth", 
    "Truth Testimony",
    "Historical Archive",
    "Medical Truth",
    "Educational Truth",
    "Corporate Transparency",
    "Environmental Evidence",
    "Legal Documentation",
    "Cultural Heritage"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    
    setError("");
    setLoading(true);
    
    try {
      const response = await fetch("/api/capsules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          category: category,
          author: "CurrentUser", // This would come from auth context
          tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.id) {
        setSuccess(true);
        setTimeout(() => {
          setLocation(`/capsule/${data.id}`);
        }, 2000);
      } else {
        setError(data.error || "Failed to create capsule. Please try again.");
      }
    } catch (err) {
      console.error("Capsule creation error:", err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const parsedTags = tags.split(",").map(t => t.trim()).filter(Boolean);

  if (success) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-900 px-6 py-16">
        <Card className="max-w-2xl mx-auto bg-white dark:bg-slate-800">
          <CardContent className="text-center py-16">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Capsule Created Successfully!
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Your truth capsule has been minted and sealed. Redirecting to view...
            </p>
            <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 px-6 py-16">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-white dark:bg-slate-800 shadow-xl">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Package className="w-8 h-8 text-blue-600 mr-3" />
              <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">
                Create Truth Capsule
              </CardTitle>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Your truth deserves a sovereign vault. Fill out the details below to mint a new capsule on the blockchain.
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Title *
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter your capsule title"
                  className="w-full"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Category
                </label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="This memory, message, or moment..."
                  rows={5}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tags
                </label>
                <Input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Comma-separated tags (e.g. truth, legacy, grief)"
                  className="w-full"
                />
                {parsedTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {parsedTags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {error && (
                <div className="flex items-center p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                  <p className="text-red-700 dark:text-red-300 text-sm font-medium">{error}</p>
                </div>
              )}

              <Button 
                type="submit" 
                disabled={loading || !title.trim()} 
                className="w-full text-lg py-3"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Minting Capsule...
                  </>
                ) : (
                  <>
                    <Package className="w-5 h-5 mr-2" />
                    Mint Capsule Now
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
              <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                What happens next?
              </h4>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• Your capsule will be sealed with a unique blockchain signature</li>
                <li>• Community verification process begins automatically</li>
                <li>• Earn GTT tokens based on engagement and verification</li>
                <li>• Share your truth with the world or keep it private</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}